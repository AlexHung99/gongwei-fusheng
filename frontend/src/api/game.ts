import { useCallback, useEffect, useRef, useState } from "react";
import { apiRequest, ApiError, createIdempotencyHeaders, isAuthRequiredError, onAuthRequired } from "./client";

export type StatValue = { value: number; label: string };
export type CharacterStatsDto = {
  vitality: StatValue;
  strategy: StatValue;
  appearance: StatValue;
  luck: StatValue;
  prestige: number;
  favor: number;
};
export type MeDto = {
  user: { id: string; displayName: string; status: string; preferences: Record<string, unknown>; version: number };
  characterState: string;
  character: null | { id: string; displayName: string; role: string; status: string; portraitUrl: string; rank?: { id: string; name: string }; version: number };
  adminRoles: string[];
  unreadNotificationCount: number;
  pendingActions: string[];
};
export type PlayerDto = {
  characterId: string;
  displayName: string;
  role: string;
  rankName: string;
  status: string;
  portraitUrl: string;
  lastSeenAt: string;
  lastSeenLabel: string;
  stats: Pick<CharacterStatsDto, "vitality" | "strategy" | "appearance" | "luck">;
};
export type ChronicleDto = {
  id: string;
  entryType: string;
  visibility: string;
  title: string;
  detail: string;
  location?: { id: string; code: string; name: string };
  statChanges: { field: string; before: number; delta: number; after: number; afterLabel?: string }[];
  resourceChanges: { resource: string; before: number; delta: number; after: number }[];
  happenedAt: string;
};
export type StaffDto = { displayName: string; title: string; duty: string; lastSeenAt: string; lastSeenLabel: string; sortOrder: number };
export type NpcDto = { code: string; displayName: string; title: string; sex: string; summary: string; storyMarkdown: string; portraitUrl: string; publicProfile?: { courtesyName?: string; stats?: Record<string, StatValue> } };
export type EventDto = { id: string; code?: string; title: string; type?: string; status?: string; summary?: string; location?: { name: string }; participantCount?: number; joinDeadline?: string };
export type MarketOfferDto = { id: string; itemCode?: string; displayName?: string; name?: string; category: string; unitPrice?: number; price?: number; description?: string; effectSummary?: string; requiresModeration?: boolean; riskLevel?: string };
export type InventoryDto = { id: string; itemCode: string; displayName?: string; name?: string; category?: string; quantity: number; acquiredAt?: string; effectSummary?: string };
export type WalletDto = { currencyCode: string; balance: number };
export type WorldStateDto = { eraName?: string; displayDate?: string; currentDateLabel?: string; maintenanceMode?: boolean };
export type SupportDto = { enabled: boolean; configured: boolean; url: string | null; label: string; version: number };
export type CharacterRole = "consort" | "prince" | "princess";
export type CharacterApplicationPayload = {
  role: CharacterRole;
  familyName: string;
  givenName: string;
  courtesyName: string | null;
  birthDateLabel: string | null;
  age: number;
  appearance: string;
  biography: string;
  personality: string;
  strengths: string;
  weaknesses: string;
  likes: string;
  dislikes: string;
  portraitId: string | null;
  playerPortraitSubmissionId: string | null;
  formData: Record<string, unknown>;
};
export type CharacterApplicationDto = CharacterApplicationPayload & {
  id: string;
  status: "draft" | "submitted" | "needsRevision" | "needs_revision" | "approved" | "rejected" | "cancelled";
  version: number;
  reviewNote?: string | null;
  submittedAt?: string | null;
};
export type PortraitSummaryDto = {
  id: string;
  role: CharacterRole;
  displayName?: string;
  name?: string;
  assetUrl?: string;
  imageUrl?: string;
  portraitUrl?: string;
  url?: string;
  thumbnailUrl?: string;
};
type CursorPage<T> = { items: T[]; nextCursor: string | null };

export type GameApiState = {
  phase: "loading" | "guest" | "ready" | "degraded";
  me: MeDto | null;
  stats: CharacterStatsDto | null;
  chronicle: ChronicleDto[];
  players: PlayerDto[];
  staff: StaffDto[];
  npcs: NpcDto[];
  events: EventDto[];
  offers: MarketOfferDto[];
  inventory: InventoryDto[];
  wallets: WalletDto[];
  world: WorldStateDto | null;
  support: SupportDto | null;
  application: CharacterApplicationDto | null;
  applicationApiAvailable: boolean;
  unavailable: string[];
};

