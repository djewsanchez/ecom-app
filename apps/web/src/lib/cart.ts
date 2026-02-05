export type CartItem = {
  productId: number;
  name: string;
  priceCents: number;
  quantity: number;
};
export type CartState = { items: CartItem[]; totalCents: number };

export const initialCartState: CartState = { items: [], totalCents: 0 };

type Action =
  | { type: "add"; productId: number; name: string; priceCents: number }
  | { type: "remove"; productId: number }
  | { type: "setQty"; productId: number; quantity: number }
  | { type: "clear" };

function computeTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
}

export function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.items.find(
        (i) => i.productId === action.productId,
      );
      const items = existing
        ? state.items.map((i) =>
            i.productId === action.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        : [
            ...state.items,
            {
              productId: action.productId,
              name: action.name,
              priceCents: action.priceCents,
              quantity: 1,
            },
          ];
      return { items, totalCents: computeTotal(items) };
    }
    case "remove": {
      const items = state.items.filter((i) => i.productId !== action.productId);
      return { items, totalCents: computeTotal(items) };
    }
    case "setQty": {
      const items = state.items.map((i) =>
        i.productId === action.productId
          ? { ...i, quantity: Math.max(1, action.quantity) }
          : i,
      );
      return { items, totalCents: computeTotal(items) };
    }
    case "clear":
      return initialCartState;
  }
}
