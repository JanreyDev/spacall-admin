import { DisputePanel } from "@/components/dispute-panel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Clock, CheckCircle, Filter } from "lucide-react"
import { mockDisputes } from "@/lib/mock-data"

export default function DisputesPage() {
  const openDisputes = mockDisputes.filter((d) => d.status === "Open")
  const underReview = mockDisputes.filter((d) => d.status === "Under Review")
  const resolved = mockDisputes.filter((d) => d.status === "Resolved")

  return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-[color:var(--color-primary)] bg-[color:var(--color-sidebar)] text-[color:var(--color-sidebar-foreground)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[color:var(--color-primary)] p-2">
                  <AlertCircle className="h-5 w-5 text-[color:var(--color-primary-foreground)]" />
                </div>
                <div>
                  <p className="text-sm text-[color:var(--color-muted-foreground)]">Open</p>
                  <p className="text-2xl font-bold text-[color:var(--color-primary)]">{openDisputes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[color:var(--color-border)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[color:var(--color-secondary)] p-2">
                  <Clock className="h-5 w-5 text-[color:var(--color-secondary-foreground)]" />
                </div>
                <div>
                  <p className="text-sm text-[color:var(--color-muted-foreground)]">Under Review</p>
                  <p className="text-2xl font-bold">{underReview.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[color:var(--color-border)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[color:var(--color-secondary)] p-2">
                  <CheckCircle className="h-5 w-5 text-[color:var(--color-secondary-foreground)]" />
                </div>
                <div>
                  <p className="text-sm text-[color:var(--color-muted-foreground)]">Resolved</p>
                  <p className="text-2xl font-bold">{resolved.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-sidebar-primary text-sidebar-primary">
              {mockDisputes.length} Total Cases
            </Badge>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Dispute Panels */}
        <div className="space-y-4">
          {mockDisputes.map((dispute) => (
            <DisputePanel key={dispute.id} dispute={dispute} />
          ))}
        </div>
      </div>
  )
}
