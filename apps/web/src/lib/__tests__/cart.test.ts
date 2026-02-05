import { describe, it, expect } from "vitest";
import { cartReducer, initialCartState } from "../cart";

describe("cartReducer", () => {
  it("adds item and increments quantity", () => {
    const s1 = cartReducer(initialCartState, {
      type: "add",
      productId: 1,
      name: "Laptop",
      priceCents: 10000,
    });
    expect(s1.items[0].quantity).toBe(1);

    const s2 = cartReducer(s1, {
      type: "add",
      productId: 1,
      name: "Laptop",
      priceCents: 10000,
    });
    expect(s2.items[0].quantity).toBe(2);
  });

  it("computes total", () => {
    const s1 = cartReducer(initialCartState, {
      type: "add",
      productId: 1,
      name: "Laptop",
      priceCents: 10000,
    });
    const s2 = cartReducer(s1, {
      type: "add",
      productId: 2,
      name: "Mouse",
      priceCents: 500,
    });
    expect(s2.totalCents).toBe(10500);
  });
});
