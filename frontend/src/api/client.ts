const API_BASE = '/api';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const raw = localStorage.getItem('auth-storage');
  const token = raw
    ? (JSON.parse(raw) as { state?: { token?: string } })?.state?.token
    : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' })) as { detail?: string };
    throw new Error(error.detail ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, data?: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(path: string, data?: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};
