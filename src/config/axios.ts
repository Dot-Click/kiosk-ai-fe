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

// Backend base URL (Railway)
export const backendDomain = "http://kiosk-ai-be-production.up.railway.app";
// export const backendDomain = "http://localhost:5000";
export const apiBaseUrl = `${backendDomain}/api`;

// Pre-configured axios instance for the frontend
export const axios = ax.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

