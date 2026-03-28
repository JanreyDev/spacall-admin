"use client"

import { useState } from "react"
import { Star, MoreHorizontal, Flag, Eye, EyeOff, MessageSquare, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { mockReviews, type Review } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn("h-4 w-4", star <= rating ? "fill-sidebar-primary text-sidebar-primary" : "text-muted-foreground/30")}
        />
      ))}
    </div>
  )
}

function getStatusBadge(status: Review["status"]) {
  switch (status) {
    case "Published":
      return <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">Published</Badge>
    case "Flagged":
      return <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">Flagged</Badge>
    case "Hidden":
      return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Hidden</Badge>
  }
}

export function ReviewTable() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [responseDialogOpen, setResponseDialogOpen] = useState(false)
  const [adminResponse, setAdminResponse] = useState("")

  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.clientName.toLowerCase().includes(search.toLowerCase()) ||
      review.therapistName.toLowerCase().includes(search.toLowerCase()) ||
      review.comment.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesRating = ratingFilter === "all" || review.rating === Number.parseInt(ratingFilter)
    return matchesSearch && matchesStatus && matchesRating
  })

  const handleRespond = (review: Review) => {
    setSelectedReview(review)
    setAdminResponse(review.adminResponse || "")
    setResponseDialogOpen(true)
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Flagged">Flagged</SelectItem>
              <SelectItem value="Hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Client</TableHead>
              <TableHead>Therapist</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="max-w-[300px]">Review</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.clientAvatar || "/placeholder.svg"} alt={review.clientName} />
                      <AvatarFallback>{review.clientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{review.clientName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.therapistAvatar || "/placeholder.svg"} alt={review.therapistName} />
                      <AvatarFallback>{review.therapistName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{review.therapistName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StarRating rating={review.rating} />
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{review.serviceType}</span>
                </TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRespond(review)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Respond
                      </DropdownMenuItem>
                      {review.status !== "Flagged" && (
                        <DropdownMenuItem>
                          <Flag className="mr-2 h-4 w-4" />
                          Flag Review
                        </DropdownMenuItem>
                      )}
                      {review.status === "Published" && (
                        <DropdownMenuItem>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hide Review
                        </DropdownMenuItem>
                      )}
                      {review.status === "Hidden" && (
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Publish Review
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>
              Add an admin response to this review. This will be visible to both the client and therapist.
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedReview.clientAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{selectedReview.clientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{selectedReview.clientName}</span>
                  </div>
                  <StarRating rating={selectedReview.rating} />
                </div>
                <p className="text-sm text-muted-foreground">{selectedReview.comment}</p>
              </div>
              <Textarea
                placeholder="Write your response..."
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                rows={4}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setResponseDialogOpen(false)} className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
              Submit Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
