// Mock Data for Spacall Admin Dashboard

export interface Therapist {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  verificationStatus: "Verified" | "Pending" | "Rejected"
  rating: number
  totalBookings: number
  revenue: number
  joinedDate: string
  specialties: string[]
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  totalBookings: number
  totalSpent: number
  joinedDate: string
}

export interface Booking {
  id: string
  clientId: string
  clientName: string
  therapistId: string
  therapistName: string
  serviceType: string
  location: string
  status: "Requested" | "Confirmed" | "Ongoing" | "Completed" | "Cancelled"
  scheduledAt: string
  startedAt?: string
  completedAt?: string
  amount: number
  notes?: string
}

export interface Payout {
  id: string
  therapistId: string
  therapistName: string
  amount: number
  status: "Pending" | "Processing" | "Completed" | "Failed"
  requestedAt: string
  processedAt?: string
}

export interface Dispute {
  id: string
  bookingId: string
  clientName: string
  therapistName: string
  reason: string
  status: "Open" | "Under Review" | "Resolved"
  createdAt: string
  messages: {
    sender: "Client" | "Therapist" | "Admin"
    message: string
    timestamp: string
  }[]
}

export interface Alert {
  id: string
  type: "warning" | "error" | "info"
  title: string
  description: string
  timestamp: string
}

export interface DashboardMetrics {
  activeBookings: number
  onlineTherapists: number
  totalRevenue: number
  pendingPayouts: number
  bookingsToday: number
  newClients: number
}

export interface Review {
  id: string
  bookingId: string
  clientId: string
  clientName: string
  clientAvatar: string
  therapistId: string
  therapistName: string
  therapistAvatar: string
  rating: number
  comment: string
  serviceType: string
  createdAt: string
  status: "Published" | "Flagged" | "Hidden"
  adminResponse?: string
}

export interface TherapistRatingStats {
  therapistId: string
  therapistName: string
  therapistAvatar: string
  averageRating: number
  totalReviews: number
  fiveStars: number
  fourStars: number
  threeStars: number
  twoStars: number
  oneStars: number
  recentTrend: "up" | "down" | "stable"
}

export interface Message {
  id: string
  sender: "Client" | "Therapist"
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  read: boolean
  flagged: boolean
}

export interface Conversation {
  id: string
  bookingId: string
  clientId: string
  clientName: string
  clientAvatar: string
  therapistId: string
  therapistName: string
  therapistAvatar: string
  lastMessageAt: string
  status: "Active" | "Completed" | "Flagged"
  unreadCount: number
  messages: Message[]
}

export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Moderator" | "Support"
  status: "Active" | "Inactive"
  lastLogin: string
  joinedDate: string
  avatar?: string
  permissions: string[]
}

// Mock Therapists
export const mockTherapists: Therapist[] = [
  {
    id: "TH001",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 555-0101",
    avatar: "/asian-woman-therapist.jpg",
    verificationStatus: "Verified",
    rating: 4.9,
    totalBookings: 245,
    revenue: 18500,
    joinedDate: "2023-06-15",
    specialties: ["Swedish", "Deep Tissue", "Hot Stone"],
  },
  {
    id: "TH002",
    name: "Marcus Williams",
    email: "marcus.w@email.com",
    phone: "+1 555-0102",
    avatar: "/african-american-man-therapist.jpg",
    verificationStatus: "Verified",
    rating: 4.8,
    totalBookings: 189,
    revenue: 14200,
    joinedDate: "2023-08-22",
    specialties: ["Sports Massage", "Thai"],
  },
  {
    id: "TH003",
    name: "Elena Rodriguez",
    email: "elena.r@email.com",
    phone: "+1 555-0103",
    avatar: "/latina-therapist.png",
    verificationStatus: "Pending",
    rating: 4.5,
    totalBookings: 12,
    revenue: 900,
    joinedDate: "2024-01-10",
    specialties: ["Aromatherapy", "Reflexology"],
  },
  {
    id: "TH004",
    name: "James Park",
    email: "james.p@email.com",
    phone: "+1 555-0104",
    avatar: "/korean-man-therapist.jpg",
    verificationStatus: "Verified",
    rating: 4.95,
    totalBookings: 312,
    revenue: 23400,
    joinedDate: "2023-03-05",
    specialties: ["Shiatsu", "Acupressure"],
  },
  {
    id: "TH005",
    name: "Amanda Foster",
    email: "amanda.f@email.com",
    phone: "+1 555-0105",
    avatar: "/blonde-woman-therapist.jpg",
    verificationStatus: "Pending",
    rating: 0,
    totalBookings: 0,
    revenue: 0,
    joinedDate: "2024-01-18",
    specialties: ["Swedish", "Prenatal"],
  },
]

