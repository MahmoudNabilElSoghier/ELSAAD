// Fetch wrapper for the ELSAAD NestJS API (apps/api).
// Every API response is { data, isMock } — these helpers unwrap `data` so call
// sites keep the same shapes the old local services returned.
// Base URL resolution: NEXT_PUBLIC_API_URL (browser) → API_URL (server) →
// http://localhost:4000/api. Admin writes read ADMIN_API_KEY server-side only —
// never expose it through NEXT_PUBLIC_* (it would ship to the browser).

export interface ApiResponse<T> {
  data: T;
  isMock: boolean;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const baseUrl = (): string =>
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:4000/api";

async function request<T>(
  path: string,
  init: RequestInit & { method?: string } = {},
): Promise<ApiResponse<T>> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  // Attach the admin key only for mutating calls, and only server-side.
  if (init.method && init.method !== "GET" && process.env.ADMIN_API_KEY) {
    headers.set("x-admin-api-key", process.env.ADMIN_API_KEY);
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    throw new ApiError(
      0,
      `API unreachable at ${baseUrl()}${path} (${error instanceof Error ? error.message : String(error)}) — is apps/api running?`,
    );
  }

  if (!response.ok) {
    let message = `Request failed with HTTP ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join("; ");
      else if (body.message) message = body.message;
    } catch {
      // non-JSON error body — keep the default message
    }
    throw new ApiError(response.status, message);
  }

  return (await response.json()) as ApiResponse<T>;
}

export async function apiGet<T>(path: string): Promise<T> {
  return (await request<T>(path)).data;
}

// For endpoints the old local services answered with null — a 404 from the API
// maps back to null so page-level `if (!x) notFound()` checks keep working.
export async function apiGetOrNull<T>(path: string): Promise<T | null> {
  try {
    return await apiGet<T>(path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function apiSend<T>(
  method: "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  return (
    await request<T>(path, {
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  ).data;
}
