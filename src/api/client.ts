const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function unwrap<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function apiGet<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
  return fetch(buildUrl(path, params)).then(unwrap<T>);
}

export function apiPost<T>(path: string, body?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
  return fetch(buildUrl(path, params), {
    method: "POST",
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }).then(unwrap<T>);
}

export function apiPatch<T>(path: string, body: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
  return fetch(buildUrl(path, params), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(unwrap<T>);
}

export function apiPostForm<T>(
  path: string,
  form: FormData,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  return fetch(buildUrl(path, params), { method: "POST", body: form }).then(unwrap<T>);
}
