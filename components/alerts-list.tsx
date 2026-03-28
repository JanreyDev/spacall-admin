import type { Alert } from "@/lib/mock-data"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertsListProps {
  alerts: Alert[]
}

const alertIcons = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const alertStyles = {
  error: "border-l-[color:var(--color-destructive)] bg-[color:var(--color-destructive)]/5",
  warning: "border-l-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5",
  info: "border-l-[color:var(--color-foreground)] bg-[color:var(--color-secondary)]/50",
}

export function AlertsList({ alerts }: AlertsListProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="space-y-3 font-sans">
      {alerts.map((alert) => {
        const Icon = alertIcons[alert.type]
        return (
          <div
            key={alert.id}
            className={cn("rounded-lg border-l-4 p-4 transition-all hover:shadow-md", alertStyles[alert.type])}
          >
            <div className="flex items-start gap-3">
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 mt-0.5",
                  alert.type === "error" && "text-[color:var(--color-destructive)]",
                  alert.type === "warning" && "text-[color:var(--color-primary)]",
                  alert.type === "info" && "text-[color:var(--color-foreground)]",
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm">{alert.title}</h4>
                  <span className="text-xs text-[color:var(--color-muted-foreground)] shrink-0">{formatTime(alert.timestamp)}</span>
                </div>
                <p className="text-sm text-[color:var(--color-muted-foreground)] mt-1">{alert.description}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
