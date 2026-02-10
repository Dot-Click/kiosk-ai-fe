import ax, { AxiosError } from "axios";
import { getBackendDomain, logEnvConfig } from "../utils/env.util";

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

const buildApiBaseUrl = (domain: string): string => {
  const trimmed = domain.endsWith("/") ? domain.slice(0, -1) : domain;
  return `${trimmed}/api`;
};

// Backend domain and base API URL (shared across app)
export const backendDomain = getBackendDomain();
export const apiBaseUrl = buildApiBaseUrl(backendDomain);

// Log environment config in development
logEnvConfig();

// Pre-configured axios instance for the frontend
export const axios = ax.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