const initialState: GameApiState = { phase: "loading", me: null, stats: null, chronicle: [], players: [], staff: [], npcs: [], events: [], offers: [], inventory: [], wallets: [], world: null, support: null, application: null, applicationApiAvailable: true, unavailable: [] };

async function optional<T>(label: string, path: string, signal?: AbortSignal): Promise<{ label: string; value?: T }> {
  try { return { label, value: await apiRequest<T>(path, { signal }) }; }
  catch (error) {
    if (isAuthRequiredError(error) || (error instanceof DOMException && error.name === "AbortError")) throw error;
    return { label };
  }
}

export function useGameApi() {
  const [state, setState] = useState<GameApiState>(initialState);
  const refreshSequence = useRef(0);
  const refreshController = useRef<AbortController | null>(null);

  const clearSession = useCallback(() => {
    refreshSequence.current += 1;
    refreshController.current?.abort();
    refreshController.current = null;
    setState({ ...initialState, phase: "guest" });
  }, []);

  const refresh = useCallback(async () => {
    const sequence = refreshSequence.current + 1;
    refreshSequence.current = sequence;
    refreshController.current?.abort();
    const controller = new AbortController();
    refreshController.current = controller;
    const { signal } = controller;
    const isCurrent = () => !signal.aborted && refreshSequence.current === sequence;

    setState((current) => ({ ...current, phase: "loading", unavailable: [] }));
    let supportResult: { label: string; value?: SupportDto };
    try {
      supportResult = await optional<SupportDto>("贊助設定", "/public-settings/support", signal);
    } catch (error) {
      if (signal.aborted || isAuthRequiredError(error)) return;
      throw error;
    }
    let me: MeDto;
    try {
      me = await apiRequest<MeDto>("/me", { signal });
    } catch (error) {
      if (!isCurrent()) return;
      const guest = error instanceof ApiError && error.status === 401;
      setState({ ...initialState, phase: guest ? "guest" : "degraded", support: supportResult.value ?? null, unavailable: guest ? [] : ["登入狀態"] });
      return;
    }
    if (!isCurrent()) return;

    const characterId = me.character?.id;
    let application: CharacterApplicationDto | null = null;
    let applicationApiAvailable = true;
    if (!characterId) {
      try { application = (await apiRequest<CharacterApplicationDto | undefined>("/character-applications/current", { signal })) ?? null; }
      catch (error) {
        if (!isCurrent() || isAuthRequiredError(error)) return;
        applicationApiAvailable = false;
      }

      // Accounts without an approved character stay inside the onboarding
      // boundary. Do not preload palace, player, event, market or inventory
      // data until the backend returns a formal character from GET /me.
      if (!isCurrent()) return;
      setState({
        ...initialState,
        phase: applicationApiAvailable ? "ready" : "degraded",
        me,
        support: supportResult.value ?? null,
        application,
        applicationApiAvailable,
        unavailable: applicationApiAvailable ? [] : ["建角申請"],
      });
      return;
    }
    const requests = await Promise.all([
      characterId ? optional<CharacterStatsDto>("人物能力", "/characters/me/stats", signal) : Promise.resolve({ label: "人物能力", value: null }),
      characterId ? optional<CursorPage<ChronicleDto>>("人物歷程", `/characters/${encodeURIComponent(characterId)}/chronicle?scope=all&limit=100`, signal) : Promise.resolve({ label: "人物歷程", value: { items: [], nextCursor: null } }),
      optional<CursorPage<PlayerDto>>("玩家名冊", "/players?limit=100", signal),
      optional<StaffDto[]>("管理名單", "/staff", signal),
      optional<CursorPage<{ code: string }>>("NPC 名冊", "/npcs?limit=100", signal),
      optional<CursorPage<EventDto>>("事件", "/events?limit=100", signal),
      characterId ? optional<CursorPage<MarketOfferDto>>("宮市", "/market/offers?limit=100", signal) : Promise.resolve({ label: "宮市", value: { items: [], nextCursor: null } }),
      characterId ? optional<CursorPage<InventoryDto>>("庫存", "/inventory?limit=100", signal) : Promise.resolve({ label: "庫存", value: { items: [], nextCursor: null } }),
      characterId ? optional<WalletDto[]>("銀兩", "/wallets", signal) : Promise.resolve({ label: "銀兩", value: [] }),
      optional<WorldStateDto>("宮廷日曆", "/world/state", signal),
    ]).catch((error) => {
      if (signal.aborted || isAuthRequiredError(error)) return null;
      throw error;
    });
    if (!requests || !isCurrent()) return;
    const [stats, history, players, staff, npcIndex, events, offers, inventory, wallets, world] = requests;
    let npcDetails: NpcDto[] = [];
    if (npcIndex.value?.items.length) {
      const details = await Promise.all(npcIndex.value.items.map((npc) => optional<NpcDto>("NPC", `/npcs/${encodeURIComponent(npc.code)}`, signal))).catch((error) => {
        if (signal.aborted || isAuthRequiredError(error)) return null;
        throw error;
      });
      if (!details || !isCurrent()) return;
      npcDetails = details.flatMap((result) => result.value ? [result.value] : []);
    }
    const unavailable = requests.filter((item) => item.value === undefined).map((item) => item.label);
    if (npcIndex.value && npcDetails.length !== npcIndex.value.items.length) unavailable.push("NPC 詳情");
    if (!isCurrent()) return;
    setState({
      phase: unavailable.length ? "degraded" : "ready", me,
      stats: stats.value ?? null,
      chronicle: history.value?.items ?? [], players: players.value?.items ?? [], staff: staff.value ?? [], npcs: npcDetails,
      events: events.value?.items ?? [], offers: offers.value?.items ?? [], inventory: inventory.value?.items ?? [], wallets: wallets.value ?? [], world: world.value ?? null,
      support: supportResult.value ?? null,
      application,
      applicationApiAvailable,
      unavailable,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthRequired(clearSession);
    void refresh();
    return () => {
      unsubscribe();
      refreshSequence.current += 1;
      refreshController.current?.abort();
    };
  }, [clearSession, refresh]);

  const purchase = async (marketOfferId: string) => apiRequest<{ walletBalance: number }>("/market/purchases", { method: "POST", headers: createIdempotencyHeaders(), body: JSON.stringify({ marketOfferId, quantity: 1 }) });
  const useItem = async (entryId: string) => apiRequest<void>(`/inventory/${entryId}/use`, { method: "POST", headers: createIdempotencyHeaders(), body: JSON.stringify({ quantity: 1, targetCharacterId: null, context: {} }) });
  const uploadPortrait = async (file: File, role = "consort") => { const body = new FormData(); body.append("file", file); body.append("role", role); return apiRequest<{ id: string; previewUrl?: string; url?: string }>("/portrait-uploads", { method: "POST", headers: createIdempotencyHeaders(), body }); };
  const getPortraits = useCallback((role: CharacterRole, signal?: AbortSignal) => apiRequest<PortraitSummaryDto[]>(`/portraits?role=${encodeURIComponent(role)}`, { signal }), []);
  const saveApplication = async (payload: CharacterApplicationPayload, current?: CharacterApplicationDto | null) => current
    ? apiRequest<CharacterApplicationDto>(`/character-applications/${encodeURIComponent(current.id)}`, { method: "PATCH", headers: { "If-Match": `"${current.version}"` }, body: JSON.stringify(payload) })
    : apiRequest<CharacterApplicationDto>("/character-applications", { method: "POST", headers: createIdempotencyHeaders(), body: JSON.stringify(payload) });
  const submitApplication = async (application: CharacterApplicationDto) => apiRequest<CharacterApplicationDto>(`/character-applications/${encodeURIComponent(application.id)}/submit`, { method: "POST", headers: createIdempotencyHeaders(), body: JSON.stringify({ expectedVersion: application.version }) });

  return { state, refresh, clearSession, purchase, useItem, uploadPortrait, getPortraits, saveApplication, submitApplication };
}
