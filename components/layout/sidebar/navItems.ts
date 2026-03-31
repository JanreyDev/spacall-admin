import { BarChart3, Calendar, LayoutDashboard, MessagesSquare, Settings, Star, UserCircle, Users, Briefcase, Layers } from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/therapists", label: "Therapists", icon: Users },
  { href: "/admin/clients", label: "Clients", icon: UserCircle },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/messages", label: "Messages", icon: MessagesSquare },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/tiers", label: "Tiers", icon: Layers },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default navItems
