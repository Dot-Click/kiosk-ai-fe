import { useState, useCallback } from "react";
import { axios } from "@/config/axios";

export interface StripeSettings {
  id: string;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  isActive: boolean;
  currency: string;
  updatedAt: string;
  updatedBy: string;
}

interface StripeSettingsResponse {
  success: boolean;
  message: string;
  data?: StripeSettings;
}

/** Secret key is masked when it contains **** (from API). Don't send masked value on update. */
export function isMaskedSecret(value: string): boolean {
  return !value || value.includes("****");
}

export interface UpdateStripeSettingsPayload {
  publishableKey: string;
  /** Send only when user entered a new key (not masked). Omit to keep existing. */
  secretKey?: string;
  webhookSecret?: string;
  isActive?: boolean;
  currency?: string;
}

interface UseStripeSettingsReturn {
  settings: StripeSettings | null;
  loading: boolean;
  saving: boolean;
  testLoading: boolean;
  error: string | null;
  success: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (payload: UpdateStripeSettingsPayload) => Promise<void>;
  testConnection: () => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
}

const AUTH_HEADERS = (): { Authorization: string } => {
  const token = localStorage.getItem("adminToken");
  return { Authorization: `Bearer ${token}` };
};

export const useStripeSettings = (): UseStripeSettingsReturn => {
  const [settings, setSettings] = useState<StripeSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.get<StripeSettingsResponse>(
        "/admin/stripe-settings",
        { headers: AUTH_HEADERS() }
      );
      if (response.data.success && response.data.data) {
        setSettings(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch settings");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch Stripe settings";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(
    async (payload: UpdateStripeSettingsPayload) => {
      setSaving(true);
      setError(null);
      setSuccess(null);
      try {
        const body: Record<string, unknown> = {
          publishableKey: payload.publishableKey,
          webhookSecret: payload.webhookSecret ?? "",
          isActive: payload.isActive ?? false,
          currency: payload.currency ?? "inr",
        };
        if (
          payload.secretKey &&
          !isMaskedSecret(payload.secretKey)
        ) {
          body.secretKey = payload.secretKey;
        }
        const response = await axios.put<StripeSettingsResponse>(
          "/admin/stripe-settings",
          body,
          { headers: AUTH_HEADERS() }
        );
        if (response.data.success && response.data.data) {
          setSettings(response.data.data);
          setSuccess(response.data.message || "Settings updated successfully");
        } else {
          setError(response.data.message || "Failed to update settings");
          throw new Error(response.data.message);
        }
      } catch (err: any) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to update Stripe settings";
        setError(msg);
        throw new Error(msg);
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const testConnection = useCallback(async () => {
    setTestLoading(true);
    setError(null);
    try {
      const response = await axios.post<{
        success: boolean;
        message: string;
        data?: { connected?: boolean };
      }>("/admin/stripe-settings/test", {}, { headers: AUTH_HEADERS() });
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || "Connection test successful",
        };
      }
      const msg = response.data.message || "Connection test failed";
      setError(msg);
      return { success: false, message: msg };
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Connection test failed";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setTestLoading(false);
    }
  }, []);

  return {
    settings,
    loading,
    saving,
    testLoading,
    error,
    success,
    fetchSettings,
    updateSettings,
    testConnection,
    clearError,
  };
};
