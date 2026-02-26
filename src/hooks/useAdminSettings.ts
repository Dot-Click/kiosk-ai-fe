import { useState, useCallback } from "react";
import { axios } from "@/config/axios";


interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
}

interface PasswordData {
    currentPassword: string;
    newPassword: string;
}

interface SiteSettingsData {
    siteName: string;
    siteUrl: string;
}

interface UseAdminSettingsReturn {
    saving: boolean;
    error: string | null;
    success: string | null;
    updateProfile: (data: ProfileData) => Promise<boolean>;
    changePassword: (data: PasswordData) => Promise<boolean>;
    updateSiteSettings: (data: SiteSettingsData) => Promise<boolean>;
    clearMessages: () => void;
    setError: (error: string | null) => void;
    setSuccess: (success: string | null) => void;
}

const AUTH_HEADERS = (): { Authorization: string } => {
    const token = localStorage.getItem("adminToken");
    return { Authorization: `Bearer ${token}` };
};

export const useAdminSettings = (): UseAdminSettingsReturn => {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const clearMessages = useCallback(() => {
        setError(null);
        setSuccess(null);
    }, []);

    const setFeedback = (errorMsg: string | null, successMsg: string | null) => {
        setError(errorMsg);
        setSuccess(successMsg);
        if (successMsg) {
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    const updateProfile = useCallback(
        async (data: ProfileData): Promise<boolean> => {
            setSaving(true);
            clearMessages();
            try {
                const response = await axios.put<{ success: boolean; message?: string }>(
                    "/admin/settings/profile",
                    data,
                    { headers: AUTH_HEADERS() }
                );

                if (response.data.success) {
                    setFeedback(null, "Profile updated successfully!");
                    return true;
                } else {
                    setFeedback(response.data.message || "Failed to update profile", null);
                    return false;
                }
            } catch (err: any) {
                setFeedback(err.response?.data?.message || err.message || "Failed to update profile", null);
                return false;
            } finally {
                setSaving(false);
            }
        },
        [clearMessages]
    );

    const changePassword = useCallback(
        async (data: PasswordData): Promise<boolean> => {
            setSaving(true);
            clearMessages();
            try {
                const response = await axios.put<{ success: boolean; message?: string }>(
                    "/admin/settings/password",
                    data,
                    { headers: AUTH_HEADERS() }
                );

                if (response.data.success) {
                    setFeedback(null, "Password changed successfully!");
                    return true;
                } else {
                    setFeedback(response.data.message || "Failed to change password", null);
                    return false;
                }
            } catch (err: any) {
                setFeedback(err.response?.data?.message || err.message || "Failed to change password", null);
                return false;
            } finally {
                setSaving(false);
            }
        },
        [clearMessages]
    );

    const updateSiteSettings = useCallback(
        async (data: SiteSettingsData): Promise<boolean> => {
            setSaving(true);
            clearMessages();
            try {
                const response = await axios.put<{ success: boolean; message?: string }>(
                    "/admin/settings/site",
                    data,
                    { headers: AUTH_HEADERS() }
                );

                if (response.data.success) {
                    setFeedback(null, "Site settings updated successfully!");
                    return true;
                } else {
                    setFeedback(response.data.message || "Failed to update site settings", null);
                    return false;
                }
            } catch (err: any) {
                setFeedback(err.response?.data?.message || err.message || "Failed to update site settings", null);
                return false;
            } finally {
                setSaving(false);
            }
        },
        [clearMessages]
    );

    return {
        saving,
        error,
        success,
        updateProfile,
        changePassword,
        updateSiteSettings,
        clearMessages,
        setError,
        setSuccess,
    };
};
