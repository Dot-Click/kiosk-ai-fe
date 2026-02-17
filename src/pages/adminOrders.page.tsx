import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
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

  const debouncedFetch = useCallback(() => {
    fetchOrders({ status: statusFilter, search: searchTerm || undefined });
  }, [statusFilter, searchTerm, fetchOrders]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const debounceTimer = setTimeout(() => {
      debouncedFetch();
    }, searchTerm ? 500 : 0);
    return () => clearTimeout(debounceTimer);
  }, [navigate, isAuthenticated, debouncedFetch, searchTerm]);

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
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#080319] flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-center bg-no-repeat bg-fixed p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="h-[40px] w-[40px] flex items-center justify-center rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
            <p className="text-white/60">View and manage all customer orders (amounts in €)</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-[#16121E] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order number, customer name, or email..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4A0E64] transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-lg bg-[#211C2C] border border-white/10 text-white focus:outline-none focus:border-[#4A0E64] transition-all appearance-none cursor-pointer min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#16121E] border border-white/10 rounded-2xl overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-white/60 text-lg">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Order #</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Customer</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Items</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Amount (€)</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Fulfillment</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Status</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Date</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/admin/orders/${order.orderNumber}`)}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">#{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{order.customer.name}</span>
                          <span className="text-white/40 text-xs">{order.customer.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/80">
                        {order.items?.length || 0} item{(order.items?.length !== 1) ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 text-white font-mono font-semibold">
                        {formatCurrency(order.payment.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold border ${order.fulfillment.method === 'express' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-orange-500/20 text-orange-400 border-orange-500/50'}`}>
                          {order.fulfillment.method}
                        </span>
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
                      <td className="px-6 py-4 text-white/60 text-sm">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/orders/${order.orderNumber}`);
                            }}
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {orders.length > 0 && (
          <div className="mt-6 bg-[#16121E] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <p className="text-white/60">
                Showing <span className="text-white font-semibold">{orders.length}</span> order
                {orders.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2 text-white/60">
                <Download className="w-4 h-4" />
                <span className="text-sm cursor-pointer hover:text-white transition-colors">
                  Export CSV
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
