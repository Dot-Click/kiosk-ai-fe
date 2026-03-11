import ax, { AxiosError } from "axios";

export const environment =
  (import.meta.env.MODE as "production" | "development") ?? "development";

export interface WithMessage {
  message: string;
}

export type ErrorWithMessage = AxiosError<WithMessage>;

export interface ApiResponse<T = unknown> {
  data: null | undefined | T;
  message: string;
}

// Backend base URL – use VITE_BACKEND_URL in .env to override (e.g. http://localhost:5000)
export const backendDomain =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";
  // import.meta.env.VITE_BACKEND_URL ?? "https://kiosk-ai-be-production.up.railway.app";
export const apiBaseUrl = `${backendDomain}/api`;

// Pre-configured axios instance for the frontend
export const axios = ax.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If we get an unauthorized error (like jwt expired), force logout
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("adminToken");
        if (token) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);




