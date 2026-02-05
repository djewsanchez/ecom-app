import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithStore } from "../../test/renderWithStore";
import { CheckoutPage } from "../CheckoutPage";

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("CheckoutPage (Redux)", () => {
  it("blocks checkout when not logged in", () => {
    renderWithStore(<CheckoutPage />, {
      auth: { token: null },
      cart: { items: [], totalCents: 0 },
    });
    expect(screen.getByText(/please log in/i)).toBeInTheDocument();
  });

  it("posts order payload and clears cart on success", async () => {
    // API uses token from localStorage (from your api.ts), so set it too:
    localStorage.setItem("ecom_token", "abc");

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ id: 10 }),
    } as any);

    const { store } = renderWithStore(<CheckoutPage />, {
      auth: { token: "abc" },
      cart: {
        items: [
          { productId: 1, name: "Laptop", priceCents: 100000, quantity: 2 },
        ],
        totalCents: 200000,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() => {
      expect(screen.getByText(/order placed/i)).toBeInTheDocument();
    });

    // Verify payload
    const [, init] = fetchSpy.mock.calls[0];
    const body = JSON.parse((init as any).body);
    expect(body).toEqual({ items: [{ product_id: 1, quantity: 2 }] });

    // Verify cart cleared in store
    expect(store.getState().cart.items.length).toBe(0);
  });

  it("shows error and keeps cart on failure", async () => {
    localStorage.setItem("ecom_token", "abc");

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      statusText: "Bad Request",
      text: async () => JSON.stringify({ detail: "Invalid" }),
    } as any);

    const { store } = renderWithStore(<CheckoutPage />, {
      auth: { token: "abc" },
      cart: {
        items: [
          { productId: 1, name: "Laptop", priceCents: 100000, quantity: 1 },
        ],
        totalCents: 100000,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });

    // Cart unchanged
    expect(store.getState().cart.items.length).toBe(1);
  });
});
