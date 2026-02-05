const KEY = "ecom_token";

export const authStore = {
  getToken(): string | null {
    return localStorage.getItem(KEY);
  },
  setToken(token: string) {
    localStorage.setItem(KEY, token);
  },
  logout() {
    localStorage.removeItem(KEY);
  },
};
