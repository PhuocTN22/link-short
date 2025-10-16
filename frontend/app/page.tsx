"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Link2, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ShortenedLink {
  shortUrl: string
  originalUrl: string
}

export default function HomePage() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [password, setPassword] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [maxClicks, setMaxClicks] = useState("")
  const [shortenedLink, setShortenedLink] = useState<ShortenedLink | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleShorten = async () => {
    if (!originalUrl) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL cần rút gọn",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // TODO: Call API to shorten URL
    // const response = await fetch('/api/shorten', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     original_url: originalUrl,
    //     password: password || undefined,
    //     expires_at: expiresAt || undefined,
    //     max_clicks: maxClicks ? parseInt(maxClicks) : undefined,
    //   }),
    // })
    // const data = await response.json()

    // Mock response for UI demonstration
    setTimeout(() => {
      setShortenedLink({
        shortUrl: `https://short.link/${Math.random().toString(36).substring(7)}`,
        originalUrl,
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleCopy = () => {
    if (shortenedLink) {
      navigator.clipboard.writeText(shortenedLink.shortUrl)
      toast({
        title: "Đã sao chép!",
        description: "Link đã được sao chép vào clipboard",
      })
    }
  }

  const handleReset = () => {
    setOriginalUrl("")
    setPassword("")
    setExpiresAt("")
    setMaxClicks("")
    setShortenedLink(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Link2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-balance">Link Shortener</h1>
          </div>
          <p className="text-muted-foreground text-lg">Rút gọn link nhanh chóng, dễ dàng và miễn phí</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Tạo link rút gọn</CardTitle>
            <CardDescription>Nhập URL và các tùy chọn bảo mật (nếu cần)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!shortenedLink ? (
              <>
                {/* Original URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="original-url">
                    URL gốc <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="original-url"
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Optional Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu (tùy chọn)</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Bảo vệ link bằng mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-clicks">Số lượt click tối đa</Label>
                    <Input
                      id="max-clicks"
                      type="number"
                      placeholder="Không giới hạn"
                      value={maxClicks}
                      onChange={(e) => setMaxClicks(e.target.value)}
                      min="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires-at">Thời gian hết hạn</Label>
                  <Input
                    id="expires-at"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>

                {/* Shorten Button */}
                <Button onClick={handleShorten} disabled={isLoading} className="w-full text-base h-11" size="lg">
                  {isLoading ? "Đang xử lý..." : "Rút gọn"}
                </Button>
              </>
            ) : (
              <>
                {/* Success Result */}
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Link rút gọn</Label>
                      <div className="flex items-center gap-2">
                        <Input value={shortenedLink.shortUrl} readOnly className="font-mono text-base bg-background" />
                        <Button onClick={handleCopy} variant="outline" size="icon" className="shrink-0 bg-transparent">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">URL gốc</Label>
                      <p className="text-sm break-all text-foreground">{shortenedLink.originalUrl}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <Link href={`/stats?url=${encodeURIComponent(shortenedLink.shortUrl)}`}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Xem thống kê
                      </Link>
                    </Button>
                    <Button onClick={handleReset} variant="default" className="flex-1">
                      Tạo link mới
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Miễn phí • Không giới hạn • Bảo mật</p>
        </div>
      </div>
    </div>
  )
}