// Mock Clients
export const mockClients: Client[] = [
  {
    id: "CL001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 555-1001",
    avatar: "/professional-man-portrait.png",
    totalBookings: 24,
    totalSpent: 2880,
    joinedDate: "2023-04-12",
  },
  {
    id: "CL002",
    name: "Emily Davis",
    email: "emily.d@email.com",
    phone: "+1 555-1002",
    avatar: "/professional-blonde-woman.png",
    totalBookings: 18,
    totalSpent: 2160,
    joinedDate: "2023-06-22",
  },
  {
    id: "CL003",
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1 555-1003",
    avatar: "/man-dark-hair-portrait.jpg",
    totalBookings: 42,
    totalSpent: 5040,
    joinedDate: "2022-11-05",
  },
  {
    id: "CL004",
    name: "Lisa Johnson",
    email: "lisa.j@email.com",
    phone: "+1 555-1004",
    avatar: "/professional-woman-headshot.png",
    totalBookings: 8,
    totalSpent: 720,
    joinedDate: "2024-01-02",
  },
  {
    id: "CL005",
    name: "Robert Wilson",
    email: "r.wilson@email.com",
    phone: "+1 555-1005",
    avatar: "/older-professional-man.png",
    totalBookings: 56,
    totalSpent: 6720,
    joinedDate: "2022-08-15",
  },
  {
    id: "CL006",
    name: "Amanda Garcia",
    email: "a.garcia@email.com",
    phone: "+1 555-1006",
    avatar: "/latina-professional-woman.png",
    totalBookings: 31,
    totalSpent: 3720,
    joinedDate: "2023-02-28",
  },
  {
    id: "CL007",
    name: "Kevin Chen",
    email: "k.chen@email.com",
    phone: "+1 555-1007",
    avatar: "/asian-professional-man.png",
    totalBookings: 15,
    totalSpent: 1800,
    joinedDate: "2023-09-10",
  },
  {
    id: "CL008",
    name: "Sarah Thompson",
    email: "s.thompson@email.com",
    phone: "+1 555-1008",
    avatar: "/redhead-woman-professional.jpg",
    totalBookings: 67,
    totalSpent: 8040,
    joinedDate: "2022-05-20",
  },
]

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: "BK001",
    clientId: "CL001",
    clientName: "John Smith",
    therapistId: "TH001",
    therapistName: "Sarah Chen",
    serviceType: "Deep Tissue Massage",
    location: "123 Main St, Apt 4B, New York, NY",
    status: "Ongoing",
    scheduledAt: "2024-01-20T14:00:00",
    startedAt: "2024-01-20T14:05:00",
    amount: 120,
  },
  {
    id: "BK002",
    clientId: "CL002",
    clientName: "Emily Davis",
    therapistId: "TH002",
    therapistName: "Marcus Williams",
    serviceType: "Sports Recovery",
    location: "456 Oak Ave, Suite 200, Brooklyn, NY",
    status: "Requested",
    scheduledAt: "2024-01-20T16:00:00",
    amount: 150,
  },
  {
    id: "BK003",
    clientId: "CL003",
    clientName: "Michael Brown",
    therapistId: "TH004",
    therapistName: "James Park",
    serviceType: "Shiatsu",
    location: "789 Pine Rd, Manhattan, NY",
    status: "Completed",
    scheduledAt: "2024-01-20T10:00:00",
    startedAt: "2024-01-20T10:00:00",
    completedAt: "2024-01-20T11:00:00",
    amount: 100,
  },
  {
    id: "BK004",
    clientId: "CL004",
    clientName: "Lisa Johnson",
    therapistId: "TH001",
    therapistName: "Sarah Chen",
    serviceType: "Swedish Massage",
    location: "321 Elm St, Queens, NY",
    status: "Confirmed",
    scheduledAt: "2024-01-20T18:00:00",
    amount: 90,
  },
  {
    id: "BK005",
    clientId: "CL005",
    clientName: "Robert Wilson",
    therapistId: "TH002",
    therapistName: "Marcus Williams",
    serviceType: "Thai Massage",
    location: "654 Maple Dr, Bronx, NY",
    status: "Cancelled",
    scheduledAt: "2024-01-20T12:00:00",
    amount: 110,
    notes: "Client cancelled due to emergency",
  },
]

