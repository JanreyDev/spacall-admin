"use client"

import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { mockTherapistRatings, type TherapistRatingStats } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function TrendIndicator({ trend }: { trend: TherapistRatingStats["recentTrend"] }) {
  switch (trend) {
    case "up":
      return (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs">Improving</span>
        </div>
      )
    case "down":
      return (
        <div className="flex items-center gap-1 text-red-600">
          <TrendingDown className="h-4 w-4" />
          <span className="text-xs">Declining</span>
        </div>
      )
    case "stable":
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Minus className="h-4 w-4" />
          <span className="text-xs">Stable</span>
        </div>
      )
  }
}

function RatingBreakdown({ stats }: { stats: TherapistRatingStats }) {
  const total = stats.totalReviews
  const breakdown = [
    { stars: 5, count: stats.fiveStars },
    { stars: 4, count: stats.fourStars },
    { stars: 3, count: stats.threeStars },
    { stars: 2, count: stats.twoStars },
    { stars: 1, count: stats.oneStars },
  ]

  return (
    <div className="space-y-2">
      {breakdown.map(({ stars, count }) => (
        <div key={stars} className="flex items-center gap-2">
          <span className="text-xs w-3">{stars}</span>
          <Star className="h-3 w-3 fill-sidebar-primary text-sidebar-primary" />
          <Progress value={(count / total) * 100} className="h-2 flex-1 bg-muted" />
          <span className="text-xs text-muted-foreground w-8">{count}</span>
        </div>
      ))}
    </div>
  )
}

export function TherapistRatings() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {mockTherapistRatings.map((stats) => (
        <div
          key={stats.therapistId}
          className={cn("rounded-lg border bg-card p-4", stats.averageRating >= 4.9 && "border-sidebar-primary/50")}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={stats.therapistAvatar || "/placeholder.svg"} alt={stats.therapistName} />
                <AvatarFallback>{stats.therapistName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{stats.therapistName}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-sidebar-primary text-sidebar-primary" />
                    <span className={cn("font-bold", stats.averageRating >= 4.9 && "text-sidebar-primary")}>
                      {stats.averageRating.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">({stats.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
            <TrendIndicator trend={stats.recentTrend} />
          </div>
          <RatingBreakdown stats={stats} />
        </div>
      ))}
    </div>
  )
}
