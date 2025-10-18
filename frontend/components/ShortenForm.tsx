"use client";

import { useState, useEffect } from "react";
import { shorten, type ShortenResp } from "@/lib/api";

export default function ShortenerForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortenResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  // nạp kết quả gần nhất từ localStorage (tuỳ chọn)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("last_shorten_result");
      if (raw) setResult(JSON.parse(raw));
    } catch {}
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await shorten(input.trim());
      setResult(res);
      // lưu để Stats có thể lấy lại id
      localStorage.setItem("last_shorten_result", JSON.stringify(res));
    } catch (err: any) {
      setError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Dán URL cần rút gọn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Đang tạo…" : "Rút gọn"}
        </button>
      </form>

      {error && (
        <div className="rounded border p-3 bg-red-50 text-red-700">{error}</div>
      )}

      {result && (
        <div className="rounded border p-3 bg-green-50 space-y-1">
          <div className="font-medium">Short URL</div>
          <a
            className="text-blue-600 underline"
            href={result.short_url}
            target="_blank"
          >
            {result.short_url}
          </a>
          <div className="text-sm text-gray-600">
            Slug: <code>{result.slug}</code> — ID: <code>{result.id}</code>
          </div>

          {/* Link sang trang Stats, truyền id qua query */}
          <a
            className="inline-block mt-2 text-blue-600 underline"
            href={`/stats?id=${encodeURIComponent(result.id)}`}
          >
            Xem thống kê (Stats)
          </a>
        </div>
      )}
    </div>
  );
}
