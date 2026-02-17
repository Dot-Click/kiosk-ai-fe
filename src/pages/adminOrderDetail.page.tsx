import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Package,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Truck,
  CreditCard,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminOrders } from "@/hooks/useAdminOrders";

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const {
    orderDetail: order,
    loadingDetail: loading,
    updating,
    error,
    fetchOrderDetails,
    updateOrderStatus,
    formatCurrency,
    clearOrderDetail,
  } = useAdminOrders();

  const [localStatus, setLocalStatus] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (id) {
      fetchOrderDetails(id);
    }
    return () => clearOrderDetail();
  }, [id, navigate, isAuthenticated, fetchOrderDetails, clearOrderDetail]);

  useEffect(() => {
    if (order) {
      setLocalStatus(order.status);
    }
  }, [order]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (id) {
      const success = await updateOrderStatus(id, newStatus);
      if (success) {
        setLocalStatus(newStatus);
      }
    }
  };

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
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#080319] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#4A0E64] animate-spin" />
          <p className="text-white text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen w-full bg-[#080319] p-8">
        <button
          onClick={() => navigate("/admin/orders")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
          <p className="text-red-400 text-lg">{error || "Order not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-center bg-no-repeat bg-fixed p-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/orders")}
              className="h-[40px] w-[40px] flex items-center justify-center rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Order #{order.orderNumber}</h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
                <span className="text-white/40 text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-[#16121E]/60 p-3 rounded-xl border border-white/10">
            <p className="text-white/40 text-xs font-bold uppercase tracking-wider w-full mb-1">Update Status</p>
            <button
              onClick={() => handleStatusUpdate("processing")}
              disabled={updating || order.status === "processing"}
              className={`flex-1 min-w-[120px] h-10 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all border ${order.status === 'processing'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 cursor-default'
                : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
            >
              {updating && localStatus === 'processing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Processing
            </button>
            <button
              onClick={() => handleStatusUpdate("completed")}
              disabled={updating || order.status === "completed"}
              className={`flex-1 min-w-[120px] h-10 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all border ${order.status === 'completed'
                ? 'bg-green-500/20 text-green-400 border-green-500/50 cursor-default'
                : 'bg-white/5 text-white/60 border-white/10 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/50'
                }`}
            >
              {updating && localStatus === 'completed' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Complete
            </button>
            <button
              onClick={() => handleStatusUpdate("cancelled")}
              disabled={updating || order.status === "cancelled"}
              className={`flex-1 min-w-[120px] h-10 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all border ${order.status === 'cancelled'
                ? 'bg-red-500/20 text-red-400 border-red-500/50 cursor-default'
                : 'bg-white/5 text-white/60 border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50'
                }`}
            >
              {updating && localStatus === 'cancelled' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Cancel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-[#16121E]/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#4A0E64]" />
                  Ordered Items
                </h2>
                <span className="text-white/40 text-sm">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
              </div>
              <div className="p-0">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-white/40 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-white/40 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-white/40 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden border border-white/5">
                              {item.image ? (
                                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-white/20" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">{item.productName}</p>
                              {item.variant && <p className="text-white/40 text-xs">{item.variant}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-white/80">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-white/80">{formatCurrency(item.price)}</td>
                        <td className="px-6 py-4 text-right text-white font-bold">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-white/5 flex flex-col items-end gap-2">
                <div className="flex justify-between w-full max-w-[240px] text-white/60">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.payment.amount)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[240px] text-xl font-bold text-white pt-2 border-t border-white/10">
                  <span>Order Total</span>
                  <span className="text-[#00E676] font-mono">{formatCurrency(order.payment.amount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-[#16121E]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#4A0E64]" />
                Payment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Payment Status</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${order.payment.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      <p className="text-white font-medium capitalize">{order.payment.status}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Transaction ID</p>
                    <p className="text-white/80 font-mono text-xs break-all">{order.payment.paymentIntentId || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Stripe Session</p>
                    <p className="text-white/80 font-mono text-xs break-all">{order.payment.stripeSessionId}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Currency</p>
                    <p className="text-white font-medium uppercase">{order.payment.currency}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Customer */}
            <div className="bg-[#16121E]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#4A0E64]" />
                Customer
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-0.5">Full Name</p>
                    <p className="text-white font-bold">{order.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-0.5">Email Address</p>
                    <p className="text-white font-medium break-all">{order.customer.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-0.5">Phone Number</p>
                    <p className="text-white font-medium">{order.customer.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-[#16121E]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#4A0E64]" />
                Fulfillment
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-2">Method</p>
                  <div className={`px-4 py-3 rounded-xl border flex items-center justify-between ${order.fulfillment.method === 'express'
                    ? 'bg-purple-500/10 border-purple-500/30'
                    : 'bg-orange-500/10 border-orange-500/30'
                    }`}>
                    <span className={`font-bold uppercase tracking-widest text-sm ${order.fulfillment.method === 'express' ? 'text-purple-400' : 'text-orange-400'
                      }`}>
                      {order.fulfillment.method}
                    </span>
                    <Truck className={`w-5 h-5 ${order.fulfillment.method === 'express' ? 'text-purple-400' : 'text-orange-400'
                      }`} />
                  </div>
                </div>

                {order.fulfillment.address && (
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-2">Delivery Address</p>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                      <div className="flex items-start gap-2 text-white/80">
                        <MapPin className="w-4 h-4 text-white/20 mt-1 shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-white">{order.fulfillment.address.street}</p>
                          <p>{order.fulfillment.address.city}, {order.fulfillment.address.zip}</p>
                          {order.fulfillment.address.country && <p>{order.fulfillment.address.country}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;

