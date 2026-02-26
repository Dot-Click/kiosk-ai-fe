import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Mail, Lock, Globe } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import CustomButton from "@/components/common/customButton";
import { useAdminSettings } from "@/hooks/useAdminSettings";

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAdminAuth();
  const {
    saving,
    error,
    success,
    updateProfile,
    changePassword,
    updateSiteSettings,
    clearMessages,
    setError,
  } = useAdminSettings();

  const [settings, setSettings] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    siteName: "",
    siteUrl: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setSettings((prev) => ({
        ...prev,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
      }));
    }
  }, [navigate, isAuthenticated, user]);

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    clearMessages();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      firstName: settings.firstName,
      lastName: settings.lastName,
      email: settings.email,
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Using the previously destructured `setError` from `useAdminSettings()` above.

    if (settings.newPassword !== settings.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (settings.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const isSuccess = await changePassword({
      currentPassword: settings.currentPassword,
      newPassword: settings.newPassword,
    });

    if (isSuccess) {
      setSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings({
      siteName: settings.siteName,
      siteUrl: settings.siteUrl,
    });
  };

  if (!isAuthenticated) return null;

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
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Settings</h1>
            <p className="text-white/60">Manage your account and site settings</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-[#16121E] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          </div>
          <form onSubmit={handleSaveProfile}>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1">
                  <label className="text-white/80 text-sm mb-2 block">First Name</label>
                  <input
                    type="text"
                    value={settings.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                    placeholder="First Name"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-white/80 text-sm mb-2 block">Last Name</label>
                  <input
                    type="text"
                    value={settings.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/80 text-sm mb-2 block flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                  placeholder="admin@example.com"
                />
              </div>
              <CustomButton
                title={saving ? "Saving..." : "Save Profile"}
                wrapperClassName="w-full h-[48px] mt-4"
                className="w-full"
                type="submit"
                disabled={saving}
              />
            </div>
          </form>
        </div>

        {/* Password Settings */}
        <div className="bg-[#16121E] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">Change Password</h2>
          </div>
          <form onSubmit={handleChangePassword}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-white/80 text-sm mb-2 block">Current Password</label>
                <input
                  type="password"
                  value={settings.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                  placeholder="Enter current password"
                />
              </div>
              <div className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1">
                  <label className="text-white/80 text-sm mb-2 block">New Password</label>
                  <input
                    type="password"
                    value={settings.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-white/80 text-sm mb-2 block">Confirm Password</label>
                  <input
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <CustomButton
                title={saving ? "Changing..." : "Change Password"}
                wrapperClassName="w-full h-[48px] mt-4"
                className="w-full"
                type="submit"
                disabled={saving}
              />
            </div>
          </form>
        </div>

        {/* Site Settings */}
        <div className="bg-[#16121E] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">Site Settings</h2>
          </div>
          <form onSubmit={handleSaveSiteSettings}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-white/80 text-sm mb-2 block">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                  placeholder="My Kiosk Store"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm mb-2 block">Site URL</label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => handleInputChange("siteUrl", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                  placeholder="https://example.com"
                />
              </div>
              <CustomButton
                title={saving ? "Saving..." : "Save Site Settings"}
                wrapperClassName="w-full h-[48px] mt-4"
                className="w-full"
                type="submit"
                disabled={saving}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
