import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import cartReducer from "../store/cartSlice";
import type { ReactElement } from "react";
import { MantineProvider } from "@mantine/core";

export function renderWithStore(ui: ReactElement, preloadedState?: {}) {
  const store = configureStore({
    reducer: { auth: authReducer, cart: cartReducer },
    preloadedState,
  });

  return {
    store,
    ...render(
      <MantineProvider>
        <Provider store={store}>{ui}</Provider>
      </MantineProvider>,
    ),
  };
}
