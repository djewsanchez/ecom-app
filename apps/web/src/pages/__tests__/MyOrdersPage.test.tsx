import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithStore } from "../../test/renderWithStore";
import { MyOrdersPage } from "../MyOrdersPage";

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("MyOrdersPage (Redux)", () => {
  it("blocks when not logged in", () => {
    renderWithStore(<MyOrdersPage />, {
      auth: { token: null },
      cart: { items: [], totalCents: 0 },
    });
    expect(screen.getByText(/please log in/i)).toBeInTheDocument();
  });

  it("renders orders from API", async () => {
    localStorage.setItem("ecom_token", "abc");

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify([
          {
            id: 10,
            total_cents: 200000,
            created_at: "2026-02-05T10:00:00Z",
            items: [],
          },
        ]),
    } as any);

    renderWithStore(<MyOrdersPage />, {
      auth: { token: "abc" },
      cart: { items: [], totalCents: 0 },
    });

    await waitFor(() => {
      expect(screen.getByText(/order #10/i)).toBeInTheDocument();
    });
  });

  it("shows error on API failure", async () => {
    localStorage.setItem("ecom_token", "abc");

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      statusText: "Unauthorized",
      text: async () => JSON.stringify({ detail: "Unauthorized" }),
    } as any);

    renderWithStore(<MyOrdersPage />, {
      auth: { token: "abc" },
      cart: { items: [], totalCents: 0 },
    });

    await waitFor(() => {
      expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
    });
  });
});
