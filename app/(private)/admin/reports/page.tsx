"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueTrendsChart } from "@/components/analytics/revenue-trends-chart"
import { ServicePopularityChart } from "@/components/analytics/service-popularity-chart"
import { PeakHoursHeatmap } from "@/components/analytics/peak-hours-heatmap"
import { GeographicDistribution } from "@/components/analytics/geographic-distribution"
import { TopTherapistsTable } from "@/components/analytics/top-therapists-table"
import { ClientMetricsCards } from "@/components/analytics/client-metrics-cards"
import { ADMIN_TOKEN_STORAGE_KEY, fetchAdminReports } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reportData, setReportData] = useState<{
    revenueTrends: Array<{ date: string; revenue: number; bookings: number }>
    servicePopularity: Array<{ service: string; bookings: number; revenue: number }>
    peakHours: Array<{ day: string; hours: number[] }>
    geographic: Array<{ area: string; bookings: number; revenue: number; percentage: number }>
    topTherapists: Array<{ id: string; name: string; bookings: number; revenue: number; rating: number }>
    clientMetrics: {
      total_clients: number
      new_clients_this_month: number
      returning_clients: number
      retention_rate: number
      avg_bookings_per_client: number
      avg_spend_per_client: number
    } | null
  }>({
    revenueTrends: [],
    servicePopularity: [],
    peakHours: [],
    geographic: [],
    topTherapists: [],
    clientMetrics: null,
  })

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? ""
    setToken(savedToken)
  }, [])

  useEffect(() => {
    if (!token) return
    void loadReports(token)
  }, [token])

  async function loadReports(authToken: string) {
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetchAdminReports(authToken)
      setReportData({
        revenueTrends: (response.revenue_trends ?? []).map((item) => ({
          date: item.date,
          revenue: Number(item.revenue ?? 0),
          bookings: Number(item.bookings ?? 0),
        })),
        servicePopularity: (response.service_popularity ?? []).map((item) => ({
          service: item.service,
          bookings: Number(item.bookings ?? 0),
          revenue: Number(item.revenue ?? 0),
        })),
        peakHours: (response.peak_hours ?? []).map((item) => ({
          day: item.day,
          hours: item.hours ?? [],
        })),
        geographic: (response.geographic_distribution ?? []).map((item) => ({
          area: item.area,
          bookings: Number(item.bookings ?? 0),
          revenue: Number(item.revenue ?? 0),
          percentage: Number(item.percentage ?? 0),
        })),
        topTherapists: (response.top_therapists ?? []).map((item) => ({
          id: item.id,
          name: item.name,
          bookings: Number(item.bookings ?? 0),
          revenue: Number(item.revenue ?? 0),
          rating: Number(item.rating ?? 0),
        })),
        clientMetrics: response.client_metrics ?? null,
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load reports.")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Admin session not found. Please sign in at <strong>/login</strong> first.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-[color:var(--color-muted-foreground)]">Platform performance insights and metrics</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent text-[color:var(--color-foreground)] border-[color:var(--color-border)]">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading reports...</p> : null}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="therapists">Therapists</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <RevenueTrendsChart data={reportData.revenueTrends} />
            <ServicePopularityChart data={reportData.servicePopularity} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <PeakHoursHeatmap data={reportData.peakHours} />
            <GeographicDistribution data={reportData.geographic} />
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueTrendsChart data={reportData.revenueTrends} />
          <div className="grid gap-6 lg:grid-cols-2">
            <ServicePopularityChart data={reportData.servicePopularity} />
            <GeographicDistribution data={reportData.geographic} />
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <ClientMetricsCards metricsData={reportData.clientMetrics} />
          <div className="grid gap-6 lg:grid-cols-2">
            <PeakHoursHeatmap data={reportData.peakHours} />
            <GeographicDistribution data={reportData.geographic} />
          </div>
        </TabsContent>

        <TabsContent value="therapists" className="space-y-6">
          <TopTherapistsTable data={reportData.topTherapists} />
          <div className="grid gap-6 lg:grid-cols-2">
            <ServicePopularityChart data={reportData.servicePopularity} />
            <PeakHoursHeatmap data={reportData.peakHours} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
