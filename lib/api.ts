export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ??
  "http://167.172.89.188:8080/api";

export const ADMIN_TOKEN_STORAGE_KEY = "spacall_admin_token";
export const ADMIN_USER_STORAGE_KEY = "spacall_admin_user";

export interface AdminUser {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  sort_order?: number | null;
  is_active?: boolean;
}

export interface ServiceItem {
  id: number;
  category_id: number | null;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  duration_minutes: number;
  base_price: string | number;
  vip_price?: string | number | null;
  image_url?: string | null;
  sort_order?: number | null;
  is_active: boolean;
  category?: ServiceCategory | null;
}

export interface AdminTherapistUser {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  photo_url?: string | null;
}

export interface AdminTherapist {
  id: number;
  verification_status?: string | null;
  average_rating?: string | number | null;
  total_bookings?: number | null;
  total_earnings?: string | number | null;
  user?: AdminTherapistUser | null;
  therapist_profile?: {
    vip_status?: string | null;
    vip_applied_at?: string | null;
  } | null;
}

export interface AdminTherapistDetail {
  id: number;
  uuid?: string | null;
  verification_status?: string | null;
  type?: string | null;
  average_rating?: string | number | null;
  total_bookings?: number | null;
  total_reviews?: number | null;
  total_earnings?: string | number | null;
  is_active?: boolean | null;
  is_available?: boolean | null;
  accepts_home_service?: boolean | null;
  accepts_store_service?: boolean | null;
  created_at?: string | null;
  verified_at?: string | null;
  user?: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    mobile_number?: string | null;
    profile_photo_url?: string | null;
    customer_tier?: string | null;
  } | null;
  therapist_profile?: {
    bio?: string | null;
    specializations?: string[] | null;
    certifications?: string[] | null;
    languages_spoken?: string[] | null;
    years_of_experience?: number | null;
    license_number?: string | null;
    license_type?: string | null;
    license_expiry_date?: string | null;
    base_rate?: string | number | null;
    service_radius_km?: string | number | null;
    base_address?: string | null;
    has_own_equipment?: boolean | null;
    equipment_list?: string[] | null;
    gallery_images?: string[] | null;
    vip_status?: string | null;
    vip_applied_at?: string | null;
  } | null;
  therapist_stat?: {
    total_online_minutes?: number | null;
    total_extensions?: number | null;
    total_bookings?: number | null;
    last_online_at?: string | null;
  } | null;
  current_tier?: {
    id: number;
    name?: string | null;
    level?: number | null;
  } | null;
  locations?: Array<{
    latitude?: number | string | null;
    longitude?: number | string | null;
    recorded_at?: string | null;
  }> | null;
  documents?: Array<{
    id: number;
    type?: string | null;
    file_name?: string | null;
    file_url?: string | null;
    uploaded_at?: string | null;
  }> | null;
  reviews?: Array<{
    id: number;
    rating?: number | null;
    title?: string | null;
    body?: string | null;
    created_at?: string | null;
    user?: {
      first_name?: string | null;
      last_name?: string | null;
    } | null;
  }> | null;
}

export interface AdminTherapistTierProgress {
  next_tier_name?: string | null;
  next_tier_level?: number | null;
  requirements?: {
    online_minutes?: {
      required?: number | null;
      current?: number | null;
      remaining?: number | null;
    } | null;
    extensions?: {
      required?: number | null;
      current?: number | null;
      remaining?: number | null;
    } | null;
    bookings?: {
      required?: number | null;
      current?: number | null;
      remaining?: number | null;
    } | null;
  } | null;
}

export interface AdminClient {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  mobile_number?: string | null;
  profile_photo_url?: string | null;
  total_bookings?: number | null;
  total_spent?: string | number | null;
  customer_tier?: string | null;
  created_at?: string | null;
}

export interface AdminClientDetail {
  id: number;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  nickname?: string | null;
  email?: string | null;
  mobile_number?: string | null;
  profile_photo_url?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  status?: string | null;
  role?: string | null;
  customer_tier?: string | null;
  total_bookings?: number | null;
  total_spent?: string | number | null;
  wallet_balance?: string | number | null;
  created_at?: string | null;
  bookings?: Array<{
    id: number;
    booking_number?: string | null;
    status?: string | null;
    total_amount?: string | number | null;
    scheduled_at?: string | null;
    completed_at?: string | null;
    payment_status?: string | null;
    service?: {
      id: number;
      name?: string | null;
      duration_minutes?: number | null;
    } | null;
    provider?: {
      id: number;
      user?: {
        first_name?: string | null;
        last_name?: string | null;
        email?: string | null;
        profile_photo_url?: string | null;
      } | null;
    } | null;
    location?: {
      booking_id?: number;
      address?: string | null;
      latitude?: string | number | null;
      longitude?: string | number | null;
    } | null;
  }> | null;
}

