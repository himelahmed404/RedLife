// Every call to the Express server goes through here, so the base URL
// (and later the auth header) lives in one place.
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function apiFetch(path, { body, headers, ...options } = {}) {
  const res = await fetch(`${serverUrl}${path}`, {
    ...options,
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}
