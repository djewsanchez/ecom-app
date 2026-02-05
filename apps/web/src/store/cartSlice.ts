import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type CartItem = {
  productId: number;
  name: string;
  priceCents: number;
  quantity: number;
};

type CartState = { items: CartItem[]; totalCents: number };

const initialState: CartState = { items: [], totalCents: 0 };

function total(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
}

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{
        productId: number;
        name: string;
        priceCents: number;
      }>,
    ) {
      const { productId, name, priceCents } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity += 1;
      else state.items.push({ productId, name, priceCents, quantity: 1 });
      state.totalCents = total(state.items);
    },
    setQty(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (!item) return;
      item.quantity = Math.max(1, action.payload.quantity);
      state.totalCents = total(state.items);
    },
    removeItem(state, action: PayloadAction<{ productId: number }>) {
      state.items = state.items.filter(
        (i) => i.productId !== action.payload.productId,
      );
      state.totalCents = total(state.items);
    },
    clearCart(state) {
      state.items = [];
      state.totalCents = 0;
    },
  },
});

export const { addItem, setQty, removeItem, clearCart } = slice.actions;
export default slice.reducer;

export const selectCartItems = (s: RootState) => s.cart.items;
export const selectCartCount = (s: RootState) => s.cart.items.length;
export const selectCartTotal = (s: RootState) => s.cart.totalCents;