export interface AdminDashboardStats {
  active_bookings?: number;
  bookings_today?: number;
  online_therapists?: number;
  total_revenue?: string | number;
  pending_payouts_amount?: string | number;
  pending_payouts_count?: number;
}

export interface AdminDashboardRevenuePoint {
  month?: string | null;
  revenue?: string | number | null;
}

export interface AdminDashboardRecentAlert {
  id: string;
  type?: string | null;
  title?: string | null;
  message?: string | null;
  time?: string | null;
  original_time?: string | null;
}

export interface AdminDashboardRecentBooking {
  id: number;
  booking_number?: string | null;
  status?: string | null;
  payment_status?: string | null;
  total_amount?: string | number | null;
  scheduled_at?: string | null;
  service?: {
    name?: string | null;
  } | null;
  customer?: {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
  therapist?: {
    id: number;
    nickname?: string | null;
  } | null;
  location?: {
    address?: string | null;
  } | null;
}

export interface AdminBookingItem {
  id: number;
  booking_number?: string | null;
  status?: string | null;
  total_amount?: string | number | null;
  scheduled_at?: string | null;
  service?: {
    id: number;
    name?: string | null;
    base_price?: string | number | null;
    duration_minutes?: number | null;
  } | null;
  customer?: {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    mobile_number?: string | null;
  } | null;
  location?: {
    id: number;
    address?: string | null;
    latitude?: string | number | null;
    longitude?: string | number | null;
  } | null;
  therapist?: {
    id: number;
    nickname?: string | null;
  } | null;
}

export interface AdminBookingStats {
  total?: number;
  active?: number;
  completed?: number;
  cancelled?: number;
  requested?: number;
}

export interface AdminReviewItem {
  id: number | string;
  booking_id?: number | string | null;
  rating?: number | null;
  comment?: string | null;
  created_at?: string | null;
  status?: "Published" | "Flagged" | "Hidden" | string;
  service_name?: string | null;
  client?: {
    id?: number | string | null;
    name?: string | null;
    avatar?: string | null;
  } | null;
  therapist?: {
    id?: number | string | null;
    name?: string | null;
    avatar?: string | null;
  } | null;
}

export interface AdminReviewStats {
  total_reviews?: number;
  avg_rating?: number;
  flagged_reviews?: number;
  top_rated_therapist?: {
    name?: string | null;
    rating?: number | string | null;
  } | null;
}

export interface AdminTherapistRatingItem {
  therapist_id?: string | null;
  therapist_name?: string | null;
  therapist_avatar?: string | null;
  average_rating?: number | null;
  total_reviews?: number | null;
  five_stars?: number | null;
  four_stars?: number | null;
  three_stars?: number | null;
  two_stars?: number | null;
  one_stars?: number | null;
  recent_trend?: "up" | "down" | "stable" | string | null;
}

type RequestInitWithBody = RequestInit & {
  body?: unknown;
};

function getJsonHeaders(token?: string): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.message === "string" && data.message) {
      return data.message;
    }
    if (data?.errors && typeof data.errors === "object") {
      const firstError = Object.values(data.errors)[0];
      if (Array.isArray(firstError) && firstError[0]) {
        return String(firstError[0]);
      }
      if (firstError) {
        return String(firstError);
      }
    }
  } catch {
    // no-op
  }
  return `Request failed (${response.status})`;
}

async function apiRequest<T>(
  path: string,
  init: RequestInitWithBody = {},
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...getJsonHeaders(token),
      ...(init.headers ?? {}),
    },
    body:
      init.body !== undefined && init.body !== null
        ? JSON.stringify(init.body)
        : undefined,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as T;
}

