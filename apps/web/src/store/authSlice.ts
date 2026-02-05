import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

const KEY = "ecom_token";

type AuthState = { token: string | null };
const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem(KEY) : null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem(KEY, action.payload);
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem(KEY);
    },
  },
});

export const { setToken, logout } = slice.actions;
export default slice.reducer;

export const selectToken = (s: RootState) => s.auth.token;
export const selectIsLoggedIn = (s: RootState) => !!s.auth.token;
