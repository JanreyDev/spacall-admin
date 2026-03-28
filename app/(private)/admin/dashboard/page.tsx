import { MetricCard } from "@/components/metric-card"
import { BookingTable } from "@/components/booking-table"
import { AlertsList } from "@/components/alerts-list"
import { RevenueChart } from "@/components/revenue-chart"
import { LiveMapPlaceholder } from "@/components/live-map-placeholder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, DollarSign, CreditCard, ArrowRight, TrendingUp } from "lucide-react"
import { mockDashboardMetrics, mockBookings, mockAlerts } from "@/lib/mock-data"

export default function DashboardPage() {
  const recentBookings = mockBookings.slice(0, 4)

  return (
      <div className="space-y-6 bg-background text-foreground">
        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Active Bookings"
            value={mockDashboardMetrics.activeBookings}
            subtitle={`${mockDashboardMetrics.bookingsToday} scheduled today`}
            icon={Calendar}
            trend={{ value: 12, isPositive: true }}
            highlight
          />
          <MetricCard
            title="Online Therapists"
            value={mockDashboardMetrics.onlineTherapists}
            subtitle="Available now"
            icon={Users}
          />
          <MetricCard
            title="Total Revenue"
            value={`$${mockDashboardMetrics.totalRevenue.toLocaleString()}`}
            subtitle="This month"
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Pending Payouts"
            value={`$${mockDashboardMetrics.pendingPayouts.toLocaleString()}`}
            subtitle="3 requests pending"
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
                <span className="text-primary font-medium">+18.2%</span>
              </div>
            </CardHeader>
            <CardContent>
              <RevenueChart />
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
              <AlertsList alerts={mockAlerts} />
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
              <BookingTable bookings={recentBookings} compact />
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
