"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, CheckCircle, Clock, FileText, MapPin, Star, XCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ADMIN_TOKEN_STORAGE_KEY,
  approveTherapistVip,
  fetchAdminTherapistDetails,
  rejectTherapistVip,
  type AdminTherapistDetail,
  type AdminTherapistTierProgress,
} from "@/lib/api"
import { cn } from "@/lib/utils"

function fullName(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ").trim() || "Unknown Therapist"
}

function formatDate(value?: string | null) {
  if (!value) return "N/A"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "N/A"
  return date.toLocaleString()
}

function formatCurrency(value?: string | number | null) {
  const amount = Number(value ?? 0)
  if (!Number.isFinite(amount)) return "$0.00"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

function toNumber(value?: string | number | null) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export default function TherapistDetailsPage() {
  const params = useParams<{ id: string }>()
  const providerId = Number(params?.id)

  const [token, setToken] = useState("")
  const [therapist, setTherapist] = useState<AdminTherapistDetail | null>(null)
  const [tierProgress, setTierProgress] = useState<AdminTherapistTierProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [vipActionLoading, setVipActionLoading] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? ""
    setToken(savedToken)
  }, [])

  async function loadTherapist(authToken: string, id: number) {
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetchAdminTherapistDetails(authToken, id)
      setTherapist(response.therapist)
      setTierProgress(response.tier_progress ?? null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch therapist details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token || !Number.isFinite(providerId)) return
    void loadTherapist(token, providerId)
  }, [token, providerId])

  async function handleApproveVip() {
    if (!token || !Number.isFinite(providerId)) return
    try {
      setVipActionLoading(true)
      setSuccessMessage(null)
      setErrorMessage(null)
      await approveTherapistVip(token, providerId)
      setSuccessMessage("VIP application approved.")
      await loadTherapist(token, providerId)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to approve VIP.")
    } finally {
      setVipActionLoading(false)
    }
  }

  async function handleRejectVip() {
    if (!token || !Number.isFinite(providerId)) return
    try {
      setVipActionLoading(true)
      setSuccessMessage(null)
      setErrorMessage(null)
      await rejectTherapistVip(token, providerId)
      setSuccessMessage("VIP application rejected.")
      await loadTherapist(token, providerId)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to reject VIP.")
    } finally {
      setVipActionLoading(false)
    }
  }

  const vipStatus = (therapist?.therapist_profile?.vip_status ?? "none").toLowerCase()
  const rating = toNumber(therapist?.average_rating)
  const initials = useMemo(() => {
    const name = fullName(therapist?.user?.first_name, therapist?.user?.last_name)
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }, [therapist?.user?.first_name, therapist?.user?.last_name])

  if (!token) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Therapist Profile</CardTitle>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/admin/therapists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Therapists
          </Link>
        </Button>
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}

      {loading ? (
        <Card className="border-border">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Loading therapist details...</p>
          </CardContent>
        </Card>
      ) : null}

      {!loading && therapist ? (
        <>
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={therapist.user?.profile_photo_url ?? "/placeholder.svg"} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-semibold">{fullName(therapist.user?.first_name, therapist.user?.last_name)}</h2>
                    <p className="text-sm text-muted-foreground">{therapist.user?.email ?? "N/A"}</p>
                    <p className="text-sm text-muted-foreground">{therapist.user?.mobile_number ?? "No mobile number"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{(therapist.verification_status ?? "unknown").toUpperCase()}</Badge>
                  <Badge
                    className={cn(
                      vipStatus === "approved"
                        ? "bg-emerald-600 text-white"
                        : vipStatus === "pending"
                          ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary"
                          : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    VIP: {vipStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="mt-1 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-sidebar-primary text-sidebar-primary" />
                  <p className="text-2xl font-bold">{rating > 0 ? rating.toFixed(1) : "N/A"}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{toNumber(therapist.total_bookings)}</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(therapist.total_earnings)}</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Last Online</p>
                <p className="text-sm font-semibold">{formatDate(therapist.therapist_stat?.last_online_at)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="border-border lg:col-span-2">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="text-sm">{therapist.therapist_profile?.bio || "No bio provided."}</p>
                </div>
                <Separator />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="text-sm font-medium">
                      {therapist.therapist_profile?.years_of_experience ?? 0} years
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Base Rate</p>
                    <p className="text-sm font-medium">{formatCurrency(therapist.therapist_profile?.base_rate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">License Type</p>
                    <p className="text-sm font-medium">{therapist.therapist_profile?.license_type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">License Number</p>
                    <p className="text-sm font-medium">{therapist.therapist_profile?.license_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">License Expiry</p>
                    <p className="text-sm font-medium">{formatDate(therapist.therapist_profile?.license_expiry_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Radius</p>
                    <p className="text-sm font-medium">{toNumber(therapist.therapist_profile?.service_radius_km)} km</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Specializations</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(therapist.therapist_profile?.specializations ?? []).length ? (
                      (therapist.therapist_profile?.specializations ?? []).map((item) => (
                        <Badge key={item} variant="secondary">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm">No specializations listed.</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certifications</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(therapist.therapist_profile?.certifications ?? []).length ? (
                      (therapist.therapist_profile?.certifications ?? []).map((item) => (
                        <Badge key={item} variant="secondary">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm">No certifications listed.</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Languages</p>
                  <p className="text-sm">{(therapist.therapist_profile?.languages_spoken ?? []).join(", ") || "N/A"}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Has Own Equipment</p>
                    <p className="text-sm font-medium">{therapist.therapist_profile?.has_own_equipment ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Types</p>
                    <p className="text-sm font-medium">
                      {[
                        therapist.accepts_home_service ? "Home Service" : null,
                        therapist.accepts_store_service ? "Store Service" : null,
                      ]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Equipment List</p>
                  <p className="text-sm">{(therapist.therapist_profile?.equipment_list ?? []).join(", ") || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Base Address</p>
                  <p className="text-sm">{therapist.therapist_profile?.base_address || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>VIP Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Applied: {formatDate(therapist.therapist_profile?.vip_applied_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge
                    className={cn(
                      vipStatus === "approved"
                        ? "bg-emerald-600 text-white"
                        : vipStatus === "pending"
                          ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary"
                          : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    {vipStatus.toUpperCase()}
                  </Badge>
                </div>
                {vipStatus === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      onClick={handleApproveVip}
                      disabled={vipActionLoading}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      {vipActionLoading ? "Processing..." : "Approve VIP"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleRejectVip} disabled={vipActionLoading}>
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No pending VIP action.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
            </CardHeader>
            <CardContent>
              {(therapist.therapist_profile?.gallery_images ?? []).length ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {(therapist.therapist_profile?.gallery_images ?? []).map((image, index) => (
                    <a
                      key={`${image}-${index}`}
                      href={image}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block overflow-hidden rounded-md border border-border"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={image}
                          alt={`Therapist gallery ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No gallery images uploaded.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Tier Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tierProgress?.requirements ? (
                  <>
                    <p className="text-sm font-medium">
                      Next Tier: {tierProgress.next_tier_name ?? "N/A"} (Level {tierProgress.next_tier_level ?? 0})
                    </p>
                    {[
                      ["Online Minutes", tierProgress.requirements.online_minutes],
                      ["Extensions", tierProgress.requirements.extensions],
                      ["Bookings", tierProgress.requirements.bookings],
                    ].map(([label, requirement]) => {
                      const required = toNumber(requirement?.required ?? 0)
                      const current = toNumber(requirement?.current ?? 0)
                      const value = required <= 0 ? 0 : Math.min(100, Math.round((current / required) * 100))
                      return (
                        <div key={String(label)} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{label}</span>
                            <span>
                              {current}/{required}
                            </span>
                          </div>
                          <Progress value={value} />
                        </div>
                      )
                    })}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No next tier data available.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(therapist.documents ?? []).length ? (
                  (therapist.documents ?? []).map((document) => (
                    <div key={document.id} className="rounded-md border border-border p-3">
                      <p className="text-sm font-medium">{document.file_name || "Unnamed document"}</p>
                      <p className="text-xs text-muted-foreground">Type: {document.type || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">Uploaded: {formatDate(document.uploaded_at)}</p>
                      {document.file_url ? (
                        <a
                          href={document.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center text-xs text-primary hover:underline"
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          Open file
                        </a>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Recent Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(therapist.locations ?? []).length ? (
                  (therapist.locations ?? []).map((location, index) => (
                    <div key={`${location.recorded_at ?? "na"}-${index}`} className="rounded-md border border-border p-3">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {location.latitude ?? "N/A"}, {location.longitude ?? "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(location.recorded_at)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No location records found.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Latest Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(therapist.reviews ?? []).length ? (
                  (therapist.reviews ?? []).slice(0, 5).map((review) => (
                    <div key={review.id} className="rounded-md border border-border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{fullName(review.user?.first_name, review.user?.last_name)}</p>
                        <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-sidebar-primary text-sidebar-primary" />
                        <span className="text-sm font-medium">{toNumber(review.rating).toFixed(1)}</span>
                      </div>
                      {review.title ? <p className="mt-2 text-sm font-medium">{review.title}</p> : null}
                      {review.body ? <p className="mt-1 text-sm text-muted-foreground">{review.body}</p> : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No reviews yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}
