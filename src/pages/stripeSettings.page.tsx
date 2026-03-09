import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  IndianRupee,
  Key,
  Globe,
  Settings,
  Shield,
  CreditCard,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useStripeSettings } from "@/hooks/useStripeSettings";
import CustomButton from "@/components/common/customButton";

const StripeSettingsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const {
    settings,
    loading,
    saving,
    error,
    success,
    fetchSettings,
    updateSettings,
  } = useStripeSettings();

  const [localSettings, setLocalSettings] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: "",
    currency: "INR",
    isActive: true,
  });

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchSettings();
  }, [navigate, isAuthenticated, fetchSettings]);

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        publishableKey: settings.publishableKey || "",
        secretKey: settings.secretKey || "",
        webhookSecret: settings.webhookSecret || "",
        currency: settings.currency || "INR",
        isActive: settings.isActive ?? true,
      });
    }
  }, [settings]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(localSettings);
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#080319] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-[#4A0E64] animate-spin" />
          <p className="text-white text-lg">Loading Stripe settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-center bg-no-repeat bg-fixed p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="h-[40px] w-[40px] flex items-center justify-center rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">Stripe Configuration</h1>
            <p className="text-white/60">Configure your payment gateway settings</p>
          </div>
        </div>

        {/* Status messages */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-400" />
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-3">
            <Shield className="w-5 h-5 text-red-400" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="space-y-6">
            {/* API Keys */}
            <div className="bg-[#16121E] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Key className="w-5 h-5 text-[#4A0E64]" />
                API Credentials
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block font-medium">Publishable Key</label>
                  <input
                    type="text"
                    value={localSettings.publishableKey}
                    onChange={(e) => handleInputChange("publishableKey", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                    placeholder="pk_test_..."
                  />
                  <p className="text-white/40 text-xs mt-1">Found in your Stripe Dashboard under Developers   API keys</p>
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block font-medium">Secret Key</label>
                  <div className="relative">
                    <input
                      type={showSecretKey ? "text" : "password"}
                      value={localSettings.secretKey}
                      onChange={(e) => handleInputChange("secretKey", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                      placeholder="sk_test_..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Webhook */}
            <div className="bg-[#16121E] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#4A0E64]" />
                Webhook Configuration
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block font-medium">Webhook Signing Secret</label>
                  <div className="relative">
                    <input
                      type={showWebhookSecret ? "text" : "password"}
                      value={localSettings.webhookSecret}
                      onChange={(e) => handleInputChange("webhookSecret", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                      placeholder="whsec_..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-white/40 text-xs mt-1">Needed for receiving payment success notifications</p>
                </div>
              </div>
            </div>

            {/* Site & Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#16121E] border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-[#4A0E64]" />
                  Currency
                </h2>
                <div className="relative">
                  <select
                    value={localSettings.currency?.toLowerCase()}
                    onChange={(e) => handleInputChange("currency", e.target.value.toLowerCase())}
                    className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white appearance-none focus:outline-none focus:border-[#4A0E64] cursor-pointer"
                  >
                    <option value="inr">Indian Rupee (₹)</option>
                    <option value="usd">US Dollar</option>
                    <option value="eur">Euro (€)</option>
                    <option value="gbp">British Pound (£)</option>
                    <option value="cad">Canadian Dollar</option>
                    <option value="aud">Australian Dollar</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="bg-[#16121E] border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#4A0E64]" />
                  Status
                </h2>
                <button
                  type="button"
                  onClick={() => handleInputChange("isActive", !localSettings.isActive)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg border transition-all w-full justify-center font-bold ${localSettings.isActive
                    ? "bg-green-500/10 border-green-500/50 text-green-500"
                    : "bg-red-500/10 border-red-500/50 text-red-500"
                    }`}
                >
                  <RefreshCw className={`w-4 h-4 ${localSettings.isActive ? "" : "rotate-45"}`} />
                  {localSettings.isActive ? "Stripe Payment Enabled" : "Stripe Payment Disabled"}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <CustomButton
                title={saving ? "Saving Changes..." : "Save Settings"}
                wrapperClassName="flex-1 h-[56px]"
                className="w-full text-lg"
                type="submit"
                disabled={saving || loading}
                icon={<CreditCard size={20} />}
              />
              <button
                type="button"
                onClick={() => fetchSettings()}
                className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-semibold"
                title="Discard Changes"
              >
                Discard
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StripeSettingsPage;