// Mock Payouts
export const mockPayouts: Payout[] = [
  {
    id: "PO001",
    therapistId: "TH001",
    therapistName: "Sarah Chen",
    amount: 2450,
    status: "Pending",
    requestedAt: "2024-01-18T09:00:00",
  },
  {
    id: "PO002",
    therapistId: "TH002",
    therapistName: "Marcus Williams",
    amount: 1890,
    status: "Processing",
    requestedAt: "2024-01-17T14:30:00",
  },
  {
    id: "PO003",
    therapistId: "TH004",
    therapistName: "James Park",
    amount: 3200,
    status: "Pending",
    requestedAt: "2024-01-19T11:00:00",
  },
]

// Mock Disputes
export const mockDisputes: Dispute[] = [
  {
    id: "DS001",
    bookingId: "BK089",
    clientName: "Jennifer Adams",
    therapistName: "Marcus Williams",
    reason: "Therapist arrived 30 minutes late",
    status: "Open",
    createdAt: "2024-01-19T16:00:00",
    messages: [
      {
        sender: "Client",
        message: "The therapist was 30 minutes late and did not apologize. I want a partial refund.",
        timestamp: "2024-01-19T16:00:00",
      },
      {
        sender: "Therapist",
        message: "I apologize for the delay. There was unexpected traffic due to an accident.",
        timestamp: "2024-01-19T16:30:00",
      },
    ],
  },
  {
    id: "DS002",
    bookingId: "BK076",
    clientName: "David Lee",
    therapistName: "Sarah Chen",
    reason: "Service quality not as expected",
    status: "Under Review",
    createdAt: "2024-01-18T10:00:00",
    messages: [
      {
        sender: "Client",
        message: "The massage technique was different from what I booked.",
        timestamp: "2024-01-18T10:00:00",
      },
      {
        sender: "Therapist",
        message:
          "I adjusted the technique based on the client muscle tension. I asked for feedback during the session.",
        timestamp: "2024-01-18T11:00:00",
      },
      {
        sender: "Admin",
        message: "We are reviewing this case. Both parties will be contacted within 24 hours.",
        timestamp: "2024-01-18T14:00:00",
      },
    ],
  },
]

