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
  fetchAdminSupportSessionMessages,
  fetchAdminSupportSessions,
  type AdminSupportMessage,
  type AdminSupportSession,
} from "@/lib/api"

function mapMessage(item: AdminSupportMessage): Message {
  const role = (item.sender_role ?? "").toLowerCase()
  const senderType: Message["sender"] =
    role === "admin" ? "Admin" : role === "therapist" ? "Therapist" : "Client"

  return {
    id: String(item.id),
    sender: senderType,
    senderId: String(item.sender_id),
    senderName: item.sender_name,
    senderAvatar: item.sender_avatar ?? "",
    content: item.content,
    timestamp: item.created_at,
    read: true,
    flagged: false,
  }
}

function isFlaggedText(value?: string | null) {
  const text = (value ?? "").toLowerCase()
  return ["refund", "complain", "unacceptable", "late", "delay"].some((keyword) => text.includes(keyword))
}

function mapConversationSummary(item: AdminSupportSession): Conversation {
  const previewMessage: Message | null = item.last_message
    ? {
        id: `preview-${item.id}`,
        sender: "Client",
        senderId: "",
        senderName: item.user_name,
        senderAvatar: "",
        content: item.last_message,
        timestamp: item.updated_at ?? new Date().toISOString(),
        read: true,
        flagged: isFlaggedText(item.last_message),
      }
    : null

  const mappedStatus: Conversation["status"] =
    item.status === "closed" ? "Completed" : isFlaggedText(item.last_message) ? "Flagged" : "Active"

  return {
    id: String(item.id),
    bookingId: `SUP-${item.id}`,
    clientId: String(item.user_id),
    clientName: item.user_name || "Unknown User",
    clientAvatar: item.user_avatar ?? "",
    therapistId: String(item.admin_id ?? "0"),
    therapistName: item.admin_name || "Admin Support",
    therapistAvatar: item.admin_avatar ?? "",
    lastMessageAt: item.updated_at ?? new Date().toISOString(),
    status: mappedStatus,
    unreadCount: 0,
    messages: previewMessage ? [previewMessage] : [],
  }
}

function mapConversationFull(item: AdminSupportSession, messages: AdminSupportMessage[]): Conversation {
  const mappedStatus: Conversation["status"] =
    item.status === "closed" ? "Completed" : messages.some((msg) => isFlaggedText(msg.content)) ? "Flagged" : "Active"

  return {
    id: String(item.id),
    bookingId: `SUP-${item.id}`,
    clientId: String(item.user_id),
    clientName: item.user_name || "Unknown User",
    clientAvatar: item.user_avatar ?? "",
    therapistId: String(item.admin_id ?? "0"),
    therapistName: item.admin_name || "Admin Support",
    therapistAvatar: item.admin_avatar ?? "",
    lastMessageAt: item.updated_at ?? new Date().toISOString(),
    status: mappedStatus,
    unreadCount: 0,
    messages: messages.map(mapMessage),
  }
}

export default function MessagesPage() {
  const [token, setToken] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [sessionMap, setSessionMap] = useState<Record<string, AdminSupportSession>>({})
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
      const apiStatus =
        statusValue === "completed" ? "closed" : statusValue === "active" ? "open" : "all"
      const response = await fetchAdminSupportSessions(authToken, apiStatus)
      const sessions = response.sessions ?? []
      const mapped = sessions.map(mapConversationSummary)
      setSessionMap(
        sessions.reduce<Record<string, AdminSupportSession>>((acc, item) => {
          acc[String(item.id)] = item
          return acc
        }, {}),
      )
      const searched = searchValue.trim().toLowerCase()
      const filtered = searched
        ? mapped.filter((conversation) => {
            const latest = conversation.messages[conversation.messages.length - 1]
            return (
              conversation.clientName.toLowerCase().includes(searched) ||
              conversation.therapistName.toLowerCase().includes(searched) ||
              (latest?.content ?? "").toLowerCase().includes(searched)
            )
          })
        : mapped
      const finalList =
        statusValue === "flagged" ? filtered.filter((conversation) => conversation.status === "Flagged") : filtered

      setConversations(finalList)
      setStats({
        total: finalList.length,
        active: finalList.filter((c) => c.status === "Active").length,
        flagged: finalList.filter((c) => c.status === "Flagged").length,
      })

      if (selectedConversation) {
        const exists = finalList.find((item) => item.id === selectedConversation.id)
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
      const sessionId = Number(conversation.id)
      const selectedSession = sessionMap[String(sessionId)]
      const messageResponse = await fetchAdminSupportSessionMessages(token, sessionId)
      if (selectedSession) {
        setSelectedConversation(mapConversationFull(selectedSession, messageResponse.messages ?? []))
      } else {
        setSelectedConversation(conversation)
      }
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
