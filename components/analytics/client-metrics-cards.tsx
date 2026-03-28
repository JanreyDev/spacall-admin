"use client"

import { Users, UserPlus, RefreshCw, Percent, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { mockClientMetrics } from "@/lib/mock-data"

const metrics = [
  {
    title: "Total Clients",
    value: mockClientMetrics.totalClients.toLocaleString(),
    icon: Users,
    description: "All registered clients",
  },
  {
    title: "New This Month",
    value: mockClientMetrics.newClientsThisMonth.toString(),
    icon: UserPlus,
    description: "+12% from last month",
    highlight: true,
  },
  {
    title: "Returning Clients",
    value: mockClientMetrics.returningClients.toLocaleString(),
    icon: RefreshCw,
    description: "Multiple bookings",
  },
  {
    title: "Retention Rate",
    value: `${mockClientMetrics.retentionRate}%`,
    icon: Percent,
    description: "Client retention",
  },
  {
    title: "Avg Bookings/Client",
    value: mockClientMetrics.avgBookingsPerClient.toString(),
    icon: Calendar,
    description: "Per client average",
  },
  {
    title: "Avg Spend/Client",
    value: `$${mockClientMetrics.avgSpendPerClient}`,
    icon: DollarSign,
    description: "Lifetime value",
    highlight: true,
  },
]

export function ClientMetricsCards() {
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
