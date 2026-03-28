"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, MessageSquare, XCircle } from "lucide-react"
import type { Booking } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface BookingTableProps {
  bookings: Booking[]
  compact?: boolean
}

const statusStyles: Record<Booking["status"], { bg: string; text: string; border?: string }> = {
  Requested: { bg: "bg-[color:var(--color-card)]", text: "text-[color:var(--color-card-foreground)]", border: "border border-[color:var(--color-primary)]" },
  Confirmed: { bg: "bg-[color:var(--color-primary)]", text: "text-[color:var(--color-primary-foreground)]" },
  Ongoing: { bg: "bg-[color:var(--color-sidebar)]", text: "text-[color:var(--color-sidebar-foreground)]" },
  Completed: { bg: "bg-[color:var(--color-secondary)]", text: "text-[color:var(--color-secondary-foreground)]" },
  Cancelled: { bg: "bg-[color:var(--color-destructive)]/10", text: "text-[color:var(--color-destructive)]" },
}

export function BookingTable({ bookings, compact }: BookingTableProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="rounded-lg border border-[color:var(--color-border)] overflow-hidden font-sans">
      <Table>
        <TableHeader>
          <TableRow className="bg-[color:var(--color-secondary)]/50 hover:bg-[color:var(--color-secondary)]/50">
            <TableHead className="font-semibold">Booking ID</TableHead>
            <TableHead className="font-semibold">Client</TableHead>
            <TableHead className="font-semibold">Therapist</TableHead>
            {!compact && <TableHead className="font-semibold">Service</TableHead>}
            {!compact && <TableHead className="font-semibold">Location</TableHead>}
            <TableHead className="font-semibold">Scheduled</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="hover:bg-[color:var(--color-secondary)]/30">
              <TableCell className="font-mono text-sm font-medium">{booking.id}</TableCell>
              <TableCell className="font-medium">{booking.clientName}</TableCell>
              <TableCell>{booking.therapistName}</TableCell>
              {!compact && <TableCell>{booking.serviceType}</TableCell>}
              {!compact && (
                <TableCell className="max-w-[200px] truncate text-muted-foreground">{booking.location}</TableCell>
              )}
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{formatDate(booking.scheduledAt)}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(booking.scheduledAt)}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "font-medium",
                    statusStyles[booking.status].bg,
                    statusStyles[booking.status].text,
                    statusStyles[booking.status].border,
                  )}
                >
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">${booking.amount}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact
                    </DropdownMenuItem>
                    {booking.status !== "Completed" && booking.status !== "Cancelled" && (
                      <DropdownMenuItem className="text-destructive">
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Booking
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
  )
}
