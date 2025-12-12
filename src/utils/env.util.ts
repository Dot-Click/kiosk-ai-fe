/**
 * Professional Environment Variable Utilities
 * Handles environment configuration with proper fallbacks and error handling
 */

interface EnvironmentConfig {
  backendDomain: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Gets the backend domain with professional error handling
 */
export const getBackendDomain = (): string => {
  const envDomain = import.meta.env.VITE_BACKEND_DOMAIN;

  if (!envDomain) {
    // Development fallback
    if (import.meta.env.MODE === "development") {
      console.warn(
        "⚠️ VITE_BACKEND_DOMAIN not set, using development fallback: http://localhost:3001"
      );
      return "http://localhost:3001";
    }

    // Production error
    throw new Error(
      `🚨 Environment Configuration Error!\n` +
        `VITE_BACKEND_DOMAIN environment variable is required in production.\n\n` +
        `To fix this:\n` +
        `1. Create a .env file in your project root\n` +
        `2. Add: VITE_BACKEND_DOMAIN=https://your-api-domain.com\n` +
        `3. Restart your development server\n\n` +
        `Example .env file:\n` +
        `VITE_BACKEND_DOMAIN=https://api.yourapp.com`
    );
  }

  return envDomain;
};

/**
 * Gets complete environment configuration
 */
export const getEnvConfig = (): EnvironmentConfig => {
  const backendDomain = getBackendDomain();

  return {
    backendDomain,
    isDevelopment: import.meta.env.MODE === "development",
    isProduction: import.meta.env.MODE === "production",
  };
};

/**
 * Utility function to build API URLs
 */
export const buildApiUrl = (endpoint: string): string => {
  const domain = getBackendDomain();

  // Ensure domain doesn't end with '/'
  const cleanDomain = domain.endsWith("/") ? domain.slice(0, -1) : domain;
  // Ensure endpoint starts with '/'
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${cleanDomain}${cleanEndpoint}`;
};

/**
 * Logs environment configuration (development only)
 */
export const logEnvConfig = (): void => {
  if (import.meta.env.MODE === "development") {
    console.group("🔧 Environment Configuration");
    console.log("Backend Domain:", getBackendDomain());
    console.log("Mode:", import.meta.env.MODE);
    console.log("API Base URL:", buildApiUrl("/api"));
    console.groupEnd();
  }
};
