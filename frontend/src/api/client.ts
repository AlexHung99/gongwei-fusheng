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
    throw new ApiError(
      response.status,
      problem.code ?? "UNKNOWN_ERROR",
      problem.detail ?? problem.title ?? "系統暫時無法完成這項操作",
      problem.requestId ?? response.headers.get("X-Request-Id") ?? requestId,
    );
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
  await apiRequest<void>("/auth/logout", { method: "POST" });
  csrfToken = null;
}
