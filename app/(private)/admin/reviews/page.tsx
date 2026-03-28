import { Star, MessageSquare, Flag, TrendingUp } from "lucide-react"
import { MetricCard } from "@/components/metric-card"
import { ReviewTable } from "@/components/review-table"
import { TherapistRatings } from "@/components/therapist-ratings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockReviews, mockTherapistRatings } from "@/lib/mock-data"

export default function ReviewsPage() {
  const totalReviews = mockReviews.length
  const averageRating = mockReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
  const flaggedReviews = mockReviews.filter((r) => r.status === "Flagged").length
  const topRated = mockTherapistRatings.reduce((prev, current) =>
    prev.averageRating > current.averageRating ? prev : current,
  )

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews & Ratings</h1>
          <p className="text-[color:var(--color-muted-foreground)]">Manage client reviews and monitor therapist ratings</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Reviews"
            value={totalReviews.toString()}
            icon={MessageSquare}
            description="All time"
          />
          <MetricCard
            title="Average Rating"
            value={averageRating.toFixed(1)}
            icon={Star}
            description="Platform-wide"
            highlight
          />
          <MetricCard
            title="Flagged Reviews"
            value={flaggedReviews.toString()}
            icon={Flag}
            description="Needs attention"
          />
          <MetricCard
            title="Top Rated"
            value={topRated.therapistName.split(" ")[0]}
            icon={TrendingUp}
            description={`${topRated.averageRating.toFixed(2)} avg rating`}
          />
        </div>

        <Tabs defaultValue="reviews" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reviews">All Reviews</TabsTrigger>
            <TabsTrigger value="ratings">Therapist Ratings</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews">
            <ReviewTable />
          </TabsContent>
          <TabsContent value="ratings">
            <TherapistRatings />
          </TabsContent>
        </Tabs>
      </div>
  )
}
