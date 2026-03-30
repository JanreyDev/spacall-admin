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
