"use client"

import { useEffect, useMemo, useState } from "react"
import { BookingTable } from "@/components/booking-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Filter } from "lucide-react"
import type { Booking } from "@/lib/mock-data"
import { ADMIN_TOKEN_STORAGE_KEY, fetchAdminBookings } from "@/lib/api"

function fullName(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ").trim() || "Unknown"
}

function normalizeBookingStatus(status?: string | null): Booking["status"] {
  const value = (status ?? "").toLowerCase()
  if (value === "requested" || value === "pending" || value === "awaiting_assignment") return "Requested"
  if (value === "confirmed" || value === "accepted") return "Confirmed"
  if (value === "en_route" || value === "arrived" || value === "in_progress" || value === "ongoing") return "Ongoing"
  if (value === "completed") return "Completed"
  return "Cancelled"
}

export default function BookingsPage() {
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState("all")
  const [search, setSearch] = useState("")
  const [serviceType, setServiceType] = useState("all")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [availableServices, setAvailableServices] = useState<string[]>([])
  const [stats, setStats] = useState({
    total: 0,
    ongoing: 0,
    requested: 0,
    completed: 0,
    cancelled: 0,
  })

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? ""
    setToken(savedToken)
  }, [])

  useEffect(() => {
    if (!token) return
    void loadBookings(token, tabValue, search, serviceType)
  }, [token, tabValue, search, serviceType])

  async function loadBookings(
    authToken: string,
    activeTab: string,
    searchValue: string,
    serviceValue: string,
  ) {
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetchAdminBookings(authToken, {
        status: activeTab,
        search: searchValue.trim() || undefined,
        service_type: serviceValue !== "all" ? serviceValue : undefined,
      })

      const mapped: Booking[] = (response.bookings ?? []).map((item) => ({
        id: item.booking_number || `BK-${item.id}`,
        clientId: String(item.customer?.id ?? "NA"),
        clientName: fullName(item.customer?.first_name, item.customer?.last_name),
        therapistId: String(item.therapist?.id ?? "NA"),
        therapistName: item.therapist?.nickname || "Therapist",
        serviceType: item.service?.name || "N/A",
        location: item.location?.address || "N/A",
        status: normalizeBookingStatus(item.status),
        scheduledAt: item.scheduled_at || new Date().toISOString(),
        amount: Number(item.total_amount ?? 0),
      }))

      setBookings(mapped)
      setStats({
        total: Number(response.stats?.total ?? 0),
        ongoing: Number(response.stats?.active ?? 0),
        requested: Number(response.stats?.requested ?? 0),
        completed: Number(response.stats?.completed ?? 0),
        cancelled: Number(response.stats?.cancelled ?? 0),
      })

      const serviceNames = Array.from(new Set(mapped.map((booking) => booking.serviceType).filter(Boolean)))
      setAvailableServices(serviceNames)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch bookings.")
    } finally {
      setLoading(false)
    }
  }

  const activeBookings = useMemo(
    () => bookings.filter((b) => b.status === "Ongoing" || b.status === "Confirmed" || b.status === "Requested"),
    [bookings],
  )
  const completedBookings = useMemo(() => bookings.filter((b) => b.status === "Completed"), [bookings])
  const cancelledBookings = useMemo(() => bookings.filter((b) => b.status === "Cancelled"), [bookings])

  if (!token) {
    return (
      <div className="space-y-6 bg-background text-foreground">
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
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
        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border-sidebar-primary bg-sidebar text-sidebar-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Ongoing</p>
              <p className="text-2xl font-bold text-sidebar-primary">{stats.ongoing}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Requested</p>
              <p className="text-2xl font-bold">{stats.requested}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold text-destructive">{stats.cancelled}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, client, or therapist..."
                className="pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {availableServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Bookings Tabs */}
        <Tabs value={tabValue} onValueChange={setTabValue} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card className="border-border bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <p className="text-sm text-muted-foreground">Loading bookings...</p> : <BookingTable bookings={bookings} />}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="active">
            <Card className="border-border bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Active Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <p className="text-sm text-muted-foreground">Loading bookings...</p> : <BookingTable bookings={activeBookings} />}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed">
            <Card className="border-border bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Completed Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <p className="text-sm text-muted-foreground">Loading bookings...</p> : <BookingTable bookings={completedBookings} />}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cancelled">
            <Card className="border-border bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Cancelled Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <p className="text-sm text-muted-foreground">Loading bookings...</p> : <BookingTable bookings={cancelledBookings} />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}
