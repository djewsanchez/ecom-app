import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";
import { renderWithProviders } from "../test/render";

describe("App", () => {
  it("renders app title", () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole("heading", { name: /e-commerce microservices/i }),
    ).toBeInTheDocument();
  });
});
