"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock3, Layers, Save, Users } from "lucide-react"
import {
  ADMIN_TOKEN_STORAGE_KEY,
  fetchAdminTierMembers,
  fetchAdminTiers,
  updateAdminTier,
  type AdminTier,
  type AdminTierMember,
} from "@/lib/api"

type TierDraft = {
  id: number
  name: string
  level: number
  online_minutes_required: number
  extensions_required: number
  bookings_required: number
}

function memberName(member: AdminTierMember) {
  const firstName = member.user?.first_name ?? ""
  const lastName = member.user?.last_name ?? ""
  return `${firstName} ${lastName}`.trim() || "Unknown Therapist"
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function TiersPage() {
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<Record<number, boolean>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [tiers, setTiers] = useState<TierDraft[]>([])
  const [membersOpen, setMembersOpen] = useState(false)
  const [membersLoading, setMembersLoading] = useState(false)
  const [membersTierName, setMembersTierName] = useState("")
  const [members, setMembers] = useState<AdminTierMember[]>([])

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? ""
    setToken(savedToken)
  }, [])

  useEffect(() => {
    if (!token) return
    void loadTiers(token)
  }, [token])

  async function loadTiers(authToken: string) {
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetchAdminTiers(authToken)
      const mapped = (response.tiers ?? []).map((tier: AdminTier) => ({
        id: tier.id,
        name: tier.name,
        level: Number(tier.level ?? 0),
        online_minutes_required: Number(tier.online_minutes_required ?? 0),
        extensions_required: Number(tier.extensions_required ?? 0),
        bookings_required: Number(tier.bookings_required ?? 0),
      }))
      setTiers(mapped)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load tiers.")
    } finally {
      setLoading(false)
    }
  }

  function updateTierDraft(id: number, key: keyof TierDraft, value: string | number) {
    setTiers((prev) =>
      prev.map((tier) =>
        tier.id === id
          ? {
              ...tier,
              [key]:
                key === "name"
                  ? String(value)
                  : Number.isFinite(Number(value))
                    ? Number(value)
                    : 0,
            }
          : tier,
      ),
    )
  }

  async function saveTier(tier: TierDraft) {
    if (!token) return
    try {
      setSaving((prev) => ({ ...prev, [tier.id]: true }))
      setErrorMessage(null)
      setSuccessMessage(null)
      const response = await updateAdminTier(token, tier.id, {
        name: tier.name,
        online_minutes_required: Math.max(0, Number(tier.online_minutes_required ?? 0)),
        extensions_required: Math.max(0, Number(tier.extensions_required ?? 0)),
        bookings_required: Math.max(0, Number(tier.bookings_required ?? 0)),
      })
      setSuccessMessage(response.message || `Tier ${tier.name} updated.`)
      await loadTiers(token)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update tier.")
    } finally {
      setSaving((prev) => ({ ...prev, [tier.id]: false }))
    }
  }

  async function openMembers(tier: TierDraft) {
    if (!token) return
    try {
      setMembersOpen(true)
      setMembersLoading(true)
      setMembersTierName(tier.name)
      setMembers([])
      const response = await fetchAdminTierMembers(token, tier.id)
      setMembersTierName(response.tier?.name ?? tier.name)
      setMembers(response.members ?? [])
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load tier members.")
    } finally {
      setMembersLoading(false)
    }
  }

  const tierCount = tiers.length
  const maxLevel = useMemo(() => Math.max(0, ...tiers.map((tier) => tier.level)), [tiers])

  if (!token) {
    return (
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Tiers</CardTitle>
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tier Management</h1>
        <p className="text-muted-foreground">Configure unlock requirements and review therapists assigned to each tier.</p>
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Tiers</p>
            <p className="text-2xl font-bold">{tierCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Highest Level</p>
            <p className="text-2xl font-bold">Level {maxLevel}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Sync Behavior</p>
            <p className="text-sm font-medium mt-1">Updates re-evaluate therapist tiers immediately.</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card className="border-border">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Loading tiers...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tiers.map((tier) => (
            <Card key={tier.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Tier Level {tier.level}</p>
                  </div>
                  <Badge variant="secondary">Level {tier.level}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label htmlFor={`online-${tier.id}`}>Online Minutes</Label>
                    <Input
                      id={`online-${tier.id}`}
                      type="number"
                      min={0}
                      value={tier.online_minutes_required}
                      onChange={(event) => updateTierDraft(tier.id, "online_minutes_required", event.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`extensions-${tier.id}`}>Extensions</Label>
                    <Input
                      id={`extensions-${tier.id}`}
                      type="number"
                      min={0}
                      value={tier.extensions_required}
                      onChange={(event) => updateTierDraft(tier.id, "extensions_required", event.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`bookings-${tier.id}`}>Bookings</Label>
                    <Input
                      id={`bookings-${tier.id}`}
                      type="number"
                      min={0}
                      value={tier.bookings_required}
                      onChange={(event) => updateTierDraft(tier.id, "bookings_required", event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`name-${tier.id}`}>Tier Name</Label>
                  <Input
                    id={`name-${tier.id}`}
                    value={tier.name}
                    onChange={(event) => updateTierDraft(tier.id, "name", event.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Button variant="outline" onClick={() => openMembers(tier)}>
                    <Users className="h-4 w-4 mr-2" />
                    Show Therapists
                  </Button>
                  <Button
                    onClick={() => saveTier(tier)}
                    className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    disabled={saving[tier.id]}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving[tier.id] ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={membersOpen} onOpenChange={setMembersOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{membersTierName} Members</DialogTitle>
            <DialogDescription>Therapists currently assigned to this tier.</DialogDescription>
          </DialogHeader>
          {membersLoading ? (
            <p className="text-sm text-muted-foreground">Loading therapists...</p>
          ) : (
            <ScrollArea className="max-h-[60vh] pr-2">
              <div className="space-y-3">
                {members.length ? (
                  members.map((member) => {
                    const name = memberName(member)
                    const onlineMinutes = Number(member.therapist_stat?.total_online_minutes ?? 0)
                    const extensionCount = Number(member.therapist_stat?.total_extensions ?? 0)
                    const bookingCount = Number(member.therapist_stat?.total_bookings ?? member.total_bookings ?? 0)
                    return (
                      <div key={member.id} className="rounded-lg border border-border p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.user?.profile_photo_url ?? "/placeholder.svg"} />
                            <AvatarFallback>{initials(name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{name}</p>
                            <p className="text-xs text-muted-foreground truncate">{member.user?.email ?? "No email"}</p>
                          </div>
                          <Badge variant="outline">{(member.verification_status ?? "unknown").toUpperCase()}</Badge>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
                          <div className="rounded-md bg-secondary/30 p-2">
                            <p className="text-muted-foreground text-xs">Online Minutes</p>
                            <p className="font-semibold flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {onlineMinutes}
                            </p>
                          </div>
                          <div className="rounded-md bg-secondary/30 p-2">
                            <p className="text-muted-foreground text-xs">Extensions</p>
                            <p className="font-semibold">{extensionCount}</p>
                          </div>
                          <div className="rounded-md bg-secondary/30 p-2">
                            <p className="text-muted-foreground text-xs">Bookings</p>
                            <p className="font-semibold">{bookingCount}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    No therapists currently assigned to this tier.
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