export async function adminLogin(email: string, password: string) {
  return apiRequest<{
    token: string;
    user: AdminUser;
    message: string;
  }>("/admin/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function fetchServiceCategories(token: string) {
  return apiRequest<{ categories: ServiceCategory[] }>(
    "/admin/services/categories",
    { method: "GET" },
    token,
  );
}

export interface ServiceCategoryCreatePayload {
  name: string;
  description?: string;
  sort_order?: number;
  icon_url?: string;
  is_active?: boolean;
}

export async function createServiceCategory(
  token: string,
  payload: ServiceCategoryCreatePayload,
) {
  return apiRequest<{ message: string; category: ServiceCategory }>(
    "/admin/services/categories",
    { method: "POST", body: payload },
    token,
  );
}

export async function fetchServices(token: string, params?: {
  search?: string;
  category_id?: number | null;
}) {
  const query = new URLSearchParams();
  if (params?.search) {
    query.set("search", params.search);
  }
  if (params?.category_id) {
    query.set("category_id", String(params.category_id));
  }

  const queryString = query.toString();
  return apiRequest<{ services: ServiceItem[] }>(
    `/admin/services${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
    token,
  );
}

export interface ServiceUpsertPayload {
  category_id: number;
  name: string;
  description?: string;
  short_description?: string;
  duration_minutes: number;
  base_price: number;
  vip_price?: number | null;
  is_active: boolean;
  sort_order?: number;
  image_url?: string;
}

export async function createService(token: string, payload: ServiceUpsertPayload) {
  return apiRequest<{ message: string; service: ServiceItem }>(
    "/admin/services",
    { method: "POST", body: payload },
    token,
  );
}

export async function updateService(
  token: string,
  id: number,
  payload: Partial<ServiceUpsertPayload>,
) {
  return apiRequest<{ message: string; service: ServiceItem }>(
    `/admin/services/${id}`,
    { method: "PUT", body: payload },
    token,
  );
}

export async function deleteService(token: string, id: number) {
  return apiRequest<{ message: string }>(
    `/admin/services/${id}`,
    { method: "DELETE" },
    token,
  );
}

export async function fetchAdminTherapists(
  token: string,
  params?: { search?: string; verification_status?: string },
) {
  const query = new URLSearchParams();
  if (params?.search) {
    query.set("search", params.search);
  }
  if (params?.verification_status && params.verification_status !== "all") {
    query.set("verification_status", params.verification_status);
  }

  const queryString = query.toString();
  return apiRequest<{ therapists: { data: AdminTherapist[] } }>(
    `/admin/therapists${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
    token,
  );
}

export async function approveTherapistVip(token: string, therapistId: number) {
  return apiRequest<{ message: string }>(
    `/admin/therapists/${therapistId}/approve-vip`,
    { method: "POST" },
    token,
  );
}

export async function fetchAdminTherapistDetails(token: string, therapistId: number) {
  return apiRequest<{
    therapist: AdminTherapistDetail;
    tier_progress?: AdminTherapistTierProgress | null;
  }>(
    `/admin/therapists/${therapistId}`,
    { method: "GET" },
    token,
  );
}

export async function rejectTherapistVip(token: string, therapistId: number) {
  return apiRequest<{ message: string }>(
    `/admin/therapists/${therapistId}/reject-vip`,
    { method: "POST" },
    token,
  );
}

export async function fetchAdminClients(
  token: string,
  params?: { search?: string; page?: number },
) {
  const query = new URLSearchParams();
  if (params?.search) {
    query.set("search", params.search);
  }
  if (params?.page) {
    query.set("page", String(params.page));
  }

  const queryString = query.toString();
  return apiRequest<{
    clients: {
      data: AdminClient[];
      total: number;
      current_page: number;
      last_page: number;
    };
  }>(
    `/admin/clients${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
    token,
  );
}

export async function fetchAdminClientDetails(token: string, clientId: number) {
  return apiRequest<{ client: AdminClientDetail }>(
    `/admin/clients/${clientId}`,
    { method: "GET" },
    token,
  );
}

export async function fetchAdminDashboardStats(token: string) {
  return apiRequest<{
    stats?: AdminDashboardStats;
    recent_bookings?: AdminDashboardRecentBooking[];
    revenue_chart?: AdminDashboardRevenuePoint[];
    recent_alerts?: AdminDashboardRecentAlert[];
  }>(
    "/admin/dashboard-stats",
    { method: "GET" },
    token,
  );
}

export async function fetchAdminBookings(
  token: string,
  params?: {
    status?: string;
    search?: string;
    service_type?: string;
    page?: number;
  },
) {
  const query = new URLSearchParams();
  if (params?.status) {
    query.set("status", params.status);
  }
  if (params?.search) {
    query.set("search", params.search);
  }
  if (params?.service_type) {
    query.set("service_type", params.service_type);
  }
  if (params?.page) {
    query.set("page", String(params.page));
  }

  const queryString = query.toString();
  return apiRequest<{
    bookings: AdminBookingItem[];
    stats?: AdminBookingStats;
    meta?: {
      current_page?: number;
      last_page?: number;
      total?: number;
    };
  }>(
    `/admin/bookings${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
    token,
  );
}

export async function fetchAdminReviews(
  token: string,
  params?: {
    search?: string;
    rating?: string;
    page?: number;
  },
) {
  const query = new URLSearchParams();
  if (params?.search) {
    query.set("search", params.search);
  }
  if (params?.rating && params.rating !== "all") {
    query.set("rating", params.rating);
  }
  if (params?.page) {
    query.set("page", String(params.page));
  }

  const queryString = query.toString();
  return apiRequest<{
    reviews: AdminReviewItem[];
    therapist_ratings?: AdminTherapistRatingItem[];
    stats?: AdminReviewStats;
    meta?: {
      current_page?: number;
      last_page?: number;
      total?: number;
    };
  }>(
    `/admin/reviews${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
    token,
  );
}

export async function uploadServiceImage(token: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/admin/services/upload-image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as { url: string; message: string };
}
