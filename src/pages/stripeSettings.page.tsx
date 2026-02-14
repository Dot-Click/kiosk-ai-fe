import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  useStripeSettings,
  isMaskedSecret,
  type StripeSettings,
  type UpdateStripeSettingsPayload,
} from "@/hooks/useStripeSettings";
import {
  CreditCard,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

const CURRENCY_OPTIONS = [
  { value: "usd", label: "USD - US Dollar" },
  { value: "eur", label: "EUR - Euro" },
  { value: "gbp", label: "GBP - British Pound" },
  { value: "cad", label: "CAD - Canadian Dollar" },
  { value: "aud", label: "AUD - Australian Dollar" },
] as const;

function getInitialFormData(settings: StripeSettings | null) {
  if (!settings) {
    return {
      publishableKey: "",
      secretKey: "",
      webhookSecret: "",
      isActive: false,
      currency: "usd",
    };
  }
  return {
    publishableKey: settings.publishableKey || "",
    secretKey: isMaskedSecret(settings.secretKey) ? "" : settings.secretKey,
    webhookSecret: settings.webhookSecret || "",
    isActive: settings.isActive ?? false,
    currency: settings.currency || "usd",
  };
}

const StripeSettingsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const {
    settings,
    fetchLoading,
    updateLoading,
    testLoading,
    error,
    fetchSettings,
    updateSettings,
    testConnection,
    clearError,
  } = useStripeSettings();

  const [formData, setFormData] = useState(getInitialFormData(null));
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchSettings();
  }, [isAuthenticated, navigate, fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData(getInitialFormData(settings));
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setTestResult(null);
    const payload: UpdateStripeSettingsPayload = {
      publishableKey: formData.publishableKey.trim(),
      webhookSecret: formData.webhookSecret.trim(),
      isActive: formData.isActive,
      currency: formData.currency,
    };
    if (formData.secretKey && !isMaskedSecret(formData.secretKey)) {
      payload.secretKey = formData.secretKey.trim();
    }
    try {
      await updateSettings(payload);
      setSuccessMessage("Stripe settings updated successfully.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch {
      // error set in hook
    }
  };

  const handleTestConnection = async () => {
    setTestResult(null);
    const result = await testConnection();
    setTestResult(result);
  };

  if (!isAuthenticated) return null;

  if (fetchLoading && !settings) {
    return (
      <Box className="min-h-screen w-full bg-[#080319] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </Box>
    );
  }

  const hasExistingSecret = settings && isMaskedSecret(settings.secretKey);
  const secretPlaceholder = hasExistingSecret
    ? "Leave blank to keep current secret key"
    : "sk_test_...";

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-no-repeat p-4 md:p-8">
      <Box className="max-w-4xl mx-auto">
        <Flex className="items-center justify-between mb-8">
          <Flex className="items-center gap-4">
            <Box
              onClick={() => navigate("/admin/dashboard")}
              className="p-2 rounded-lg bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] cursor-pointer transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Box>
            <Box>
              <h1 className="text-3xl font-bold text-white mb-2">
                Stripe Payment Settings
              </h1>
              <p className="text-white/60">
                Configure your Stripe payment gateway
              </p>
            </Box>
          </Flex>
        </Flex>

        {successMessage && (
          <Box className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50">
            <Flex className="items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <p className="text-green-400">{successMessage}</p>
            </Flex>
          </Box>
        )}

        {error && (
          <Box className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
            <Flex className="items-center justify-between gap-2">
              <Flex className="items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-red-400">{error}</p>
              </Flex>
              <button
                type="button"
                onClick={clearError}
                className="text-red-300 hover:text-red-200 text-sm underline"
              >
                Dismiss
              </button>
            </Flex>
          </Box>
        )}

        {testResult && (
          <Box
            className={`mb-6 p-4 rounded-lg border ${
              testResult.success
                ? "bg-green-500/20 border-green-500/50"
                : "bg-red-500/20 border-red-500/50"
            }`}
          >
            <Flex className="items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <p
                className={
                  testResult.success ? "text-green-400" : "text-red-400"
                }
              >
                {testResult.message}
              </p>
            </Flex>
          </Box>
        )}

        <Box className="bg-[#16121E] border border-white/10 rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Box>
              <label className="text-white/80 text-sm font-medium mb-2 block">
                Publishable Key <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.publishableKey}
                onChange={(e) =>
                  setFormData({ ...formData, publishableKey: e.target.value })
                }
                placeholder="pk_test_..."
                required
                className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
              />
              <p className="text-white/50 text-xs mt-1">
                Your Stripe publishable key (starts with pk_)
              </p>
            </Box>

            <Box>
              <label className="text-white/80 text-sm font-medium mb-2 block">
                Secret Key {hasExistingSecret ? "(optional)" : <span className="text-red-400">*</span>}
              </label>
              <Box className="relative">
                <input
                  type={showSecretKey ? "text" : "password"}
                  value={formData.secretKey}
                  onChange={(e) =>
                    setFormData({ ...formData, secretKey: e.target.value })
                  }
                  placeholder={secretPlaceholder}
                  required={!hasExistingSecret}
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                />
                <Box
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/40 hover:text-white/60"
                >
                  {showSecretKey ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Box>
              </Box>
              <p className="text-white/50 text-xs mt-1">
                {hasExistingSecret
                  ? "Leave blank to keep your current secret key."
                  : "Your Stripe secret key (starts with sk_) — keep this secure."}
              </p>
            </Box>

            <Box>
              <label className="text-white/80 text-sm font-medium mb-2 block">
                Webhook Secret (optional)
              </label>
              <Box className="relative">
                <input
                  type={showWebhookSecret ? "text" : "password"}
                  value={formData.webhookSecret}
                  onChange={(e) =>
                    setFormData({ ...formData, webhookSecret: e.target.value })
                  }
                  placeholder="whsec_..."
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                />
                <Box
                  onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/40 hover:text-white/60"
                >
                  {showWebhookSecret ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Box>
              </Box>
              <p className="text-white/50 text-xs mt-1">
                Webhook signing secret for verifying Stripe webhooks
              </p>
            </Box>

            <Box>
              <label className="text-white/80 text-sm font-medium mb-2 block">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white focus:outline-none focus:border-[#4A0E64] transition-all"
              >
                {CURRENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Box>

            <Flex className="items-center justify-between p-4 rounded-lg bg-[#211C2C] border border-white/10">
              <Box>
                <label className="text-white font-medium">
                  Enable Stripe Payments
                </label>
                <p className="text-white/50 text-sm">
                  Activate Stripe payment processing
                </p>
              </Box>
              <button
                type="button"
                role="switch"
                aria-checked={formData.isActive}
                onClick={() =>
                  setFormData({ ...formData, isActive: !formData.isActive })
                }
                className={`relative w-14 h-8 rounded-full cursor-pointer transition-colors ${
                  formData.isActive ? "bg-[#4A0E64]" : "bg-white/20"
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                    formData.isActive ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </Flex>

            <Flex className="items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={updateLoading}
                className="flex-1 h-12 px-6 rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all text-white font-semibold flex items-center justify-center gap-2"
              >
                {updateLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : null}
                {updateLoading ? "Saving..." : "Save Settings"}
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testLoading}
                className="h-12 px-6 flex items-center justify-center gap-2 rounded-lg border border-white/20 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#1B5E20] hover:bg-[#2E7D32]"
              >
                {testLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                Test Connection
              </button>
            </Flex>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default StripeSettingsPage;
