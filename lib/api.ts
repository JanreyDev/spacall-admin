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
