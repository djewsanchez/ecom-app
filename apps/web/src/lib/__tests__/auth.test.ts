import { describe, it, expect, vi, beforeEach } from "vitest";
import { authStore } from "../auth";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("authStore", () => {
  it("stores token on setToken()", () => {
    authStore.setToken("abc");
    expect(authStore.getToken()).toBe("abc");
  });

  it("clears token on logout()", () => {
    authStore.setToken("abc");
    authStore.logout();
    expect(authStore.getToken()).toBeNull();
  });
});
