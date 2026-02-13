import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { axios } from "@/config/axios";

interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AdminLoginResponse {
  success: boolean;
  message: string;
  data?: {
    jwtToken: string;
    user: AdminUser;
  };
}

interface UseAdminAuthReturn {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEYS = {
  TOKEN: "adminToken",
  USER: "adminUser",
};

export const useAdminAuth = (): UseAdminAuthReturn => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user from localStorage
  const getUserFromStorage = useCallback((): AdminUser | null => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (userStr) {
        return JSON.parse(userStr) as AdminUser;
      }
    } catch (err) {
      console.error("Error parsing user from storage:", err);
    }
    return null;
  }, []);

  const [user, setUser] = useState<AdminUser | null>(getUserFromStorage);

  // Check if authenticated
  const isAuthenticated = useCallback((): boolean => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  }, []);

  // Login function
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post<AdminLoginResponse>("/admin/login", {
          email,
          password,
        });

        if (response.data.success && response.data.data) {
          // Store token and user in localStorage
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.jwtToken);
          localStorage.setItem(
            STORAGE_KEYS.USER,
            JSON.stringify(response.data.data.user)
          );

          // Update state
          setUser(response.data.data.user);

          // Redirect to admin dashboard
          navigate("/admin/dashboard");
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Invalid email or password. Please try again.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return {
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    user,
    loading,
    error,
  };
};
