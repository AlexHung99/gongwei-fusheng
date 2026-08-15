export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://api.example.com/api/v1";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const requestId = crypto.randomUUID();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Request-Id": requestId,
      ...init.headers,
    },
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      problem.code ?? "UNKNOWN_ERROR",
      problem.title ?? "系統暫時無法完成這項操作",
      problem.requestId ?? requestId,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
