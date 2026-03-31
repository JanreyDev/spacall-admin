"use client"

import { Users, UserPlus, RefreshCw, Percent, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { mockClientMetrics } from "@/lib/mock-data"

interface ClientMetricsCardsProps {
  metricsData?: {
    total_clients: number
    new_clients_this_month: number
    returning_clients: number
    retention_rate: number
    avg_bookings_per_client: number
    avg_spend_per_client: number
  } | null
}

export function ClientMetricsCards({ metricsData }: ClientMetricsCardsProps) {
  const source = metricsData ?? {
    total_clients: mockClientMetrics.totalClients,
    new_clients_this_month: mockClientMetrics.newClientsThisMonth,
    returning_clients: mockClientMetrics.returningClients,
    retention_rate: mockClientMetrics.retentionRate,
    avg_bookings_per_client: mockClientMetrics.avgBookingsPerClient,
    avg_spend_per_client: mockClientMetrics.avgSpendPerClient,
  }

  const metrics = [
    {
      title: "Total Clients",
      value: source.total_clients.toLocaleString(),
      icon: Users,
      description: "All registered clients",
    },
    {
      title: "New This Month",
      value: source.new_clients_this_month.toString(),
      icon: UserPlus,
      description: "Recently registered",
      highlight: true,
    },
    {
      title: "Returning Clients",
      value: source.returning_clients.toLocaleString(),
      icon: RefreshCw,
      description: "Multiple bookings",
    },
    {
      title: "Retention Rate",
      value: `${source.retention_rate}%`,
      icon: Percent,
      description: "Client retention",
    },
    {
      title: "Avg Bookings/Client",
      value: source.avg_bookings_per_client.toString(),
      icon: Calendar,
      description: "Per client average",
    },
    {
      title: "Avg Spend/Client",
      value: `$${source.avg_spend_per_client.toLocaleString()}`,
      icon: DollarSign,
      description: "Lifetime value",
      highlight: true,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className={metric.highlight ? "border-sidebar-primary/50" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <metric.icon className={`h-5 w-5 ${metric.highlight ? "text-sidebar-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="mt-3">
              <p className={`text-2xl font-bold ${metric.highlight ? "text-sidebar-primary" : ""}`}>{metric.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{metric.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
