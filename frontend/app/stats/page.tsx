"use client";

import { useEffect, useState } from "react";
import { getStatsBySlug } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";

function extractSlug(u: string): string | null {
  try {
    const url = new URL(u);
    const parts = url.pathname.split("/").filter(Boolean);
    const rIdx = parts.findIndex((p) => p === "r");
    if (rIdx >= 0 && parts[rIdx + 1]) return parts[rIdx + 1];
    return parts[parts.length - 1] ?? null;
  } catch {
    return null;
  }
}

export default function StatsPage() {
  const search = useSearchParams();
  const router = useRouter();
  const qsUrl = search.get("url");
  const qsId = search.get("id");
  const [slug, setSlug] = useState<string | null>(null);
  const [data, setData] = useState<{
    url: any;
    clicks_count: number;
    recent: any[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (qsUrl) {
      const s = extractSlug(qsUrl);
      if (s) {
        setSlug(s);
        return;
      }
      setErr("Không tách được slug từ tham số url.");
      return;
    }
    try {
      const last = localStorage.getItem("last_shorten_result");
      if (last) {
        const obj = JSON.parse(last);
        if (obj?.short_url) {
          const s = extractSlug(obj.short_url);
          if (s) setSlug(s);
        }
      }
    } catch {}
  }, [qsUrl, qsId]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setErr(null);
    setData(null);
    getStatsBySlug(slug)
      .then(setData)
      .catch((e: any) => setErr(e?.message ?? "Không lấy được thống kê"))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Thống kê</h1>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Dán short URL (https://localhost/r/4lxevp) hoặc slug (4lxevp)"
          className="rounded border px-3 py-2 w-full"
          defaultValue={qsUrl ?? ""}
          onBlur={(e) => {
            const v = e.target.value.trim();
            const s = v.includes("://") ? extractSlug(v) : v;
            setSlug(s || null);
          }}
        />
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={!slug || loading}
          onClick={() => slug && setSlug(slug)} // trigger refetch
        >
          {loading ? "Đang tải…" : "Lấy thống kê"}
        </button>
      </div>

      {err && (
        <div className="rounded border p-3 bg-red-50 text-red-700">{err}</div>
      )}
      {loading && <p>Đang tải…</p>}

      {data && !loading && !err && (
        <div className="rounded border p-3 bg-white space-y-2">
          <div className="text-sm text-gray-700">
            Tổng lượt click: <b>{data.clicks_count}</b>
          </div>
          <div className="text-sm font-medium mt-2">Gần đây</div>
          {data.recent?.length ? (
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {data.recent.map((r: any, i: number) => (
                <li key={i}>
                  {r.created_at ?? r.ts ?? ""} {r.ip ? `— IP: ${r.ip}` : ""}{" "}
                  {r.user_agent ?? r.ua ? `— UA: ${r.user_agent ?? r.ua}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <em className="text-sm text-gray-500">Chưa có click nào.</em>
          )}
        </div>
      )}

      {/* Nút quay lại trang chủ */}
      <div className="pt-4">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          ⬅️ Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}
