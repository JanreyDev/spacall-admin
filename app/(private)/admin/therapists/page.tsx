"use client"

import { useEffect, useMemo, useState } from "react"
import { TherapistTable } from "@/components/therapist-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download } from "lucide-react"
import type { Therapist } from "@/lib/mock-data"
import {
  ADMIN_TOKEN_STORAGE_KEY,
  approveTherapistVip,
  fetchAdminTherapists,
  rejectTherapistVip,
} from "@/lib/api"

type TherapistRow = Therapist & {
  providerId: number
  vipStatus?: string
}

function mapVerificationStatus(status?: string | null): Therapist["verificationStatus"] {
  const value = (status ?? "").toLowerCase()
  if (value === "verified") return "Verified"
  if (value === "pending") return "Pending"
  return "Rejected"
}

export default function TherapistsPage() {
  const [token, setToken] = useState("")
  const [therapists, setTherapists] = useState<TherapistRow[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [vipActionLoading, setVipActionLoading] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? ""
    setToken(savedToken)
  }, [])

  useEffect(() => {
    if (!token) return
    void loadTherapists(token, search, statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function loadTherapists(authToken: string, searchValue: string, statusValue: string) {
    try {
      setLoading(true)
      setErrorMessage(null)

      const response = await fetchAdminTherapists(authToken, {
        search: searchValue.trim() || undefined,
        verification_status: statusValue,
      })

      const mapped: TherapistRow[] = (response.therapists?.data ?? []).map((item) => {
        const fullName = [item.user?.first_name, item.user?.last_name].filter(Boolean).join(" ").trim()
        const ratingValue = Number(item.average_rating ?? 0)
        return {
          providerId: item.id,
          id: String(item.id),
          name: fullName || "Unknown Therapist",
          email: item.user?.email ?? "-",
          phone: "-",
          avatar: item.user?.photo_url ?? "",
          verificationStatus: mapVerificationStatus(item.verification_status),
          rating: Number.isFinite(ratingValue) ? ratingValue : 0,
          totalBookings: Number(item.total_bookings ?? 0),
          revenue: Number(item.total_earnings ?? 0),
          joinedDate: "",
          specialties: [],
          vipStatus: item.therapist_profile?.vip_status ?? "none",
        }
      })

      setTherapists(mapped)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch therapists.")
    } finally {
      setLoading(false)
    }
  }

  const avgRating = useMemo(() => {
    const rated = therapists.filter((t) => t.rating > 0)
    if (rated.length === 0) return "0.0"
    const total = rated.reduce((sum, current) => sum + current.rating, 0)
    return (total / rated.length).toFixed(1)
  }, [therapists])

  const vipPendingCount = useMemo(
    () => therapists.filter((t) => (t.vipStatus ?? "").toLowerCase() === "pending").length,
    [therapists],
  )

  async function handleApproveVip(providerId: number) {
    if (!token) return
    try {
      setVipActionLoading((prev) => ({ ...prev, [providerId]: true }))
      setErrorMessage(null)
      setSuccessMessage(null)
      await approveTherapistVip(token, providerId)
      setSuccessMessage("VIP application approved.")
      await loadTherapists(token, search, statusFilter)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to approve VIP.")
    } finally {
      setVipActionLoading((prev) => ({ ...prev, [providerId]: false }))
    }
  }

  async function handleRejectVip(providerId: number) {
    if (!token) return
    try {
      setVipActionLoading((prev) => ({ ...prev, [providerId]: true }))
      setErrorMessage(null)
      setSuccessMessage(null)
      await rejectTherapistVip(token, providerId)
      setSuccessMessage("VIP application rejected.")
      await loadTherapists(token, search, statusFilter)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to reject VIP.")
    } finally {
      setVipActionLoading((prev) => ({ ...prev, [providerId]: false }))
    }
  }

  if (!token) {
    return (
      <div className="space-y-6 bg-background text-foreground">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Therapists</CardTitle>
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
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Therapists</p>
              <p className="text-2xl font-bold">{therapists.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold">
                {therapists.filter((t) => t.verificationStatus === "Verified").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-primary">
                {therapists.filter((t) => t.verificationStatus === "Pending").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
              <p className="text-2xl font-bold">{avgRating}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">VIP Applications</p>
              <p className="text-2xl font-bold text-primary">{vipPendingCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search therapists..."
                className="pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => loadTherapists(token, search, statusFilter)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
              <Button className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Therapist
            </Button>
          </div>
        </div>

        {/* Therapist Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>All Therapists</CardTitle>
          </CardHeader>
          <CardContent>
            {errorMessage ? <p className="mb-3 text-sm text-destructive">{errorMessage}</p> : null}
            {successMessage ? <p className="mb-3 text-sm text-emerald-600">{successMessage}</p> : null}
            <TherapistTable
              therapists={therapists}
              onApproveVip={handleApproveVip}
              onRejectVip={handleRejectVip}
              vipActionLoading={vipActionLoading}
            />
          </CardContent>
        </Card>
      </div>
  )
}
