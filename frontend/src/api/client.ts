const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim();
export const API_BASE_URL = (
  configuredApiBaseUrl || "https://gongwei-api.miglow.vip/api/v1"
).replace(/\/$/, "");

type ProblemDetails = {
  code?: string;
  title?: string;
  detail?: string;
  requestId?: string;
};

const AUTH_REQUIRED_EVENT = "gongwei:auth-required";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let csrfToken: string | null = null;

export function isAuthRequiredError(error: unknown): error is ApiError {
  return error instanceof ApiError
    && (error.code === "AUTH_REQUIRED" || error.status === 401);
}

export function onAuthRequired(listener: () => void): () => void {
  window.addEventListener(AUTH_REQUIRED_EVENT, listener);
  return () => window.removeEventListener(AUTH_REQUIRED_EVENT, listener);
}

function announceAuthRequired(): void {
  window.dispatchEvent(new Event(AUTH_REQUIRED_EVENT));
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const requestId = crypto.randomUUID();
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");
  headers.set("X-Request-Id", requestId);

  const method = (init.method ?? "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    if (!csrfToken) {
      const token = await apiRequest<{ token: string }>("/auth/csrf");
      csrfToken = token.token;
    }
    headers.set("X-CSRF-Token", csrfToken);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const problem = (await response.json().catch(() => ({}))) as ProblemDetails;
    if (response.status === 401) csrfToken = null;
    const error = new ApiError(
      response.status,
      problem.code ?? "UNKNOWN_ERROR",
      problem.detail ?? problem.title ?? `系統暫時無法完成這項操作（HTTP ${response.status}）`,
      problem.requestId ?? response.headers.get("X-Request-Id") ?? requestId,
    );
    if (isAuthRequiredError(error)) announceAuthRequired();
    throw error;
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function createIdempotencyHeaders(): HeadersInit {
  return { "Idempotency-Key": crypto.randomUUID() };
}

export function getFrontendReturnUrl(): string {
  const path = window.location.pathname.endsWith("/")
    ? window.location.pathname
    : `${window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1)}`;
  return `${window.location.origin}${path}#/home`;
}

export function startLineLogin(): void {
  const returnUrl = encodeURIComponent(getFrontendReturnUrl());
  window.location.assign(`${API_BASE_URL}/auth/line/start?returnUrl=${returnUrl}`);
}

export async function logout(): Promise<void> {
  const requestLogout = () => apiRequest<void>("/auth/logout", {
    method: "POST",
    // An explicit body makes WebKit send a request length. Without it,
    // IIS can reject a bodyless POST with 411 before ASP.NET Core runs.
    body: JSON.stringify({}),
  });

  try {
    try {
      await requestLogout();
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 403) throw error;

      // A session-bound CSRF token may expire while the page stays open.
      // Clear it once so apiRequest fetches a fresh token and retries logout.
      csrfToken = null;
      await requestLogout();
    }
  } finally {
    csrfToken = null;
  }
}
