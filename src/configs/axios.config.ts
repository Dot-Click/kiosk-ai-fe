import ax, { AxiosError } from "axios";
import { getBackendDomain, logEnvConfig } from "../utils/env.util";

export const environment = process.env.NODE_ENV as "production" | "development";
export type ErrorWithMessage = AxiosError<WithMessage>;
export interface WithMessage {
  message: string;
}

export interface ApiResponse<T = {}> {
  data: null | undefined | T;
  message: string;
}

const sanitizeDomain = (domain: string) => {
  if (domain.at(-1) === "/")
    throw new Error(
      "Invalid domain format \n valid domains:\nhttps://www.example.com\nThe domain should not end with '/'"
    );
  return domain.at(-1) === "/" ? domain.slice(0, -1) + "/api" : domain + "/api";
};

// Professional environment configuration
export const backendDomain = getBackendDomain();
export const url = sanitizeDomain(backendDomain);

// Log environment config in development
logEnvConfig();

export const axios = ax.create({
  baseURL: url,
  withCredentials: true,
});
