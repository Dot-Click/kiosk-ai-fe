import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box } from "@/components/ui/box";
// import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useStripeSettings } from "@/hooks/useStripeSettings";
// import CustomButton from "@/components/common/customButton";
import {
  CreditCard,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

const StripeSettingsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated,   } = useAdminAuth();
  const {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    testConnection,
  } = useStripeSettings();

  const [formData, setFormData] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: "",
    isActive: false,
    currency: "usd",
  });

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
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
      setFormData({
        publishableKey: settings.publishableKey || "",
        secretKey: settings.secretKey || "",
        webhookSecret: settings.webhookSecret || "",
        isActive: settings.isActive || false,
        currency: settings.currency || "usd",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSuccessMessage("");

    try {
      await updateSettings(formData);
      setSuccessMessage("Stripe settings updated successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      // Error is handled by hook
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestLoading(true);
    setTestResult(null);

    try {
      const result = await testConnection();
      setTestResult(result);
    } catch (err) {
      setTestResult({
        success: false,
        message: "Connection test failed",
      });
    } finally {
      setTestLoading(false);
    }
  };

  if (loading && !settings) {
    return (
      <Box className="min-h-screen w-full bg-[#080319] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-no-repeat p-4 md:p-8">
      <Box className="max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Success Message */}
        {successMessage && (
          <Box className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50">
            <Flex className="items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400">{successMessage}</p>
            </Flex>
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Box className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
            <Flex className="items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </Flex>
          </Box>
        )}

        {/* Test Result */}
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
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
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

        {/* Settings Form */}
        <Box className="bg-[#16121E] border border-white/10 rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Publishable Key */}
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

            {/* Secret Key */}
            <Box>
              <label className="text-white/80 text-sm font-medium mb-2 block">
                Secret Key <span className="text-red-400">*</span>
              </label>
              <Box className="relative">
                <input
                  type={showSecretKey ? "text" : "password"}
                  value={formData.secretKey}
                  onChange={(e) =>
                    setFormData({ ...formData, secretKey: e.target.value })
                  }
                  placeholder="sk_test_..."
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                />
                <Box
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showSecretKey ? (
                    <EyeOff className="w-5 h-5 text-white/40" />
                  ) : (
                    <Eye className="w-5 h-5 text-white/40" />
                  )}
                </Box>
              </Box>
              <p className="text-white/50 text-xs mt-1">
                Your Stripe secret key (starts with sk_) - Keep this secure!
              </p>
            </Box>

            {/* Webhook Secret */}
            <Box>
              <label className="text-white/80 text-sm font-medium mb-2 block">
                Webhook Secret (Optional)
              </label>
              <Box className="relative">
                <input
                  type={showWebhookSecret ? "text" : "password"}
                  value={formData.webhookSecret}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      webhookSecret: e.target.value,
                    })
                  }
                  placeholder="whsec_..."
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                />
                <Box
                  onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showWebhookSecret ? (
                    <EyeOff className="w-5 h-5 text-white/40" />
                  ) : (
                    <Eye className="w-5 h-5 text-white/40" />
                  )}
                </Box>
              </Box>
              <p className="text-white/50 text-xs mt-1">
                Webhook signing secret for verifying Stripe webhooks
              </p>
            </Box>

            {/* Currency */}
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
                <option value="usd">USD - US Dollar</option>
                <option value="eur">EUR - Euro</option>
                <option value="gbp">GBP - British Pound</option>
                <option value="cad">CAD - Canadian Dollar</option>
                <option value="aud">AUD - Australian Dollar</option>
              </select>
            </Box>

            {/* Active Toggle */}
            <Flex className="items-center justify-between p-4 rounded-lg bg-[#211C2C] border border-white/10">
              <Box>
                <label className="text-white font-medium">
                  Enable Stripe Payments
                </label>
                <p className="text-white/50 text-sm">
                  Activate Stripe payment processing
                </p>
              </Box>
              <Box
                onClick={() =>
                  setFormData({ ...formData, isActive: !formData.isActive })
                }
                className={`w-14 h-8 rounded-full cursor-pointer transition-all ${
                  formData.isActive ? "bg-[#4A0E64]" : "bg-white/20"
                }`}
              >
                <Box
                  className={`w-6 h-6 rounded-full bg-white transition-all mt-1 ${
                    formData.isActive ? "ml-7" : "ml-1"
                  }`}
                />
              </Box>
            </Flex>

            {/* Action Buttons */}
            <Flex className="items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saveLoading}
                className="flex-1 h-[48px] px-6 rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all text-white font-semibold flex items-center justify-center"
              >
                {saveLoading ? "Saving..." : "Save Settings"}
              </button>
              <Box
                onClick={handleTestConnection}
                className={`h-[48px] px-6 flex items-center justify-center gap-2 rounded-lg border transition-all ${
                  testLoading
                    ? "bg-[#211C2C] border-white/10 cursor-not-allowed"
                    : "bg-[#1B5E20] border-white/20 hover:bg-[#2E7D32] cursor-pointer"
                } text-white font-semibold`}
              >
                {testLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                Test Connection
              </Box>
            </Flex>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default StripeSettingsPage;
