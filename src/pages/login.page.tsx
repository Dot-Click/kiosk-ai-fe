import { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Stack } from "@/components/ui/stack";
import CustomButton from "@/components/common/customButton";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const { login, isAuthenticated, loading, error: authError } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/admin/dashboard";
    }
  }, [isAuthenticated]);

  // Update error from hook
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await login(email, password);
      // Navigation is handled by the hook
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-no-repeat flex items-center justify-center p-4">
      <Box className="w-full max-w-[450px] p-8 rounded-2xl border border-white/10 bg-[#16121E] shadow-2xl backdrop-blur-sm">
        <Stack className="items-center gap-6">
          {/* Header */}
          <Stack className="items-center gap-2">
            <h1 className="text-3xl font-bold text-white">Admin Login</h1>
            <p className="text-white/60 text-sm">Sign in to access admin dashboard</p>
          </Stack>

          {/* Error Message */}
          {error && (
            <Box className="w-full p-3 rounded-lg bg-red-500/20 border border-red-500/50">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </Box>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="w-full space-y-4">
            {/* Email Input */}
            <Box className="relative">
              <label className="text-white/80 text-sm mb-2 block">Email</label>
              <Box className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                />
              </Box>
            </Box>

            {/* Password Input */}
            <Box className="relative">
              <label className="text-white/80 text-sm mb-2 block">Password</label>
              <Box className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
                />
              </Box>
            </Box>

            {/* Submit Button */}
            <CustomButton
              title={loading ? "Logging in..." : "Login"}
              wrapperClassName="w-full h-[48px] mt-6"
              className="w-full"
              onClick={handleLogin}
              disabled={loading || !email || !password}
            />
          </form>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
