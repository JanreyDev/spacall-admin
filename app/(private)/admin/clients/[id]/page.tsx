"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, Calendar, DollarSign, ReceiptText, UserRound } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ADMIN_TOKEN_STORAGE_KEY, fetchAdminClientDetails, type AdminClientDetail } from "@/lib/api"

function fullName(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ").trim() || "Unknown Client"
}

function formatCurrency(value?: string | number | null) {
  const amount = Number(value ?? 0)
  if (!Number.isFinite(amount)) return "$0.00"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

function formatDate(value?: string | null) {
  if (!value) return "N/A"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "N/A"
  return date.toLocaleString()
}

function getTierLabel(tier?: string | null, spent?: string | number | null) {
  const normalized = (tier ?? "").toLowerCase()
  if (normalized === "vip") return "VIP"
  const amount = Number(spent ?? 0)
  if (amount >= 5000) return "VIP"
  if (amount >= 2000) return "Regular"
  return "New"
}

export default function ClientDetailsPage() {
  const params = useParams<{ id: string }>()
  const clientId = Number(params?.id)
  const [token, setToken] = useState("")
  const [client, setClient] = useState<AdminClientDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? ""
    setToken(savedToken)
  }, [])

  useEffect(() => {
    if (!token || !Number.isFinite(clientId)) return
    void loadClient(token, clientId)
  }, [token, clientId])

  async function loadClient(authToken: string, id: number) {
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetchAdminClientDetails(authToken, id)
      setClient(response.client)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load client details.")
    } finally {
      setLoading(false)
    }
  }

  const initials = useMemo(() => {
    const name = fullName(client?.first_name, client?.last_name)
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }, [client?.first_name, client?.last_name])

  if (!token) {
    return (
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Client Profile</CardTitle>
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
    <div className="space-y-6 bg-background text-foreground">
      <Button asChild variant="outline">
        <Link href="/admin/clients">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Link>
      </Button>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      {loading ? (
        <Card className="border-border">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Loading client details...</p>
          </CardContent>
        </Card>
      ) : null}

      {!loading && client ? (
        <>
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={client.profile_photo_url ?? "/placeholder.svg"} alt={fullName(client.first_name, client.last_name)} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-semibold">{fullName(client.first_name, client.last_name)}</h2>
                    <p className="text-sm text-muted-foreground">{client.email ?? "N/A"}</p>
                    <p className="text-sm text-muted-foreground">{client.mobile_number ?? "No mobile number"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{getTierLabel(client.customer_tier, client.total_spent)}</Badge>
                  <Badge variant="secondary">{(client.status ?? "active").toUpperCase()}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <div className="mt-1 flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <p className="text-2xl font-bold">{formatCurrency(client.total_spent)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <div className="mt-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-2xl font-bold">{Number(client.total_bookings ?? 0)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <div className="mt-1 flex items-center gap-1">
                  <ReceiptText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-2xl font-bold">{formatCurrency(client.wallet_balance)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Joined</p>
                <div className="mt-1 flex items-center gap-1">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-semibold">{formatDate(client.created_at)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              {(client.bookings ?? []).length ? (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                        <TableHead>Booking #</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Therapist</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(client.bookings ?? []).map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.booking_number ?? `BK-${booking.id}`}</TableCell>
                          <TableCell>{booking.service?.name ?? "N/A"}</TableCell>
                          <TableCell>
                            {fullName(booking.provider?.user?.first_name, booking.provider?.user?.last_name)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{(booking.status ?? "unknown").toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell>{(booking.payment_status ?? "unknown").toUpperCase()}</TableCell>
                          <TableCell>{formatDate(booking.scheduled_at)}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(booking.total_amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No bookings found for this client.</p>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}
