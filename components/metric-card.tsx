import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  highlight?: boolean
}

export function MetricCard({ title, value, subtitle, icon: Icon, trend, highlight }: MetricCardProps) {
  return (
    <Card
      className={cn(
        "border transition-all hover:shadow-lg",
        highlight
          ? "border-sidebar-primary bg-sidebar text-sidebar-foreground"
          : "border-border bg-card text-card-foreground font-sans",
        )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={cn("text-sm font-medium", "text-muted-foreground")}>{title}</p>
            <p className={cn("text-3xl font-bold tracking-tight", highlight && "text-sidebar-primary")}>{value}</p>
            {subtitle && (
              <p className={cn("text-xs", "text-muted-foreground")}>{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn("rounded-lg p-3", highlight ? "bg-sidebar-primary" : "bg-secondary")}> 
            <Icon className={cn("h-5 w-5", highlight ? "text-sidebar-primary-foreground" : "text-foreground")} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