// Mock Users
export const mockUsers: User[] = [
  {
    id: "USR001",
    name: "Admin User",
    email: "admin@spacall.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-18T14:30:00",
    joinedDate: "2023-01-01",
    avatar: "/admin-avatar.jpg",
    permissions: ["manage_users", "manage_therapists", "manage_disputes", "manage_payments", "view_analytics", "manage_settings"],
  },
  {
    id: "USR002",
    name: "Sarah Johnson",
    email: "sarah.j@spacall.com",
    role: "Moderator",
    status: "Active",
    lastLogin: "2024-01-18T09:15:00",
    joinedDate: "2023-06-15",
    avatar: "/moderator-sarah.jpg",
    permissions: ["manage_disputes", "manage_therapists", "view_analytics"],
  },
  {
    id: "USR003",
    name: "Mike Chen",
    email: "mike.chen@spacall.com",
    role: "Support",
    status: "Active",
    lastLogin: "2024-01-18T11:45:00",
    joinedDate: "2023-09-20",
    avatar: "/support-mike.jpg",
    permissions: ["respond_to_disputes", "view_messages", "manage_clients"],
  },
  {
    id: "USR004",
    name: "Emma Williams",
    email: "emma.w@spacall.com",
    role: "Moderator",
    status: "Inactive",
    lastLogin: "2024-01-10T16:20:00",
    joinedDate: "2023-05-10",
    avatar: "/moderator-emma.jpg",
    permissions: ["manage_disputes", "view_analytics"],
  },
  {
    id: "USR005",
    name: "David Brown",
    email: "david.b@spacall.com",
    role: "Support",
    status: "Active",
    lastLogin: "2024-01-18T13:00:00",
    joinedDate: "2023-11-01",
    avatar: "/support-david.jpg",
    permissions: ["respond_to_disputes", "view_messages"],
  },
]
// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: "AL001",
    type: "error",
    title: "Therapist No-Show",
    description: "TH003 (Elena Rodriguez) missed scheduled booking BK092",
    timestamp: "2024-01-20T13:15:00",
  },
  {
    id: "AL002",
    type: "warning",
    title: "Low Rating Alert",
    description: "TH005 received 2 consecutive ratings below 3 stars",
    timestamp: "2024-01-20T11:30:00",
  },
  {
    id: "AL003",
    type: "info",
    title: "New Verification Request",
    description: "3 new therapist applications awaiting review",
    timestamp: "2024-01-20T09:00:00",
  },
  {
    id: "AL004",
    type: "warning",
    title: "Payment Dispute",
    description: "Client refund request for booking BK089 needs attention",
    timestamp: "2024-01-20T08:45:00",
  },
]

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  activeBookings: 24,
  onlineTherapists: 18,
  totalRevenue: 125680,
  pendingPayouts: 7540,
  bookingsToday: 47,
  newClients: 12,
}

// Mock Revenue Data for Charts
export const mockRevenueData = [
  { month: "Jul", revenue: 42000, bookings: 320 },
  { month: "Aug", revenue: 48000, bookings: 380 },
  { month: "Sep", revenue: 52000, bookings: 410 },
  { month: "Oct", revenue: 61000, bookings: 485 },
  { month: "Nov", revenue: 58000, bookings: 460 },
  { month: "Dec", revenue: 72000, bookings: 540 },
  { month: "Jan", revenue: 78000, bookings: 590 },
]

// Mock Booking Status Distribution
export const mockStatusDistribution = [
  { status: "Completed", count: 1245, fill: "#b8860b" },
  { status: "Ongoing", count: 24, fill: "#000000" },
  { status: "Requested", count: 18, fill: "#666666" },
  { status: "Cancelled", count: 89, fill: "#999999" },
]

// Service Popularity Data
export const mockServicePopularity = [
  { service: "Deep Tissue", bookings: 342, revenue: 41040 },
  { service: "Swedish", bookings: 298, revenue: 26820 },
  { service: "Sports Recovery", bookings: 187, revenue: 28050 },
  { service: "Hot Stone", bookings: 156, revenue: 21840 },
  { service: "Shiatsu", bookings: 134, revenue: 13400 },
  { service: "Thai", bookings: 112, revenue: 12320 },
  { service: "Aromatherapy", bookings: 98, revenue: 9800 },
  { service: "Reflexology", bookings: 67, revenue: 6030 },
]

// Peak Hours Heatmap Data
export const mockPeakHours = [
  { day: "Mon", hours: [2, 3, 5, 8, 12, 15, 18, 14, 10, 6, 4, 2] },
  { day: "Tue", hours: [3, 4, 6, 10, 14, 16, 19, 15, 11, 7, 5, 3] },
  { day: "Wed", hours: [2, 3, 5, 9, 13, 17, 20, 16, 12, 8, 5, 2] },
  { day: "Thu", hours: [3, 4, 7, 11, 15, 18, 21, 17, 13, 9, 6, 3] },
  { day: "Fri", hours: [4, 5, 8, 12, 16, 20, 24, 20, 16, 11, 7, 4] },
  { day: "Sat", hours: [6, 8, 12, 18, 22, 26, 28, 24, 20, 14, 10, 6] },
  { day: "Sun", hours: [5, 7, 10, 14, 18, 20, 22, 18, 14, 10, 6, 4] },
]

