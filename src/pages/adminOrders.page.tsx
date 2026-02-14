import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box } from "@/components/ui/box";
import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { ArrowLeft, Search, Filter, Eye, Download } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminOrders } from "@/hooks/useAdminOrders";

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const {
    orders,
    loading,
    error,
    fetchOrders,
    formatCurrency,
  } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const debounceTimer = setTimeout(() => {
      fetchOrders({ status: statusFilter, search: searchTerm || undefined });
    }, searchTerm ? 500 : 0);
    return () => clearTimeout(debounceTimer);
  }, [navigate, isAuthenticated, statusFilter, searchTerm, fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-EU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) return null;

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
        <Flex className="items-center gap-4 mb-8">
          <Box
            onClick={() => navigate("/admin/dashboard")}
            className="h-[40px] w-[40px] flex items-center justify-center rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Box>
          <Box className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
            <p className="text-white/60">View and manage all customer orders (amounts in €)</p>
          </Box>
        </Flex>

        {/* Error */}
        {error && (
          <Box className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-300 text-sm">{error}</p>
          </Box>
        )}

        {/* Filters */}
        <Box className="bg-[#16121E] border border-white/10 rounded-2xl p-6 mb-6">
          <Flex className="gap-4 flex-col md:flex-row">
            <Box className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order number, customer name, or email..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
              />
            </Box>
            <Box className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white focus:outline-none focus:border-[#4A0E64] transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </Box>
          </Flex>
        </Box>

        {/* Orders Table */}
        <Box className="bg-[#16121E] border border-white/10 rounded-2xl overflow-hidden">
          {orders.length === 0 ? (
            <Box className="p-12 text-center">
              <p className="text-white/60 text-lg">No orders found</p>
            </Box>
          ) : (
            <Box className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Order #</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Customer</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Items</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Amount (€)</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Status</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Date</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">#{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <Stack className="gap-1">
                          <p className="text-white font-medium">{order.customerName}</p>
                          <p className="text-white/60 text-sm">{order.customerEmail}</p>
                        </Stack>
                      </td>
                      <td className="px-6 py-4 text-white/80">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Flex className="gap-2">
                          <Box
                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-white" />
                          </Box>
                        </Flex>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </Box>

        {/* Summary */}
        {orders.length > 0 && (
          <Box className="mt-6 bg-[#16121E] border border-white/10 rounded-2xl p-6">
            <Flex className="items-center justify-between">
              <p className="text-white/60">
                Showing <span className="text-white font-semibold">{orders.length}</span> order
                {orders.length !== 1 ? "s" : ""}
              </p>
              <Box className="flex items-center gap-2 text-white/60">
                <Download className="w-4 h-4" />
                <span className="text-sm cursor-pointer hover:text-white transition-colors">
                  Export CSV
                </span>
              </Box>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminOrdersPage;
