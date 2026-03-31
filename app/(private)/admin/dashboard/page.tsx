 "use client"

import { useEffect, useMemo, useState } from "react"
import { MetricCard } from "@/components/metric-card"
import { BookingTable } from "@/components/booking-table"
import { AlertsList } from "@/components/alerts-list"
import { RevenueChart } from "@/components/revenue-chart"
import { LiveMapPlaceholder } from "@/components/live-map-placeholder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert } from "@/lib/mock-data"
import { Calendar, Users, DollarSign, CreditCard, ArrowRight, TrendingUp } from "lucide-react"
import {
  ADMIN_TOKEN_STORAGE_KEY,
  fetchAdminDashboardStats,
  type AdminDashboardRecentAlert,
  type AdminDashboardRecentBooking,
} from "@/lib/api"
import type { Booking } from "@/lib/mock-data"

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`
}

function fullName(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ").trim() || "Unknown"
}

function normalizeBookingStatus(status?: string | null): Booking["status"] {
  const value = (status ?? "").toLowerCase()
  if (value === "requested" || value === "pending") return "Requested"
  if (value === "confirmed" || value === "accepted") return "Confirmed"
  if (value === "en_route" || value === "arrived" || value === "in_progress" || value === "ongoing") return "Ongoing"
  if (value === "completed") return "Completed"
  return "Cancelled"
}

function mapAlertType(type?: string | null): Alert["type"] {
  const value = (type ?? "").toLowerCase()
  if (value.includes("low_rating") || value.includes("cancellation")) return "warning"
  if (value.includes("message")) return "info"
  return "error"
}

function mapRecentBooking(item: AdminDashboardRecentBooking): Booking {
  const totalAmount = Number(item.total_amount ?? 0)
  return {
    id: item.booking_number || `BK-${item.id}`,
    clientId: String(item.customer?.id ?? "NA"),
    clientName: fullName(item.customer?.first_name, item.customer?.last_name),
    therapistId: String(item.therapist?.id ?? "NA"),
    therapistName: item.therapist?.nickname || "Therapist",
    serviceType: item.service?.name || "N/A",
    location: item.location?.address || "N/A",
    status: normalizeBookingStatus(item.status),
    scheduledAt: item.scheduled_at || new Date().toISOString(),
    amount: Number.isFinite(totalAmount) ? totalAmount : 0,
  }
}

function mapRecentAlert(item: AdminDashboardRecentAlert, index: number): Alert {
  return {
    id: item.id || `alert-${index}`,
    type: mapAlertType(item.type),
    title: item.title || "Alert",
    description: item.message || "No details available.",
    timestamp: item.original_time || new Date().toISOString(),
  }
}

export default function DashboardPage() {
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [stats, setStats] = useState({
    activeBookings: 0,
    bookingsToday: 0,
    onlineTherapists: 0,
    totalRevenue: 0,
    pendingPayouts: 0,
    pendingPayoutCount: 0,
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([])
  const [revenueChartData, setRevenueChartData] = useState<{ month: string; revenue: number }[]>([])

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? ""
    setToken(savedToken)
  }, [])

  useEffect(() => {
    if (!token) return
    void loadDashboard(token)
  }, [token])

  async function loadDashboard(authToken: string) {
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetchAdminDashboardStats(authToken)

      setStats({
        activeBookings: Number(response.stats?.active_bookings ?? 0),
        bookingsToday: Number(response.stats?.bookings_today ?? 0),
        onlineTherapists: Number(response.stats?.online_therapists ?? 0),
        totalRevenue: Number(response.stats?.total_revenue ?? 0),
        pendingPayouts: Number(response.stats?.pending_payouts_amount ?? 0),
        pendingPayoutCount: Number(response.stats?.pending_payouts_count ?? 0),
      })

      setRecentBookings((response.recent_bookings ?? []).map(mapRecentBooking))
      setRecentAlerts((response.recent_alerts ?? []).map(mapRecentAlert))
      setRevenueChartData(
        (response.revenue_chart ?? []).map((point) => ({
          month: point.month || "N/A",
          revenue: Number(point.revenue ?? 0),
        })),
      )
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load dashboard data.")
    } finally {
      setLoading(false)
    }
  }

  const revenueTrend = useMemo(() => {
    if (revenueChartData.length < 2) return null
    const previous = revenueChartData[revenueChartData.length - 2]?.revenue ?? 0
    const current = revenueChartData[revenueChartData.length - 1]?.revenue ?? 0
    if (previous <= 0) return null
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change),
      isPositive: change >= 0,
    }
  }, [revenueChartData])

  if (!token) {
    return (
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
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
      <div className="space-y-6 bg-background text-foreground">
        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Active Bookings"
            value={stats.activeBookings}
            subtitle={`${stats.bookingsToday} scheduled today`}
            icon={Calendar}
            highlight
          />
          <MetricCard
            title="Online Therapists"
            value={stats.onlineTherapists}
            subtitle="Available now"
            icon={Users}
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            subtitle="This month"
            icon={DollarSign}            
          />
          <MetricCard
            title="Pending Payouts"
            value={formatCurrency(stats.pendingPayouts)}
            subtitle={`${stats.pendingPayoutCount} requests pending`}
            icon={CreditCard}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border-border bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Monthly revenue for the past 7 months</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">
                  {revenueTrend ? `${revenueTrend.isPositive ? "+" : "-"}${revenueTrend.value.toFixed(1)}%` : "N/A"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <RevenueChart data={revenueChartData} />
            </CardContent>
          </Card>

          {/* Alerts Panel */}
          <Card className="border-border bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Alerts</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary bg-card">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <AlertsList alerts={recentAlerts} />
            </CardContent>
          </Card>
        </div>

        {/* Live Map & Recent Bookings */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Live Map */}
          <Card className="border-border bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Live Activity Map</CardTitle>
              <p className="text-sm text-muted-foreground">Real-time session locations</p>
            </CardHeader>
            <CardContent>
              <LiveMapPlaceholder />
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="lg:col-span-2 border-border bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Latest booking activity across all therapists</p>
              </div>
              <Button variant="outline" size="sm">
                View All Bookings
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {loading && recentBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">Loading recent bookings...</p>
              ) : (
                <BookingTable bookings={recentBookings} compact />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