// Geographic Distribution
export const mockGeographicData = [
  { area: "Manhattan", bookings: 456, revenue: 54720, percentage: 35 },
  { area: "Brooklyn", bookings: 312, revenue: 37440, percentage: 24 },
  { area: "Queens", bookings: 234, revenue: 28080, percentage: 18 },
  { area: "Bronx", bookings: 156, revenue: 18720, percentage: 12 },
  { area: "Staten Island", bookings: 78, revenue: 9360, percentage: 6 },
  { area: "Other", bookings: 65, revenue: 7800, percentage: 5 },
]

// Client Metrics
export const mockClientMetrics = {
  totalClients: 1245,
  newClientsThisMonth: 87,
  returningClients: 892,
  retentionRate: 71.6,
  avgBookingsPerClient: 3.2,
  avgSpendPerClient: 384,
}

// Top Performing Therapists
export const mockTopTherapists = [
  { id: "TH004", name: "James Park", bookings: 312, revenue: 23400, rating: 4.95 },
  { id: "TH001", name: "Sarah Chen", bookings: 245, revenue: 18500, rating: 4.9 },
  { id: "TH002", name: "Marcus Williams", bookings: 189, revenue: 14200, rating: 4.8 },
  { id: "TH003", name: "Elena Rodriguez", bookings: 12, revenue: 900, rating: 4.5 },
]

// Daily Revenue for last 30 days
export const mockDailyRevenue = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toISOString().split("T")[0],
    revenue: Math.floor(Math.random() * 3000) + 2000,
    bookings: Math.floor(Math.random() * 25) + 15,
  }
})

