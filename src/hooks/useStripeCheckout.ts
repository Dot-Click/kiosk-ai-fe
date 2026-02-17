import { useState, useCallback } from "react";
import { axios } from "@/config/axios";

export interface StripeConfig {
  publishableKey: string;
  currency: string;
  isActive: boolean;
}

interface StripeConfigResponse {
  success: boolean;
  message: string;
  data?: StripeConfig;
}



export function useStripeCheckout() {
  const [config, setConfig] = useState<StripeConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  const fetchStripeConfig = useCallback(async () => {
    setConfigLoading(true);
    setConfigError(null);
    try {
      const res = await axios.get<StripeConfigResponse>("/payment/config");
      if (res.data.success && res.data.data) {
        setConfig(res.data.data);
        return res.data.data;
      }
      setConfigError(res.data.message || "Stripe not configured");
      return null;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? err.message ?? "Failed to load payment config";
      setConfigError(msg);
      return null;
    } finally {
      setConfigLoading(false);
    }
  }, []);

  const createCheckoutSession = useCallback(
    async (data: {
      items: any[],
      customer: any,
      fulfillment: any
    }) => {
      const res = await axios.post<{
        success: boolean;
        message: string;
        data?: { url: string; sessionId: string };
      }>("/payment/create-session", data);

      if (res.data.success && res.data.data?.url) {
        return res.data.data.url;
      }
      throw new Error(res.data.message || "Failed to create checkout session");
    },
    []
  );

  const verifySession = useCallback(async (sessionId: string) => {
    const res = await axios.post("/payment/verify-session", { sessionId });
    return res.data;
  }, []);

  return {
    config,
    configLoading,
    configError,
    fetchStripeConfig,
    createCheckoutSession,
    verifySession,
  };
}
