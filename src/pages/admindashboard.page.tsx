import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ShoppingCart,
  IndianRupee,
  Settings,
  Package,
  LogOut,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { axios } from "@/config/axios";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useCurrency } from "@/context/CurrencyContext";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAdminAuth();
  const { symbol } = useCurrency();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if admin is logged in
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, [navigate, isAuthenticated]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("/admin/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError("Failed to load statistics.");
      }
    } catch (err: any) {
      console.error("Failed to fetch dashboard stats:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = "bg-[#4A0E64]",
  }: {
    title: string;
    value: number | string;
    icon: any;
    color?: string;
  }) => (
    <div
      className={`${color} p-6 rounded-2xl border border-white/10 shadow-lg hover:scale-105 transition-transform duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/10 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-white/60 text-sm font-medium mb-1">{title}</h3>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#080319] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#4A0E64] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#080319] flex items-center justify-center p-4">
        <div className="bg-[#16121E] p-8 rounded-2xl border border-red-500/30 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="px-6 py-2 bg-[#4A0E64] hover:bg-[#5A1E74] text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-center bg-no-repeat bg-fixed p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/60">Welcome back! Here's your overview.</p>
          </div>
          <button
            onClick={logout}
            className="h-[40px] px-6 flex items-center justify-center gap-2 rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer transition-all text-white font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="bg-[#4A0E64]"
          />
          <StatCard
            title="Total Revenue"
            value={`${symbol}${(Number(stats?.totalRevenue) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={IndianRupee}
            color="bg-[#1B5E20]"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={Package}
            color="bg-[#E65100]"
          />
          <StatCard
            title="Completed Orders"
            value={stats.completedOrders}
            icon={TrendingUp}
            color="bg-[#0277BD]"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-[#16121E]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A0E64]/5 blur-[100px] rounded-full -mr-16 -mt-16" />
          
          <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
             <div className="w-2 h-8 bg-gradient-to-b from-[#4A0E64] to-transparent rounded-full" />
             Management Center
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <ActionButton
              title="Orders History"
              subtitle="View and process all customer orders"
              icon={ShoppingCart}
              onClick={() => navigate("/admin/orders")}
              accentColor="from-purple-500/20 to-transparent"
              iconBg="bg-purple-500/10 text-purple-400"
            />
            <ActionButton
              title="Product Catalog"
              subtitle="Manage inventory, pricing and items"
              icon={Package}
              onClick={() => navigate("/admin/products")}
              accentColor="from-blue-500/20 to-transparent"
              iconBg="bg-blue-500/10 text-blue-400"
            />
            <ActionButton
              title="Stripe Gateway"
              subtitle="Configure keys and payment settings"
              icon={IndianRupee}
              onClick={() => navigate("/admin/stripe-settings")}
              accentColor="from-emerald-500/20 to-transparent"
              iconBg="bg-emerald-500/10 text-emerald-400"
            />
            <ActionButton
              title="System Settings"
              subtitle="Admin profile and site configuration"
              icon={Settings}
              onClick={() => navigate("/admin/settings")}
              accentColor="from-slate-500/20 to-transparent"
              iconBg="bg-slate-500/10 text-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({
  title,
  subtitle,
  icon: Icon,
  onClick,
  accentColor,
  iconBg,
}: {
  title: string;
  subtitle: string;
  icon: any;
  onClick: () => void;
  accentColor: string;
  iconBg: string;
}) => (
  <div
    onClick={onClick}
    className="group relative bg-[#211C2C]/50 border border-white/5 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-white/10 hover:bg-[#2A2438] overflow-hidden shadow-xl"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    
    <div className="relative z-10 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-xl ${iconBg} border border-white/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="w-7 h-7" />
      </div>
      
      <div className="flex-1">
        <h4 className="text-lg font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all">
          {title}
        </h4>
        <p className="text-white/40 text-xs font-medium mt-1">{subtitle}</p>
      </div>

      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
        <div className="w-2 h-2 border-t border-r border-white rotate-45" />
      </div>
    </div>
  </div>
);

export default AdminDashboardPage;
