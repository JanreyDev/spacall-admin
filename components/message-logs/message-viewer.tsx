"use client"

import { formatDistanceToNow } from "date-fns"
import { Flag, AlertTriangle, User, Briefcase } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Conversation, Message } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface MessageViewerProps {
  conversation: Conversation | null
}

function MessageBubble({ message, isClient }: { message: Message; isClient: boolean }) {
  return (
    <div className={cn("flex gap-3", isClient ? "flex-row" : "flex-row-reverse")}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
        <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col max-w-[70%]", !isClient && "items-end")}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium">{message.senderName}</span>
          <Badge variant="outline" className="text-[10px] px-1 py-0">
            {message.sender === "Client" ? (
              <User className="h-2.5 w-2.5 mr-0.5" />
            ) : (
              <Briefcase className="h-2.5 w-2.5 mr-0.5" />
            )}
            {message.sender}
          </Badge>
          {message.flagged && <Flag className="h-3 w-3 text-red-500" />}
        </div>
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isClient ? "bg-muted" : "bg-sidebar-primary/10",
            message.flagged && "border border-destructive/30 bg-destructive/5",
          )}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </span>
      </div>
    </div>
  )
}

export function MessageViewer({ conversation }: MessageViewerProps) {
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a conversation to view messages</p>
        </div>
      </div>
    )
  }

  const flaggedMessages = conversation.messages.filter((m) => m.flagged)

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarImage src={conversation.clientAvatar || "/placeholder.svg"} />
                <AvatarFallback>{conversation.clientName.charAt(0)}</AvatarFallback>
              </Avatar>
              <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarImage src={conversation.therapistAvatar || "/placeholder.svg"} />
                <AvatarFallback>{conversation.therapistName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold">
                {conversation.clientName} & {conversation.therapistName}
              </h3>
              <p className="text-xs text-muted-foreground">Booking #{conversation.bookingId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {conversation.status === "Flagged" && (
              <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                <Flag className="h-3 w-3 mr-1" />
                {flaggedMessages.length} Flagged
              </Badge>
            )}
            <Button variant="outline" size="sm">
              View Booking
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 font-sans">
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} isClient={message.sender === "Client"} />
          ))}
        </div>
      </ScrollArea>

      {/* Actions */}
      <Separator />
      <div className="p-4 flex items-center gap-2">
        <Button variant="outline" className="flex-1 bg-transparent">
          <Flag className="h-4 w-4 mr-2" />
          Flag Conversation
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Export Chat Log
        </Button>
      </div>
    </div>
  )
}
