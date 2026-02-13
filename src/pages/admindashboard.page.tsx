import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box } from "@/components/ui/box";
// import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { 
  ShoppingCart, 
  DollarSign, 
  Settings, 
  Package,
  LogOut,
  TrendingUp
} from "lucide-react";
import { axios } from "@/config/axios";
import { useAdminAuth } from "@/hooks/useAdminAuth";
// import CustomButton from "@/components/common/customButton";

interface DashboardStats {
  totalOrders: number;
  totalPayments: number;
  pendingOrders: number;
  completedOrders: number;
}

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated,} = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalPayments: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

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
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("/admin/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
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
    <Box
      className={`${color} p-6 rounded-2xl border border-white/10 shadow-lg hover:scale-105 transition-transform`}
    >
      <Flex className="items-center justify-between mb-4">
        <Box className="p-3 bg-white/10 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </Box>
      </Flex>
      <h3 className="text-white/60 text-sm font-medium mb-1">{title}</h3>
      <p className="text-white text-3xl font-bold">{value}</p>
    </Box>
  );

  if (loading) {
    return (
      <Box className="min-h-screen w-full bg-[#080319] flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-center bg-no-repeat p-4 md:p-8">
      <Box className="max-w-7xl mx-auto">
        {/* Header */}
        <Flex className="items-center justify-between mb-8">
          <Box>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/60">Welcome back! Here's your overview.</p>
          </Box>
          <Box
            onClick={logout}
            className="h-[40px] px-6 flex items-center justify-center gap-2 rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer transition-all text-white font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Box>
        </Flex>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="bg-[#4A0E64]"
          />
          <StatCard
            title="Total Payments"
            value={`$${stats.totalPayments.toLocaleString()}`}
            icon={DollarSign}
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
        <Box className="bg-[#16121E] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton
              title="View Orders"
              icon={ShoppingCart}
              onClick={() => navigate("/admin/orders")}
            />
            <ActionButton
              title="Stripe Settings"
              icon={DollarSign}
              onClick={() => navigate("/admin/stripe-settings")}
            />
            <ActionButton
              title="Settings"
              icon={Settings}
              onClick={() => navigate("/admin/settings")}
            />
          </div>
        </Box>
      </Box>
    </Box>
  );
};

const ActionButton = ({
  title,
  icon: Icon,
  onClick,
}: {
  title: string;
  icon: any;
  onClick: () => void;
}) => (
  <Box
    onClick={onClick}
    className="p-4 rounded-lg bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] cursor-pointer transition-all flex items-center gap-3"
  >
    <Icon className="w-5 h-5 text-white" />
    <span className="text-white font-medium">{title}</span>
  </Box>
);

export default AdminDashboardPage;
