import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box } from "@/components/ui/box";
import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { ArrowLeft,  User, Mail, Lock, Globe } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import CustomButton from "@/components/common/customButton";
import { axios } from "@/config/axios";

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const {  isAuthenticated, user } = useAdminAuth();
  const [loading,  ] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

    // Load user data
    if (user) {
      setSettings({
        ...settings,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
      });
    }
  }, [navigate, isAuthenticated, user]);

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        "/admin/settings/profile",
        {
          firstName: settings.firstName,
          lastName: settings.lastName,
          email: settings.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (settings.newPassword !== settings.confirmPassword) {
      setError("New passwords do not match");
      setSaving(false);
      return;
    }

    if (settings.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        "/admin/settings/password",
        {
          currentPassword: settings.currentPassword,
          newPassword: settings.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Password changed successfully!");
        setSettings((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        "/admin/settings/site",
        {
          siteName: settings.siteName,
          siteUrl: settings.siteUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Site settings updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update site settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box className="min-h-screen w-full bg-[#080319] flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-center bg-no-repeat p-4 md:p-8">
      <Box className="max-w-4xl mx-auto">
        {/* Header */}
        <Flex className="items-center gap-4 mb-8">
          <Box
            onClick={() => navigate("/admin/dashboard")}
            className="h-[40px] w-[40px] flex items-center justify-center rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Box>
          <Box>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Settings</h1>
            <p className="text-white/60">Manage your account and site settings</p>
          </Box>
        </Flex>

        {/* Success/Error Messages */}
        {success && (
          <Box className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50">
            <p className="text-green-400 text-sm">{success}</p>
          </Box>
        )}
        {error && (
          <Box className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
            <p className="text-red-400 text-sm">{error}</p>
          </Box>
        )}

        {/* Profile Settings */}
        <Box className="bg-[#16121E] border border-white/10 rounded-2xl p-6 mb-6">
          <Flex className="items-center gap-3 mb-6">
            <User className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          </Flex>
          <form onSubmit={handleSaveProfile}>
            <Stack className="gap-4">
              <Flex className="gap-4">
                <Box className="flex-1">
                  <label className="text-white/80 text-sm mb-2 block">First Name</label>
                  <input
                    type="text"
                    value={settings.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                    placeholder="First Name"
                  />
                </Box>
                <Box className="flex-1">
                  <label className="text-white/80 text-sm mb-2 block">Last Name</label>
                  <input
                    type="text"
                    value={settings.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                    placeholder="Last Name"
                  />
                </Box>
              </Flex>
              <Box>
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
              </Box>
              <CustomButton
                title={saving ? "Saving..." : "Save Profile"}
                wrapperClassName="w-full h-[48px] mt-4"
                className="w-full"
                type="submit"
                disabled={saving}
              />
            </Stack>
          </form>
        </Box>

        {/* Password Settings */}
        <Box className="bg-[#16121E] border border-white/10 rounded-2xl p-6 mb-6">
          <Flex className="items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">Change Password</h2>
          </Flex>
          <form onSubmit={handleChangePassword}>
            <Stack className="gap-4">
              <Box>
                <label className="text-white/80 text-sm mb-2 block">Current Password</label>
                <input
                  type="password"
                  value={settings.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                  placeholder="Enter current password"
                />
              </Box>
              <Flex className="gap-4">
                <Box className="flex-1">
                  <label className="text-white/80 text-sm mb-2 block">New Password</label>
                  <input
                    type="password"
                    value={settings.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                    placeholder="Enter new password"
                  />
                </Box>
                <Box className="flex-1">
                  <label className="text-white/80 text-sm mb-2 block">Confirm Password</label>
                  <input
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                    placeholder="Confirm new password"
                  />
                </Box>
              </Flex>
              <CustomButton
                title={saving ? "Changing..." : "Change Password"}
                wrapperClassName="w-full h-[48px] mt-4"
                className="w-full"
                type="submit"
                disabled={saving}
              />
            </Stack>
          </form>
        </Box>

        {/* Site Settings */}
        <Box className="bg-[#16121E] border border-white/10 rounded-2xl p-6">
          <Flex className="items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">Site Settings</h2>
          </Flex>
          <form onSubmit={handleSaveSiteSettings}>
            <Stack className="gap-4">
              <Box>
                <label className="text-white/80 text-sm mb-2 block">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                  placeholder="My Kiosk Store"
                />
              </Box>
              <Box>
                <label className="text-white/80 text-sm mb-2 block">Site URL</label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => handleInputChange("siteUrl", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                  placeholder="https://example.com"
                />
              </Box>
              <CustomButton
                title={saving ? "Saving..." : "Save Site Settings"}
                wrapperClassName="w-full h-[48px] mt-4"
                className="w-full"
                type="submit"
                disabled={saving}
              />
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSettingsPage;
