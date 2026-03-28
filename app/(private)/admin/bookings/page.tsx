import { BookingTable } from "@/components/booking-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Filter } from "lucide-react"
import { mockBookings } from "@/lib/mock-data"

export default function BookingsPage() {
  const activeBookings = mockBookings.filter(
    (b) => b.status === "Ongoing" || b.status === "Confirmed" || b.status === "Requested",
  )
  const completedBookings = mockBookings.filter((b) => b.status === "Completed")
  const cancelledBookings = mockBookings.filter((b) => b.status === "Cancelled")

  return (
      <div className="space-y-6 bg-background text-foreground">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{mockBookings.length}</p>
            </CardContent>
          </Card>
          <Card className="border-sidebar-primary bg-sidebar text-sidebar-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Ongoing</p>
              <p className="text-2xl font-bold text-sidebar-primary">
                {mockBookings.filter((b) => b.status === "Ongoing").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Requested</p>
              <p className="text-2xl font-bold">{mockBookings.filter((b) => b.status === "Requested").length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedBookings.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold text-destructive">{cancelledBookings.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by ID, client, or therapist..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="swedish">Swedish Massage</SelectItem>
                <SelectItem value="deep-tissue">Deep Tissue</SelectItem>
                <SelectItem value="sports">Sports Recovery</SelectItem>
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
        <Tabs defaultValue="all" className="space-y-4">
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
                <BookingTable bookings={mockBookings} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="active">
            <Card className="border-border bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Active Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingTable bookings={activeBookings} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed">
            <Card className="border-border bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Completed Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingTable bookings={completedBookings} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cancelled">
            <Card className="border-border bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Cancelled Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingTable bookings={cancelledBookings} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}
