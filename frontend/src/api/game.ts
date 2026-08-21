import { useCallback, useEffect, useState } from "react";
import { apiRequest, ApiError, createIdempotencyHeaders } from "./client";

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
  unavailable: string[];
};

const initialState: GameApiState = { phase: "loading", me: null, stats: null, chronicle: [], players: [], staff: [], npcs: [], events: [], offers: [], inventory: [], wallets: [], world: null, support: null, unavailable: [] };

async function optional<T>(label: string, path: string): Promise<{ label: string; value?: T }> {
  try { return { label, value: await apiRequest<T>(path) }; }
  catch { return { label }; }
}

export function useGameApi() {
  const [state, setState] = useState<GameApiState>(initialState);

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, phase: "loading", unavailable: [] }));
    const supportResult = await optional<SupportDto>("贊助設定", "/public-settings/support");
    let me: MeDto;
    try {
      me = await apiRequest<MeDto>("/me");
    } catch (error) {
      const guest = error instanceof ApiError && error.status === 401;
      setState({ ...initialState, phase: guest ? "guest" : "degraded", support: supportResult.value ?? null, unavailable: guest ? [] : ["登入狀態"] });
      return;
    }

    const characterId = me.character?.id;
    const requests = await Promise.all([
      optional<CharacterStatsDto>("人物能力", "/characters/me/stats"),
      characterId ? optional<CursorPage<ChronicleDto>>("人物歷程", `/characters/${encodeURIComponent(characterId)}/chronicle?scope=all&limit=100`) : Promise.resolve({ label: "人物歷程", value: { items: [], nextCursor: null } }),
      optional<CursorPage<PlayerDto>>("玩家名冊", "/players?limit=100"),
      optional<StaffDto[]>("管理名單", "/staff"),
      optional<CursorPage<{ code: string }>>("NPC 名冊", "/npcs?limit=100"),
      optional<CursorPage<EventDto>>("事件", "/events?limit=100"),
      optional<CursorPage<MarketOfferDto>>("宮市", "/market/offers?limit=100"),
      optional<CursorPage<InventoryDto>>("庫存", "/inventory?limit=100"),
      optional<WalletDto[]>("銀兩", "/wallets"),
      optional<WorldStateDto>("宮廷日曆", "/world/state"),
    ]);
    const [stats, history, players, staff, npcIndex, events, offers, inventory, wallets, world] = requests;
    let npcDetails: NpcDto[] = [];
    if (npcIndex.value?.items.length) {
      const details = await Promise.all(npcIndex.value.items.map((npc) => optional<NpcDto>("NPC", `/npcs/${encodeURIComponent(npc.code)}`)));
      npcDetails = details.flatMap((result) => result.value ? [result.value] : []);
    }
    const unavailable = requests.filter((item) => item.value === undefined).map((item) => item.label);
    if (npcIndex.value && npcDetails.length !== npcIndex.value.items.length) unavailable.push("NPC 詳情");
    setState({
      phase: unavailable.length ? "degraded" : "ready", me,
      stats: stats.value ?? null,
      chronicle: history.value?.items ?? [], players: players.value?.items ?? [], staff: staff.value ?? [], npcs: npcDetails,
      events: events.value?.items ?? [], offers: offers.value?.items ?? [], inventory: inventory.value?.items ?? [], wallets: wallets.value ?? [], world: world.value ?? null,
      support: supportResult.value ?? null,
      unavailable,
    });
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const purchase = async (marketOfferId: string) => apiRequest<{ walletBalance: number }>("/market/purchases", { method: "POST", headers: createIdempotencyHeaders(), body: JSON.stringify({ marketOfferId, quantity: 1 }) });
  const useItem = async (entryId: string) => apiRequest<void>(`/inventory/${entryId}/use`, { method: "POST", headers: createIdempotencyHeaders(), body: JSON.stringify({ quantity: 1, targetCharacterId: null, context: {} }) });
  const uploadPortrait = async (file: File, role = "consort") => { const body = new FormData(); body.append("file", file); body.append("role", role); return apiRequest<{ id: string; previewUrl?: string; url?: string }>("/portrait-uploads", { method: "POST", headers: createIdempotencyHeaders(), body }); };

  return { state, refresh, purchase, useItem, uploadPortrait };
}
