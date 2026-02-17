import { getCfAuthCookie } from '@/utils/cookie';

// ── Base URLs ───────────────────────────────────────────────────────────────
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL;

export const RESUME_API_URL =
  process.env.NEXT_PUBLIC_RESUME_API_URL;

// ── Error class ─────────────────────────────────────────────────────────────
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    const msg =
      typeof body === 'object' && body !== null && 'message' in body
        ? String((body as Record<string, unknown>).message)
        : `Request failed with status ${status}`;
    super(msg);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// ── Internal helpers ────────────────────────────────────────────────────────
async function parseResponse(res: Response) {
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

async function handleResponse(res: Response) {
  const data = await parseResponse(res);
  if (!res.ok) {
    throw new ApiError(res.status, data);
  }
  return data;
}

// ── Public helpers ──────────────────────────────────────────────────────────

/** Returns the auth token from the cookie, or null. */
export function getAuthToken(): string | null {
  return getCfAuthCookie();
}

/** Standard JSON GET request. */
export async function apiGet(
  url: string,
  opts?: RequestInit,
) {
  const res = await fetch(url, {
    method: 'GET',
    ...opts,
  });
  return handleResponse(res);
}

/** Standard JSON POST request. */
export async function apiPost(
  url: string,
  body: unknown,
  opts?: RequestInit,
) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(opts?.headers as Record<string, string> | undefined),
    },
    body: JSON.stringify(body),
    ...opts,
    // ensure headers merge correctly
  });
  return handleResponse(res);
}

/** POST with FormData (browser sets Content-Type + boundary automatically). */
export async function apiPostFormData(
  url: string,
  formData: FormData,
  opts?: RequestInit,
) {
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    ...opts,
  });
  return handleResponse(res);
}
