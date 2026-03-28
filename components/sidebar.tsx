"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UserCircle,
  X,
  Star,
  BarChart3,
  MessagesSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/therapists", label: "Therapists", icon: Users },
  { href: "/clients", label: "Clients", icon: UserCircle },
  { href: "/bookings", label: "Bookings", icon: Calendar },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/disputes", label: "Disputes", icon: MessageSquare },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/messages", label: "Messages", icon: MessagesSquare },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ collapsed, onCollapsedChange, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileClose} />}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          // Mobile: hidden by default, shown when mobileOpen
          "max-lg:-translate-x-full max-lg:data-[mobile-open=true]:translate-x-0",
        )}
        data-mobile-open={mobileOpen}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className={cn(
              "flex h-16 items-center border-b border-sidebar-border px-4",
              collapsed ? "justify-center" : "justify-between",
            )}
          >
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-sidebar-primary" />
                <span className="text-xl font-bold tracking-tight">Spacall</span>
              </div>
            )}
            {collapsed && <Sparkles className="h-6 w-6 text-sidebar-primary" />}

            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar hover:text-sidebar-primary lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCollapsedChange(!collapsed)}
              className={cn(
                "h-8 w-8 text-sidebar-foreground hover:bg-sidebar hover:text-sidebar-primary hidden lg:flex",
                collapsed && "absolute -right-3 top-6 rounded-full bg-sidebar border border-sidebar-border",
              )}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-muted-foreground hover:bg-sidebar hover:text-sidebar-foreground",
                    collapsed && "justify-center px-2",
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary-foreground")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-sidebar-border p-3">
            <div className={cn("flex items-center gap-3 rounded-lg px-3 py-2", collapsed && "justify-center px-2")}>
              <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-sidebar-primary-foreground">SA</span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Super Admin</p>
                  <p className="text-xs text-muted-foreground truncate">admin@spacall.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
