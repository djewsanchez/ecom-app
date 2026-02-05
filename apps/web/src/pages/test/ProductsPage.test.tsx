import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../test/render";
import { ProductsPage } from "../ProductsPage";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("ProductsPage", () => {
  it("renders products from API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify([
          { id: 1, name: "Laptop", description: "", price_cents: 100000 },
        ]),
    } as any);

    renderWithProviders(<ProductsPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });
  });

  it("renders error state", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      text: async () => JSON.stringify({ detail: "Boom" }),
      statusText: "Error",
    } as any);

    renderWithProviders(<ProductsPage />);

    await waitFor(() => {
      expect(screen.getByText(/boom/i)).toBeInTheDocument();
    });
  });
});
