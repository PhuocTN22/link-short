// frontend/lib/api.ts
// Client fetch helpers gọi sang Laravel qua biến môi trường public.
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type ShortenResp = { id: number; slug: string; short_url: string };

async function asJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function shorten(url: string) {
  const r = await fetch(`${BASE}/api/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return asJson<ShortenResp>(r);
}

export async function getStats(urlId: number) {
  const r = await fetch(`${BASE}/api/stats?urlId=${urlId}`, { method: "GET" });
  return asJson<{ clicks_count: number; recent: any[] }>(r);
}

export async function getStatsBySlug(slug: string) {
  const r = await fetch(`${BASE}/api/stats?slug=${encodeURIComponent(slug)}`, {
    method: "GET",
  });
  // chấp nhận recent hoặc recent_clicks
  const raw: any = await asJson<any>(r);
  const recent = Array.isArray(raw.recent_clicks)
    ? raw.recent_clicks
    : raw.recent ?? [];
  return {
    url: raw.url ?? null,
    clicks_count: Number(raw.clicks_count ?? 0),
    recent,
  };
}
