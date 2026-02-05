export type ApiError = { detail?: string; errors?: Record<string, unknown> };

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // 1. Retrieve the token from localStorage
  const token = localStorage.getItem("ecom_token");

  // 2. Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string>) ?? {}),
  };

  // 3. Inject Authorization header if token exists
  // Note the SPACE after "Bearer " - this is critical!
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const resp = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;

  if (!resp.ok) {
    throw data ?? { detail: resp.statusText };
  }

  return data as T;
}

export type User = {
  id: number;
  email: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price_cents: number;
};

export type Order = {
  id: number;
  user_id: number;
  total_cents: number;
  created_at: Date;
};

export const api = {
  register: (email: string, password: string) =>
    request<User>(`/api/users/register/`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }),
  login: (email: string, password: string) =>
    request<User>(`/api/users/login/`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }),

  getProducts: () => request<Product[]>("/api/catalog/products/"),
  getProduct: (id: number) => request<Product>(`/api/catalog/products/${id}/`),
  createOrder: (payload: {
    items: { product_id: number; quantity: number }[];
  }) =>
    request<Order>(`/api/catalog/order/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getMyOrders: () => request<Order[]>("/api/catalog/orders/my/"),
};
