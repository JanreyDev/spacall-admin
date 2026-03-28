import type { Payout } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PayoutListProps {
  payouts: Payout[]
}

export function PayoutList({ payouts }: PayoutListProps) {
  const statusIcons = {
    Pending: Clock,
    Processing: Loader2,
    Completed: CheckCircle,
    Failed: Clock,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-3">
      {payouts.map((payout) => {
        const Icon = statusIcons[payout.status]
        return (
          <div
            key={payout.id}
            className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  payout.status === "Pending" && "bg-sidebar-primary/10",
                  payout.status === "Processing" && "bg-secondary",
                  payout.status === "Completed" && "bg-secondary",
                  payout.status === "Failed" && "bg-destructive/10",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    payout.status === "Pending" && "text-sidebar-primary",
                    payout.status === "Processing" && "text-foreground animate-spin",
                    payout.status === "Completed" && "text-green-500",
                    payout.status === "Failed" && "text-destructive",
                  )}
                />
              </div>
              <div>
                <p className="font-medium">{payout.therapistName}</p>
                <p className="text-sm text-muted-foreground">Requested: {formatDate(payout.requestedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-lg">${payout.amount.toLocaleString()}</p>
                <Badge
                  className={cn(
                    "font-medium",
                    payout.status === "Pending" && "bg-sidebar-primary text-sidebar-primary-foreground",
                    payout.status === "Processing" && "bg-black text-white",
                    payout.status === "Completed" && "bg-secondary text-foreground",
                    payout.status === "Failed" && "bg-destructive text-white",
                  )}
                >
                  {payout.status}
                </Badge>
              </div>
              {payout.status === "Pending" && (
                <Button className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">Approve</Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
