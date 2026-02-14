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

interface CreatePaymentIntentResponse {
  success: boolean;
  message: string;
  data?: { clientSecret: string };
}

export function useStripeCheckout() {
  const [config, setConfig] = useState<StripeConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  const fetchStripeConfig = useCallback(async () => {
    setConfigLoading(true);
    setConfigError(null);
    try {
      const res = await axios.get<StripeConfigResponse>("/stripe-config");
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

  const createPaymentIntent = useCallback(
    async (amountInCents: number, metadata?: Record<string, string>) => {
      const res = await axios.post<CreatePaymentIntentResponse>(
        "/payment/create-payment-intent",
        { amountInCents, metadata }
      );
      if (res.data.success && res.data.data?.clientSecret) {
        return res.data.data.clientSecret;
      }
      throw new Error(res.data.message || "Failed to create payment");
    },
    []
  );

  return {
    config,
    configLoading,
    configError,
    fetchStripeConfig,
    createPaymentIntent,
  };
}
