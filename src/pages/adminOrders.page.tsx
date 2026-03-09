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
    pagination,
    exportOrdersToCSV,
    exportOrdersToPDF,
  } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedFetch = useCallback(() => {
    fetchOrders({
      status: statusFilter,
      search: searchTerm || undefined,
      page: currentPage,
      limit: limit
    });
  }, [statusFilter, searchTerm, fetchOrders, currentPage, limit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
      case "shipped":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
      case "delivered":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
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
      return new Date(dateString).toLocaleDateString("en-IN", {
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

  // We only show the full-page loader on first mount or when there's no data yet
  const showInitialLoader = loading && orders.length === 0;

  if (showInitialLoader) {
    return (
      <div className="min-h-screen w-full bg-[#080319] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#4A0E64] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-xl">Loading Orders...</p>
        </div>
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
            <p className="text-white/60">View and manage all customer orders (amounts in ₹)</p>
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
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className={`bg-[#16121E] border border-white/10 rounded-2xl overflow-hidden relative transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
          {/* Subtle loading overlay */}
          {loading && orders.length > 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {orders.length === 0 && !loading ? (
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
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Amount (₹)</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Fulfillment</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Status</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold text-sm">Date</th>
                    <th className="px-6 py-4 text-right text-white/80 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/admin/orders/${order.orderNumber}`)}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">#{order?.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{order?.customer?.name || 'Unknown'}</span>
                          <span className="text-white/40 text-xs">{order?.customer?.email || 'No email'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/80">
                        {(() => {
                          const totalQty = order?.items?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;
                          const lineItems = order?.items?.length || 0;
                          if (lineItems === 1 && totalQty > 1) {
                            return `${totalQty} items (${lineItems} type)`;
                          }
                          return `${totalQty} item${totalQty !== 1 ? 's' : ''}`;
                        })()}
                      </td>
                      <td className="px-6 py-4 text-white font-mono font-semibold">
                        {formatCurrency(order?.payment?.amount || 0)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold border ${order?.fulfillment?.method === 'express' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-orange-500/20 text-orange-400 border-orange-500/50'}`}>
                          {order?.fulfillment?.method || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order?.status || 'pending'
                          )}`}
                        >
                          {(order?.status || 'pending').charAt(0).toUpperCase() + (order?.status || 'pending').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm">{formatDate(order?.createdAt || '')}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
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

        {/* Summary & Pagination */}
        <div className="mt-6 bg-[#16121E] border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-white/60">
                Total Orders: <span className="text-white font-semibold">{pagination.total}</span>
              </p>
              <p className="text-white/40 text-xs">
                Showing <span className="text-white/60 font-medium">{orders.length}</span> orders on this page
              </p>
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-[#211C2C] border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2A2438] transition-all text-sm font-medium"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1 mx-2">
                  {pagination.pages > 0 && pagination.pages < 1000 && Number.isInteger(pagination.pages) && [...Array(pagination.pages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Optimization: Only show pages near current or edges if too many
                    if (pagination.pages > 7) {
                      const isNear = Math.abs(pageNum - currentPage) <= 1;
                      const isEdge = pageNum === 1 || pageNum === pagination.pages;
                      if (!isNear && !isEdge) {
                        if (pageNum === 2 || pageNum === pagination.pages - 1) return <span key={pageNum} className="text-white/20 text-xs px-1">...</span>;
                        return null;
                      }
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${currentPage === pageNum
                          ? "bg-[#4A0E64] text-white border border-white/20"
                          : "bg-white/5 text-white/40 hover:bg-white/10"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                  disabled={currentPage === pagination.pages}
                  className="px-4 py-2 rounded-lg bg-[#211C2C] border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2A2438] transition-all text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs font-medium">Show:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when limit changes
                  }}
                  className="bg-[#211C2C] border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="h-4 w-[1px] bg-white/10"></div>

              <div
                onClick={() => exportOrdersToCSV({ status: statusFilter, search: searchTerm })}
                className={`flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">
                  {loading ? '...' : 'CSV'}
                </span>
              </div>

              <div className="h-4 w-[1px] bg-white/10"></div>

              <div
                onClick={() => exportOrdersToPDF({ status: statusFilter, search: searchTerm })}
                className={`flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">
                  {loading ? '...' : 'PDF'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
