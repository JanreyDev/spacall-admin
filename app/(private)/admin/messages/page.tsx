"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Search, MessageSquare, Flag, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConversationList } from "@/components/message-logs/conversation-list"
import { MessageViewer } from "@/components/message-logs/message-viewer"
import type { Conversation, Message } from "@/lib/mock-data"
import {
  ADMIN_TOKEN_STORAGE_KEY,
  fetchAdminMessageConversation,
  fetchAdminMessageConversations,
  type AdminMessageConversation,
  type AdminMessageItem,
} from "@/lib/api"

function mapMessage(item: AdminMessageItem): Message {
  return {
    id: item.id,
    sender: item.sender,
    senderId: item.sender_id,
    senderName: item.sender_name,
    senderAvatar: item.sender_avatar ?? "",
    content: item.content,
    timestamp: item.timestamp,
    read: item.read,
    flagged: item.flagged,
  }
}

function mapConversationSummary(item: AdminMessageConversation): Conversation {
  const previewMessage: Message | null = item.last_message
    ? {
        id: item.last_message.id,
        sender: "Client",
        senderId: "",
        senderName: item.last_message.sender_name,
        senderAvatar: "",
        content: item.last_message.content,
        timestamp: item.last_message.created_at ?? item.last_message_at ?? new Date().toISOString(),
        read: true,
        flagged: false,
      }
    : null

  return {
    id: item.id,
    bookingId: item.booking_id,
    clientId: item.client_id,
    clientName: item.client_name || "Unknown Client",
    clientAvatar: item.client_avatar ?? "",
    therapistId: item.therapist_id,
    therapistName: item.therapist_name || "Unknown Therapist",
    therapistAvatar: item.therapist_avatar ?? "",
    lastMessageAt: item.last_message_at ?? new Date().toISOString(),
    status: item.status,
    unreadCount: item.unread_count ?? 0,
    messages: previewMessage ? [previewMessage] : [],
  }
}

function mapConversationFull(item: AdminMessageConversation): Conversation {
  return {
    id: item.id,
    bookingId: item.booking_id,
    clientId: item.client_id,
    clientName: item.client_name || "Unknown Client",
    clientAvatar: item.client_avatar ?? "",
    therapistId: item.therapist_id,
    therapistName: item.therapist_name || "Unknown Therapist",
    therapistAvatar: item.therapist_avatar ?? "",
    lastMessageAt: item.last_message_at ?? new Date().toISOString(),
    status: item.status,
    unreadCount: item.unread_count ?? 0,
    messages: (item.messages ?? []).map(mapMessage),
  }
}

export default function MessagesPage() {
  const [token, setToken] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    flagged: 0,
  })

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? ""
    setToken(savedToken)
  }, [])

  const loadConversations = useCallback(async (authToken: string, searchValue: string, statusValue: string) => {
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetchAdminMessageConversations(authToken, {
        search: searchValue.trim() || undefined,
        status: statusValue,
      })

      const mapped = (response.conversations ?? []).map(mapConversationSummary)
      setConversations(mapped)
      setStats({
        total: Number(response.stats?.total ?? mapped.length),
        active: Number(response.stats?.active ?? mapped.filter((c) => c.status === "Active").length),
        flagged: Number(response.stats?.flagged ?? mapped.filter((c) => c.status === "Flagged").length),
      })

      if (selectedConversation) {
        const exists = mapped.find((item) => item.id === selectedConversation.id)
        if (!exists) {
          setSelectedConversation(null)
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch conversations.")
    } finally {
      setLoading(false)
    }
  }, [selectedConversation])

  useEffect(() => {
    if (!token) return
    void loadConversations(token, search, statusFilter)
  }, [token, search, statusFilter, loadConversations])

  async function handleSelectConversation(conversation: Conversation) {
    if (!token) return
    try {
      setErrorMessage(null)
      const response = await fetchAdminMessageConversation(token, Number(conversation.id))
      setSelectedConversation(mapConversationFull(response.conversation))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch conversation details.")
      setSelectedConversation(conversation)
    }
  }

  const totalConversations = useMemo(() => stats.total, [stats.total])
  const activeCount = useMemo(() => stats.active, [stats.active])
  const flaggedCount = useMemo(() => stats.flagged, [stats.flagged])

  if (!token) {
    return (
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
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
        <h1 className="text-2xl font-bold tracking-tight">Message Logs</h1>
        <p className="text-muted-foreground">View and monitor conversations between clients and therapists</p>
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalConversations}</p>
              <p className="text-xs text-muted-foreground">Total Conversations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sidebar-primary/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sidebar-primary">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active Chats</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Flag className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{flaggedCount}</p>
              <p className="text-xs text-muted-foreground">Flagged Conversations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {loading && conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2">Loading conversations...</p>
              ) : (
                <ConversationList
                  conversations={conversations}
                  selectedId={selectedConversation?.id || null}
                  onSelect={handleSelectConversation}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[600px]">
          <MessageViewer conversation={selectedConversation} />
        </Card>
      </div>
    </div>
  )
}
