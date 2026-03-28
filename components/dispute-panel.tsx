"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Dispute } from "@/lib/mock-data"
import { Send, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DisputePanelProps {
  dispute: Dispute
}

export function DisputePanel({ dispute }: DisputePanelProps) {
  const [newMessage, setNewMessage] = useState("")

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const senderColors = {
    Client: "bg-secondary",
    Therapist: "bg-black text-white",
    Admin: "bg-sidebar-primary text-sidebar-primary-foreground",
  }

  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border font-sans">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Dispute #{dispute.id}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Booking: {dispute.bookingId} • {dispute.clientName} vs {dispute.therapistName}
            </p>
          </div>
          <Badge
            className={cn(
              "font-medium",
              dispute.status === "Open" && "bg-sidebar-primary text-sidebar-primary-foreground",
              dispute.status === "Under Review" && "bg-black text-white",
              dispute.status === "Resolved" && "bg-secondary text-foreground",
            )}
          >
            {dispute.status}
          </Badge>
        </div>
        <p className="text-sm mt-2">
          <span className="font-medium">Reason:</span> {dispute.reason}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {/* Chat Log */}
        <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
          {dispute.messages.map((message, index) => (
            <div key={index} className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className={senderColors[message.sender]}>{message.sender[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{message.sender}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                </div>
                <p className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3">{message.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Response */}
        <div className="border-t border-border p-4 space-y-3">
          <Textarea
            placeholder="Type your response as Admin..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                <CheckCircle className="mr-2 h-4 w-4" />
                Resolve in Favor of Client
              </Button>
              <Button variant="outline">
                <XCircle className="mr-2 h-4 w-4" />
                Resolve in Favor of Therapist
              </Button>
            </div>
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
