import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueTrendsChart } from "@/components/analytics/revenue-trends-chart"
import { ServicePopularityChart } from "@/components/analytics/service-popularity-chart"
import { PeakHoursHeatmap } from "@/components/analytics/peak-hours-heatmap"
import { GeographicDistribution } from "@/components/analytics/geographic-distribution"
import { TopTherapistsTable } from "@/components/analytics/top-therapists-table"
import { ClientMetricsCards } from "@/components/analytics/client-metrics-cards"

export default function ReportsPage() {
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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="therapists">Therapists</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <RevenueTrendsChart />
              <ServicePopularityChart />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <PeakHoursHeatmap />
              <GeographicDistribution />
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <RevenueTrendsChart />
            <div className="grid gap-6 lg:grid-cols-2">
              <ServicePopularityChart />
              <GeographicDistribution />
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <ClientMetricsCards />
            <div className="grid gap-6 lg:grid-cols-2">
              <PeakHoursHeatmap />
              <GeographicDistribution />
            </div>
          </TabsContent>

          <TabsContent value="therapists" className="space-y-6">
            <TopTherapistsTable />
            <div className="grid gap-6 lg:grid-cols-2">
              <ServicePopularityChart />
              <PeakHoursHeatmap />
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
