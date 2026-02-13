import { useState, useCallback } from "react";
import { axios } from "@/config/axios";

interface StripeSettings {
  id: string;
  publishableKey: string;
  secretKey: string; // This will be masked
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

interface UseStripeSettingsReturn {
  settings: StripeSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<StripeSettings> & { secretKey: string }) => Promise<void>;
  testConnection: () => Promise<{ success: boolean; message: string }>;
}

export const useStripeSettings = (): UseStripeSettingsReturn => {
  const [settings, setSettings] = useState<StripeSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("adminToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<StripeSettingsResponse>(
        "/admin/stripe-settings",
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data.success && response.data.data) {
        setSettings(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch settings");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch Stripe settings";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const updateSettings = useCallback(
    async (newSettings: Partial<StripeSettings> & { secretKey: string }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.put<StripeSettingsResponse>(
          "/admin/stripe-settings",
          newSettings,
          {
            headers: getAuthHeaders(),
          }
        );

        if (response.data.success && response.data.data) {
          setSettings(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to update settings");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to update Stripe settings";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeaders]
  );

  const testConnection = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<{
        success: boolean;
        message: string;
        data?: any;
      }>("/admin/stripe-settings/test", {}, {
        headers: getAuthHeaders(),
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || "Connection test successful",
        };
      } else {
        throw new Error(response.data.message || "Connection test failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Connection test failed";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    testConnection,
  };
};
