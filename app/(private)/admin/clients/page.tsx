"use client"

import { useEffect, useMemo, useState } from "react"
import { ClientTable } from "@/components/client-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Calendar, Star } from "lucide-react"
import type { Client } from "@/lib/mock-data"
import { ADMIN_TOKEN_STORAGE_KEY, fetchAdminClients } from "@/lib/api"

function getClientTierLabel(totalSpent: number) {
  if (totalSpent >= 5000) return "VIP"
  if (totalSpent >= 2000) return "Regular"
  return "New"
}

export default function ClientsPage() {
  const [token, setToken] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [totalClientsCount, setTotalClientsCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? ""
    setToken(savedToken)
  }, [])

  useEffect(() => {
    if (!token) return
    void loadClients(token)
  }, [token])

  async function loadClients(authToken: string) {
    try {
      setLoading(true)
      setErrorMessage(null)

      const response = await fetchAdminClients(authToken)
      const rows = response.clients?.data ?? []

      const mapped: Client[] = rows.map((item) => {
        const name = [item.first_name, item.last_name].filter(Boolean).join(" ").trim() || "Unknown Client"
        const spent = Number(item.total_spent ?? 0)
        const bookingCount = Number(item.total_bookings ?? 0)
        return {
          id: `CL${String(item.id).padStart(3, "0")}`,
          name,
          email: item.email ?? "-",
          phone: item.mobile_number ?? "-",
          avatar: item.profile_photo_url ?? "",
          totalBookings: bookingCount,
          totalSpent: spent,
          joinedDate: item.created_at ?? new Date().toISOString(),
        }
      })

      setClients(mapped)
      setTotalClientsCount(response.clients?.total ?? mapped.length)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch clients.")
    } finally {
      setLoading(false)
    }
  }

  const totalRevenue = useMemo(
    () => clients.reduce((acc, c) => acc + c.totalSpent, 0),
    [clients],
  )
  const totalBookings = useMemo(
    () => clients.reduce((acc, c) => acc + c.totalBookings, 0),
    [clients],
  )
  const vipClients = useMemo(
    () => clients.filter((c) => getClientTierLabel(c.totalSpent) === "VIP").length,
    [clients],
  )

  if (!token) {
    return (
      <div className="space-y-6 bg-background text-foreground">
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Admin session not found. Please sign in at <strong>/login</strong> first.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
      <div className="space-y-6 bg-background text-foreground">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClientsCount}</div>
              <p className="text-xs text-muted-foreground">{loading ? "Loading..." : "Live data"}</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From loaded clients</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">From loaded clients</p>
            </CardContent>
          </Card>

          <Card className="bg-sidebar border-sidebar-border text-sidebar-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">VIP Clients</CardTitle>
              <Star className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{vipClients}</div>
              <p className="text-xs text-muted-foreground">$5,000+ spent</p>
            </CardContent>
          </Card>
        </div>

        {/* Client Table */}
        {errorMessage ? (
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{errorMessage}</p>
            </CardContent>
          </Card>
        ) : null}
        <ClientTable clients={clients} />
      </div>
  )
}
