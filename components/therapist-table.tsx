"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, CheckCircle, Ban, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Therapist } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface TherapistTableProps {
  therapists: Therapist[]
}

export function TherapistTable({ therapists }: TherapistTableProps) {
  const isTopRated = (rating: number) => rating >= 4.9

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold">Therapist</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Rating</TableHead>
            <TableHead className="font-semibold">Bookings</TableHead>
            <TableHead className="font-semibold text-right">Revenue</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {therapists.map((therapist) => (
            <TableRow
              key={therapist.id}
              className={cn("hover:bg-secondary/30", isTopRated(therapist.rating) && "bg-sidebar-primary/5")}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className={cn("h-10 w-10", isTopRated(therapist.rating) && "ring-2 ring-[#b8860b]")}>
                    <AvatarImage src={therapist.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-secondary">
                      {therapist.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{therapist.name}</span>
                      {isTopRated(therapist.rating) && <Star className="h-4 w-4 fill-sidebar-primary text-sidebar-primary" />}
                    </div>
                    <span className="text-sm text-muted-foreground">{therapist.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "font-medium",
                    therapist.verificationStatus === "Verified"
                      ? "bg-black text-white"
                      : therapist.verificationStatus === "Pending"
                        ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary"
                        : "bg-destructive text-white",
                  )}
                >
                  {therapist.verificationStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-sidebar-primary text-sidebar-primary" />
                  <span className={cn("font-semibold", isTopRated(therapist.rating) && "text-sidebar-primary")}>
                    {therapist.rating > 0 ? therapist.rating.toFixed(1) : "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{therapist.totalBookings}</TableCell>
              <TableCell className="text-right font-semibold">${therapist.revenue.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {therapist.verificationStatus === "Pending" && (
                    <Button size="sm" className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>View Bookings</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Ban className="mr-2 h-4 w-4" />
                        Ban Therapist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
