"use client"

import { useState } from "react"
import { mockClients, type Client } from "@/lib/mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Mail, Phone, Calendar, DollarSign, Eye, Ban, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ClientTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [clients] = useState<Client[]>(mockClients)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getClientTier = (totalSpent: number) => {
    if (totalSpent >= 5000) return { label: "VIP", color: "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)]" }
    if (totalSpent >= 2000) return { label: "Regular", color: "bg-[color:var(--color-sidebar-border)] text-[color:var(--color-sidebar-foreground)]" }
    return { label: "New", color: "bg-[color:var(--color-card)] text-[color:var(--color-muted-foreground)]" }
  }

  return (
    <div className="space-y-4 font-sans">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-muted-foreground)]" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[color:var(--color-card)] border-[color:var(--color-border)] focus:border-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)]"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-[color:var(--color-muted-foreground)]">
          <span>{filteredClients.length} clients</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[color:var(--color-muted)] hover:bg-[color:var(--color-muted)]">
              <TableHead className="font-semibold text-[color:var(--color-foreground)]">Client</TableHead>
              <TableHead className="font-semibold text-[color:var(--color-foreground)]">Contact</TableHead>
              <TableHead className="font-semibold text-[color:var(--color-foreground)]">Tier</TableHead>
              <TableHead className="font-semibold text-[color:var(--color-foreground)] text-center">Bookings</TableHead>
              <TableHead className="font-semibold text-[color:var(--color-foreground)] text-right">Total Spent</TableHead>
              <TableHead className="font-semibold text-[color:var(--color-foreground)]">Joined</TableHead>
              <TableHead className="font-semibold text-[color:var(--color-foreground)] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => {
              const tier = getClientTier(client.totalSpent)
              return (
                <TableRow key={client.id} className="hover:bg-[color:var(--color-muted)]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-[color:var(--color-border)]">
                        <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
                        <AvatarFallback className="bg-[color:var(--color-card)] text-[color:var(--color-muted-foreground)]">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[color:var(--color-foreground)]">{client.name}</p>
                        <p className="text-xs text-[color:var(--color-muted-foreground)]">{client.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-[color:var(--color-muted-foreground)]">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-[color:var(--color-muted-foreground)]">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={tier.color}>{tier.label}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[color:var(--color-muted-foreground)]" />
                      <span className="font-medium">{client.totalBookings}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="h-4 w-4 text-[color:var(--color-primary)]" />
                      <span className="font-semibold text-[color:var(--color-foreground)]">{client.totalSpent.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-[color:var(--color-muted-foreground)]">
                      {new Date(client.joinedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[color:var(--color-muted)]">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Calendar className="h-4 w-4" />
                          Booking History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Star className="h-4 w-4" />
                          Upgrade to VIP
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600">
                          <Ban className="h-4 w-4" />
                          Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
