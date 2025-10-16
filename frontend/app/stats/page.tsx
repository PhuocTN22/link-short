"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ClickData {
  id: string
  timestamp: string
  ip: string
  referrer: string
  userAgent: string
}

export default function StatsPage() {
  const searchParams = useSearchParams()
  const shortUrl = searchParams.get("url") || ""
  const [clicks, setClicks] = useState<ClickData[]>([])
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch stats from API
    // const fetchStats = async () => {
    //   const response = await fetch(`/api/stats?url=${encodeURIComponent(shortUrl)}`)
    //   const data = await response.json()
    //   setClicks(data.clicks)
    //   setQrCodeUrl(data.qrCode)
    //   setIsLoading(false)
    // }
    // fetchStats()

    // Mock data for UI demonstration
    setTimeout(() => {
      setClicks([
        {
          id: "1",
          timestamp: new Date().toISOString(),
          ip: "192.168.1.1",
          referrer: "https://google.com",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          ip: "192.168.1.2",
          referrer: "Direct",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1",
        },
        {
          id: "3",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          ip: "192.168.1.3",
          referrer: "https://facebook.com",
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
        },
      ])
      setQrCodeUrl(`/placeholder.svg?height=200&width=200&query=QR code for ${shortUrl}`)
      setIsLoading(false)
    }, 800)
  }, [shortUrl])

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">Thống kê truy cập</h1>
          <p className="text-muted-foreground break-all">{shortUrl}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Stats Summary */}
          <div className="lg:col-span-3 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Tổng lượt click</CardDescription>
                <CardTitle className="text-3xl">{clicks.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Click hôm nay</CardDescription>
                <CardTitle className="text-3xl">
                  {
                    clicks.filter((c) => {
                      const clickDate = new Date(c.timestamp).toDateString()
                      const today = new Date().toDateString()
                      return clickDate === today
                    }).length
                  }
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Trạng thái</CardDescription>
                <CardTitle className="text-3xl text-green-600">Hoạt động</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* QR Code */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Mã QR</CardTitle>
              <CardDescription>Quét để truy cập link</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {isLoading ? (
                <div className="w-48 h-48 bg-muted animate-pulse rounded-lg" />
              ) : (
                <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48 border rounded-lg" />
              )}
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
            </CardContent>
          </Card>

          {/* Clicks Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Lịch sử truy cập</CardTitle>
              <CardDescription>Danh sách các lượt click gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : clicks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">Chưa có lượt truy cập nào</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Thời gian</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">IP</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Nguồn</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Thiết bị</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clicks.map((click) => (
                        <tr key={click.id} className="border-b last:border-0">
                          <td className="py-3 px-2 text-sm">{formatDate(click.timestamp)}</td>
                          <td className="py-3 px-2 text-sm font-mono">{click.ip}</td>
                          <td className="py-3 px-2 text-sm">
                            {click.referrer === "Direct" ? (
                              <span className="text-muted-foreground">Trực tiếp</span>
                            ) : (
                              <span className="text-blue-600">{truncateText(click.referrer, 20)}</span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">
                            {truncateText(click.userAgent, 30)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
