"use client"

import { formatDistanceToNow } from "date-fns"
import { Flag, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Conversation } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (conversation: Conversation) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-1 p-2 font-sans">
        {conversations.map((conversation) => {
          const isSelected = selectedId === conversation.id
          const lastMessage = conversation.messages[conversation.messages.length - 1]

          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation)}
              className={cn(
                "w-full rounded-lg p-3 text-left transition-colors",
                isSelected ? "bg-sidebar-primary/10 border border-sidebar-primary/30" : "hover:bg-muted",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.clientAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{conversation.clientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversation.status === "Flagged" && (
                    <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                      <Flag className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">{conversation.clientName}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MessageCircle className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">{conversation.therapistName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{lastMessage?.content}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {conversation.unreadCount > 0 && (
                    <Badge className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5",
                      conversation.status === "Active" && "border-green-500/50 text-green-600",
                      conversation.status === "Completed" && "border-muted-foreground/50 text-muted-foreground",
                      conversation.status === "Flagged" && "border-red-500/50 text-red-600",
                    )}
                  >
                    {conversation.status}
                  </Badge>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </ScrollArea>
  )
}
