import { authClient } from "@/lib/auth-client";

// Every call to the Express server goes through here, so the base URL
// and the JWT auth header live in one place.
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// Cached JWT from Better Auth (GET /api/auth/token). Tokens last 15 minutes;
// refresh a little early so a request never leaves with an expiring token.
let cached = null; // { token, exp }
let pending = null;
const EARLY_REFRESH_MS = 60 * 1000;

const readExp = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp * 1000;
  } catch {
    return 0;
  }
};

async function getToken() {
  if (cached && cached.exp - EARLY_REFRESH_MS > Date.now()) return cached.token;

  // Parallel requests share one token fetch
  pending ??= authClient
    .token()
    .then(({ data }) => {
      cached = data?.token ? { token: data.token, exp: readExp(data.token) } : null;
      return cached?.token || null;
    })
    .catch(() => null)
    .finally(() => {
      pending = null;
    });

  return pending;
}

// Call on logout so the next user never reuses the previous user's token
export function clearApiToken() {
  cached = null;
}

// `auth: false` skips the token for public endpoints (board, donor search)
export async function apiFetch(path, { body, headers, auth = true, ...options } = {}, isRetry = false) {
  const token = auth ? await getToken() : null;

  const res = await fetch(`${serverUrl}${path}`, {
    ...options,
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Expired or rotated token: fetch a fresh one and try once more
  if (res.status === 401 && token && !isRetry) {
    clearApiToken();
    return apiFetch(path, { body, headers, auth, ...options }, true);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}
