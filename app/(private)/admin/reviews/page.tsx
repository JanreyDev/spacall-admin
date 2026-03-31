"use client"

import { useEffect, useMemo, useState } from "react"
import { Star, MessageSquare, Flag, TrendingUp } from "lucide-react"
import { MetricCard } from "@/components/metric-card"
import { ReviewTable } from "@/components/review-table"
import { TherapistRatings } from "@/components/therapist-ratings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ADMIN_TOKEN_STORAGE_KEY, fetchAdminReviews, type AdminReviewItem, type AdminTherapistRatingItem } from "@/lib/api"
import type { Review, TherapistRatingStats } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function normalizeReviewStatus(status?: string): Review["status"] {
  const value = (status ?? "").toLowerCase()
  if (value === "flagged") return "Flagged"
  if (value === "hidden") return "Hidden"
  return "Published"
}

function mapReview(item: AdminReviewItem): Review {
  return {
    id: String(item.id ?? ""),
    bookingId: String(item.booking_id ?? ""),
    clientId: String(item.client?.id ?? ""),
    clientName: item.client?.name ?? "Unknown Client",
    clientAvatar: item.client?.avatar ?? "",
    therapistId: String(item.therapist?.id ?? ""),
    therapistName: item.therapist?.name ?? "Unknown Therapist",
    therapistAvatar: item.therapist?.avatar ?? "",
    rating: Number(item.rating ?? 0),
    comment: item.comment ?? "",
    serviceType: item.service_name ?? "Unknown Service",
    createdAt: item.created_at ?? new Date().toISOString(),
    status: normalizeReviewStatus(item.status),
  }
}

function mapTherapistRating(item: AdminTherapistRatingItem): TherapistRatingStats {
  return {
    therapistId: item.therapist_id ?? "",
    therapistName: item.therapist_name ?? "Unknown Therapist",
    therapistAvatar: item.therapist_avatar ?? "",
    averageRating: Number(item.average_rating ?? 0),
    totalReviews: Number(item.total_reviews ?? 0),
    fiveStars: Number(item.five_stars ?? 0),
    fourStars: Number(item.four_stars ?? 0),
    threeStars: Number(item.three_stars ?? 0),
    twoStars: Number(item.two_stars ?? 0),
    oneStars: Number(item.one_stars ?? 0),
    recentTrend:
      item.recent_trend === "up" || item.recent_trend === "down" || item.recent_trend === "stable"
        ? item.recent_trend
        : "stable",
  }
}

export default function ReviewsPage() {
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratings, setRatings] = useState<TherapistRatingStats[]>([])
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    flaggedReviews: 0,
    topRatedName: "N/A",
    topRatedAvg: 0,
  })

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? ""
    setToken(savedToken)
  }, [])

  useEffect(() => {
    if (!token) return
    void loadReviews(token)
  }, [token])

  async function loadReviews(authToken: string) {
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetchAdminReviews(authToken)
      const mappedReviews = (response.reviews ?? []).map(mapReview)
      const mappedRatings = (response.therapist_ratings ?? []).map(mapTherapistRating)
      const topRatedName = response.stats?.top_rated_therapist?.name ?? "N/A"
      const topRatedAvg = Number(response.stats?.top_rated_therapist?.rating ?? 0)

      setReviews(mappedReviews)
      setRatings(mappedRatings)
      setStats({
        totalReviews: Number(response.stats?.total_reviews ?? mappedReviews.length),
        averageRating: Number(response.stats?.avg_rating ?? 0),
        flaggedReviews: Number(response.stats?.flagged_reviews ?? mappedReviews.filter((r) => r.status === "Flagged").length),
        topRatedName: topRatedName.split(" ")[0] || "N/A",
        topRatedAvg,
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch reviews.")
    } finally {
      setLoading(false)
    }
  }

  const safeAverage = useMemo(() => (Number.isFinite(stats.averageRating) ? stats.averageRating : 0), [stats.averageRating])

  if (!token) {
    return (
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews & Ratings</h1>
        <p className="text-[color:var(--color-muted-foreground)]">Manage client reviews and monitor therapist ratings</p>
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Reviews"
          value={stats.totalReviews.toString()}
          icon={MessageSquare}
          subtitle="All time"
        />
        <MetricCard
          title="Average Rating"
          value={safeAverage.toFixed(1)}
          icon={Star}
          subtitle="Platform-wide"
          highlight
        />
        <MetricCard
          title="Flagged Reviews"
          value={stats.flaggedReviews.toString()}
          icon={Flag}
          subtitle="Needs attention"
        />
        <MetricCard
          title="Top Rated"
          value={stats.topRatedName}
          icon={TrendingUp}
          subtitle={`${stats.topRatedAvg.toFixed(2)} avg rating`}
        />
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          <TabsTrigger value="ratings">Therapist Ratings</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews">
          <ReviewTable reviews={reviews} loading={loading} />
        </TabsContent>
        <TabsContent value="ratings">
          <TherapistRatings ratings={ratings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
