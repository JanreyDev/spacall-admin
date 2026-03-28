"use client"

import { useState } from "react"
import { Search, MessageSquare, Flag, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ConversationList } from "@/components/message-logs/conversation-list"
import { MessageViewer } from "@/components/message-logs/message-viewer"
import { mockConversations, type Conversation } from "@/lib/mock-data"

export default function MessagesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch =
      conv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      conv.therapistName.toLowerCase().includes(search.toLowerCase()) ||
      conv.messages.some((m) => m.content.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalConversations = mockConversations.length
  const flaggedCount = mockConversations.filter((c) => c.status === "Flagged").length
  const activeCount = mockConversations.filter((c) => c.status === "Active").length

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Message Logs</h1>
          <p className="text-muted-foreground">View and monitor conversations between clients and therapists</p>
        </div>

        {/* Stats */}
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

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
          {/* Conversation List */}
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
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ConversationList
                  conversations={filteredConversations}
                  selectedId={selectedConversation?.id || null}
                  onSelect={setSelectedConversation}
                />
              </div>
            </CardContent>
          </Card>

          {/* Message Viewer */}
          <Card className="min-h-[600px]">
            <MessageViewer conversation={selectedConversation} />
          </Card>
        </div>
      </div>
  )
}