// Mock Therapist Ratings
export const mockTherapistRatings: TherapistRatingStats[] = [
  {
    therapistId: "TH004",
    therapistName: "James Park",
    therapistAvatar: "/korean-man-therapist.jpg",
    averageRating: 4.95,
    totalReviews: 156,
    fiveStars: 148,
    fourStars: 6,
    threeStars: 2,
    twoStars: 0,
    oneStars: 0,
    recentTrend: "up",
  },
  {
    therapistId: "TH001",
    therapistName: "Sarah Chen",
    therapistAvatar: "/asian-woman-therapist.jpg",
    averageRating: 4.9,
    totalReviews: 124,
    fiveStars: 112,
    fourStars: 10,
    threeStars: 1,
    twoStars: 0,
    oneStars: 1,
    recentTrend: "stable",
  },
  {
    therapistId: "TH002",
    therapistName: "Marcus Williams",
    therapistAvatar: "/african-american-man-therapist.jpg",
    averageRating: 4.8,
    totalReviews: 98,
    fiveStars: 82,
    fourStars: 12,
    threeStars: 2,
    twoStars: 2,
    oneStars: 0,
    recentTrend: "down",
  },
  {
    therapistId: "TH003",
    therapistName: "Elena Rodriguez",
    therapistAvatar: "/latina-therapist.png",
    averageRating: 4.5,
    totalReviews: 12,
    fiveStars: 7,
    fourStars: 3,
    threeStars: 2,
    twoStars: 0,
    oneStars: 0,
    recentTrend: "up",
  },
]

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: "RV001",
    bookingId: "BK003",
    clientId: "CL003",
    clientName: "Michael Brown",
    clientAvatar: "/man-dark-hair-portrait.jpg",
    therapistId: "TH004",
    therapistName: "James Park",
    therapistAvatar: "/korean-man-therapist.jpg",
    rating: 5,
    comment:
      "Absolutely amazing experience! James is incredibly skilled at Shiatsu. My back pain is completely gone after just one session. Highly recommend!",
    serviceType: "Shiatsu",
    createdAt: "2024-01-20T11:30:00",
    status: "Published",
  },
  {
    id: "RV002",
    bookingId: "BK045",
    clientId: "CL001",
    clientName: "John Smith",
    clientAvatar: "/professional-man-portrait.png",
    therapistId: "TH001",
    therapistName: "Sarah Chen",
    therapistAvatar: "/asian-woman-therapist.jpg",
    rating: 5,
    comment:
      "Sarah is the best massage therapist I've ever had. Very professional and attentive to problem areas. Will definitely book again!",
    serviceType: "Deep Tissue Massage",
    createdAt: "2024-01-19T16:00:00",
    status: "Published",
  },
  {
    id: "RV003",
    bookingId: "BK067",
    clientId: "CL002",
    clientName: "Emily Davis",
    clientAvatar: "/professional-blonde-woman.png",
    therapistId: "TH002",
    therapistName: "Marcus Williams",
    therapistAvatar: "/african-american-man-therapist.jpg",
    rating: 4,
    comment:
      "Great sports massage. Marcus really knows how to work out the knots. Only wish the session was a bit longer.",
    serviceType: "Sports Recovery",
    createdAt: "2024-01-18T14:00:00",
    status: "Published",
  },
  {
    id: "RV004",
    bookingId: "BK089",
    clientId: "CL006",
    clientName: "Amanda Garcia",
    clientAvatar: "/latina-professional-woman.png",
    therapistId: "TH002",
    therapistName: "Marcus Williams",
    therapistAvatar: "/african-american-man-therapist.jpg",
    rating: 2,
    comment:
      "Therapist was 30 minutes late and didn't seem apologetic. The massage itself was okay but the tardiness ruined the experience.",
    serviceType: "Thai Massage",
    createdAt: "2024-01-17T18:00:00",
    status: "Flagged",
  },
  {
    id: "RV005",
    bookingId: "BK102",
    clientId: "CL005",
    clientName: "Robert Wilson",
    clientAvatar: "/older-professional-man.png",
    therapistId: "TH001",
    therapistName: "Sarah Chen",
    therapistAvatar: "/asian-woman-therapist.jpg",
    rating: 5,
    comment: "Exceptional hot stone massage. Sarah created such a relaxing atmosphere. Best massage I've had in years.",
    serviceType: "Hot Stone",
    createdAt: "2024-01-16T12:00:00",
    status: "Published",
  },
  {
    id: "RV006",
    bookingId: "BK115",
    clientId: "CL007",
    clientName: "Kevin Chen",
    clientAvatar: "/asian-professional-man.png",
    therapistId: "TH004",
    therapistName: "James Park",
    therapistAvatar: "/korean-man-therapist.jpg",
    rating: 5,
    comment:
      "James is a master of acupressure. I came in with terrible shoulder tension and left feeling like a new person.",
    serviceType: "Acupressure",
    createdAt: "2024-01-15T10:00:00",
    status: "Published",
  },
  {
    id: "RV007",
    bookingId: "BK128",
    clientId: "CL008",
    clientName: "Sarah Thompson",
    clientAvatar: "/redhead-woman-professional.jpg",
    therapistId: "TH003",
    therapistName: "Elena Rodriguez",
    therapistAvatar: "/latina-therapist.png",
    rating: 3,
    comment:
      "The aromatherapy was nice but the massage pressure was too light for my preference. Communication could be better.",
    serviceType: "Aromatherapy",
    createdAt: "2024-01-14T15:00:00",
    status: "Published",
  },
  {
    id: "RV008",
    bookingId: "BK134",
    clientId: "CL004",
    clientName: "Lisa Johnson",
    clientAvatar: "/professional-woman-headshot.png",
    therapistId: "TH001",
    therapistName: "Sarah Chen",
    therapistAvatar: "/asian-woman-therapist.jpg",
    rating: 1,
    comment: "This is a SCAM! Do not use this service. Complete waste of money.",
    serviceType: "Swedish Massage",
    createdAt: "2024-01-13T09:00:00",
    status: "Hidden",
    adminResponse:
      "This review has been hidden due to violation of community guidelines. No specific feedback was provided.",
  },
]

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: "CONV001",
    bookingId: "BK001",
    clientId: "CL001",
    clientName: "John Smith",
    clientAvatar: "/professional-man-portrait.png",
    therapistId: "TH001",
    therapistName: "Sarah Chen",
    therapistAvatar: "/asian-woman-therapist.jpg",
    lastMessageAt: "2024-01-20T13:45:00",
    status: "Active",
    unreadCount: 2,
    messages: [
      {
        id: "MSG001",
        sender: "Client",
        senderId: "CL001",
        senderName: "John Smith",
        senderAvatar: "/professional-man-portrait.png",
        content: "Hi Sarah, I wanted to confirm our appointment for today at 2 PM.",
        timestamp: "2024-01-20T09:00:00",
        read: true,
        flagged: false,
      },
      {
        id: "MSG002",
        sender: "Therapist",
        senderId: "TH001",
        senderName: "Sarah Chen",
        senderAvatar: "/asian-woman-therapist.jpg",
        content: "Hi John! Yes, I have you down for 2 PM. I'll bring the deep tissue oils as discussed. See you soon!",
        timestamp: "2024-01-20T09:15:00",
        read: true,
        flagged: false,
      },
      {
        id: "MSG003",
        sender: "Client",
        senderId: "CL001",
        senderName: "John Smith",
        senderAvatar: "/professional-man-portrait.png",
        content: "Perfect! Just to let you know, the doorman will let you up. Apartment 4B.",
        timestamp: "2024-01-20T09:30:00",
        read: true,
        flagged: false,
      },
      {
        id: "MSG004",
        sender: "Therapist",
        senderId: "TH001",
        senderName: "Sarah Chen",
        senderAvatar: "/asian-woman-therapist.jpg",
        content: "Got it, thanks for the heads up! I'm on my way now, should arrive in about 15 minutes.",
        timestamp: "2024-01-20T13:45:00",
        read: false,
        flagged: false,
      },
    ],
  },
  {
    id: "CONV002",
    bookingId: "BK002",
    clientId: "CL002",
    clientName: "Emily Davis",
    clientAvatar: "/professional-blonde-woman.png",
    therapistId: "TH002",
    therapistName: "Marcus Williams",
    therapistAvatar: "/african-american-man-therapist.jpg",
    lastMessageAt: "2024-01-20T11:30:00",
    status: "Active",
    unreadCount: 0,
    messages: [
      {
        id: "MSG005",
        sender: "Client",
        senderId: "CL002",
        senderName: "Emily Davis",
        senderAvatar: "/professional-blonde-woman.png",
        content: "Hi Marcus, I have a sports recovery session scheduled for 4 PM. Can we focus on my lower back today?",
        timestamp: "2024-01-20T10:00:00",
        read: true,
        flagged: false,
      },
      {
        id: "MSG006",
        sender: "Therapist",
        senderId: "TH002",
        senderName: "Marcus Williams",
        senderAvatar: "/african-american-man-therapist.jpg",
        content:
          "Absolutely, Emily! I'll prepare some additional techniques specifically for lower back tension. Any specific injuries I should be aware of?",
        timestamp: "2024-01-20T10:15:00",
        read: true,
        flagged: false,
      },
      {
        id: "MSG007",
        sender: "Client",
        senderId: "CL002",
        senderName: "Emily Davis",
        senderAvatar: "/professional-blonde-woman.png",
        content: "I strained it during my marathon training last week. Nothing serious, just very tight.",
        timestamp: "2024-01-20T11:30:00",
        read: true,
        flagged: false,
      },
    ],
  },
  {
    id: "CONV003",
    bookingId: "BK089",
    clientId: "CL006",
    clientName: "Amanda Garcia",
    clientAvatar: "/latina-professional-woman.png",
    therapistId: "TH002",
    therapistName: "Marcus Williams",
    therapistAvatar: "/african-american-man-therapist.jpg",
    lastMessageAt: "2024-01-19T17:00:00",
    status: "Flagged",
    unreadCount: 0,
    messages: [
      {
        id: "MSG008",
        sender: "Client",
        senderId: "CL006",
        senderName: "Amanda Garcia",
        senderAvatar: "/latina-professional-woman.png",
        content: "I've been waiting for 30 minutes. Where are you?",
        timestamp: "2024-01-19T14:30:00",
        read: true,
        flagged: true,
      },
      {
        id: "MSG009",
        sender: "Therapist",
        senderId: "TH002",
        senderName: "Marcus Williams",
        senderAvatar: "/african-american-man-therapist.jpg",
        content: "I'm so sorry, I got stuck in traffic due to an accident. I'm almost there.",
        timestamp: "2024-01-19T14:35:00",
        read: true,
        flagged: false,
      },
      {
        id: "MSG010",
        sender: "Client",
        senderId: "CL006",
        senderName: "Amanda Garcia",
        senderAvatar: "/latina-professional-woman.png",
        content:
          "This is unacceptable. I paid for a full session and now I won't get the full time because of your lateness.",
        timestamp: "2024-01-19T14:40:00",
        read: true,
        flagged: true,
      },
      {
        id: "MSG011",
        sender: "Therapist",
        senderId: "TH002",
        senderName: "Marcus Williams",
        senderAvatar: "/african-american-man-therapist.jpg",
        content:
          "I completely understand your frustration. I'll extend the session at no extra charge to make up for the lost time.",
        timestamp: "2024-01-19T14:45:00",
        read: true,
        flagged: false,
      },
      {
        id: "MSG012",
        sender: "Client",
        senderId: "CL006",
        senderName: "Amanda Garcia",
        senderAvatar: "/latina-professional-woman.png",
        content: "I've already filed a complaint. This should have never happened.",
        timestamp: "2024-01-19T17:00:00",
        read: true,
        flagged: true,
      },
    ],
  },
  {
    id: "CONV004",
    bookingId: "BK103",
    clientId: "CL003",
    clientName: "Michael Brown",
    clientAvatar: "/man-dark-hair-portrait.jpg",
    therapistId: "TH004",
    therapistName: "James Park",
    therapistAvatar: "/korean-man-therapist.jpg",
    lastMessageAt: "2024-01-19T12:00:00",
    status: "Completed",
    unreadCount: 0,
    messages: [
      {
        id: "MSG013",
        sender: "Therapist",
        senderId: "TH004",
        senderName: "James Park",
        senderAvatar: "/korean-man-therapist.jpg",
        content:
          "Thank you for the session today, Michael! Remember to drink plenty of water and do the stretches I showed you.",
        timestamp: "2024-01-19T11:30:00",
        read: true,
        flagged: false,
      },
      {
        id: "MSG014",
        sender: "Client",
        senderId: "CL003",
        senderName: "Michael Brown",
        senderAvatar: "/man-dark-hair-portrait.jpg",
        content:
          "Thanks James! Best shiatsu session I've ever had. I'll definitely be booking you again. My back feels amazing!",
        timestamp: "2024-01-19T12:00:00",
        read: true,
        flagged: false,
      },
    ],
  },
  {
    id: "CONV005",
    bookingId: "BK110",
    clientId: "CL005",
    clientName: "Robert Wilson",
    clientAvatar: "/older-professional-man.png",
    therapistId: "TH001",
    therapistName: "Sarah Chen",
    therapistAvatar: "/asian-woman-therapist.jpg",
    lastMessageAt: "2024-01-18T16:00:00",
    status: "Completed",
    unreadCount: 0,
    messages: [
      {
        id: "MSG015",
        sender: "Client",
        senderId: "CL005",
        senderName: "Robert Wilson",
        senderAvatar: "/older-professional-man.png",
        content: "Hi Sarah, can we do the hot stone massage at a slightly lower temperature this time?",
        timestamp: "2024-01-18T10:00:00",
        read: true,
        flagged: false,
      },
      {
        id: "MSG016",
        sender: "Therapist",
        senderId: "TH001",
        senderName: "Sarah Chen",
        senderAvatar: "/asian-woman-therapist.jpg",
        content:
          "Of course, Robert! I'll make sure to adjust the temperature. Would you also like me to focus on any specific areas?",
        timestamp: "2024-01-18T10:30:00",
        read: true,
        flagged: false,
      },
      {
        id: "MSG017",
        sender: "Client",
        senderId: "CL005",
        senderName: "Robert Wilson",
        senderAvatar: "/older-professional-man.png",
        content: "Yes, my shoulders have been really tense from work. Thanks for asking!",
        timestamp: "2024-01-18T11:00:00",
        read: true,
        flagged: false,
      },
      {
        id: "MSG018",
        sender: "Therapist",
        senderId: "TH001",
        senderName: "Sarah Chen",
        senderAvatar: "/asian-woman-therapist.jpg",
        content: "Session complete! I hope you're feeling better. Let me know if you'd like to book another session.",
        timestamp: "2024-01-18T16:00:00",
        read: true,
        flagged: false,
      },
    ],
  },
]
