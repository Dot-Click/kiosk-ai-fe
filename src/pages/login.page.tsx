import { useState, useEffect } from "react";
import CustomButton from "@/components/common/customButton";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Lock, Mail, ShieldCheck } from "lucide-react";

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
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] p-8 rounded-3xl border border-white/10 bg-[#16121E]/80 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#4A0E64] flex items-center justify-center border border-white/20 shadow-lg shadow-[#4A0E64]/20 mb-2">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Login</h1>
            <p className="text-white/60 text-sm max-w-[250px]">
              Secure access to your kiosk management dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="w-full space-y-5">
            {/* Email Input */}
            <div>
              <label className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2 block ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#4A0E64] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kiosk.ai"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#211C2C] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#4A0E64] focus:ring-4 focus:ring-[#4A0E64]/10 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2 block ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#4A0E64] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#211C2C] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#4A0E64] focus:ring-4 focus:ring-[#4A0E64]/10 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <CustomButton
                title={loading ? "Authenticating..." : "Sign In"}
                wrapperClassName="w-full h-[54px]"
                className="w-full text-lg font-bold"
                onClick={handleLogin}
                disabled={loading || !email || !password}
              />
            </div>
          </form>

          <p className="text-white/30 text-xs font-medium text-center">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
