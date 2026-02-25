import { useEffect, useState, Fragment, Suspense } from "react";
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
  RefreshCw,
  Info,
  ExternalLink,
  Copy
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import ThreeMugViewer from "@/components/3dView/ThreeMugViewer";
import TShirtMockupCanvas from "@/components/3dView/TShirtMockupCanvas";

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
              <h1 className="text-3xl font-bold text-white mb-1">Order #{order?.orderNumber || 'N/A'}</h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(
                    order?.status || 'pending'
                  )}`}
                >
                  {order?.status || 'pending'}
                </span>
                <span className="text-white/40 text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(order?.createdAt || "")} at {formatTime(order?.createdAt || "")}
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
                <span className="text-white/40 text-sm">
                  {(() => {
                    // Only count actual products, not delivery fees
                    const productQty = order.items
                      .filter(item => !item.productName.toLowerCase().includes('delivery') && !item.productName.toLowerCase().includes('shipping'))
                      .reduce((sum, item) => sum + (item.quantity || 0), 0);
                    return `${productQty} ${productQty === 1 ? 'Item' : 'Items'}`;
                  })()}
                </span>
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
                    {(order?.items || []).map((item, index) => {
                      // Smart Calculation for historical data:
                      const quantity = item?.quantity || 0;
                      const price = item?.price || 0;
                      const amount = order?.payment?.amount || 0;

                      const isPriceActuallyLineTotal = quantity > 1 &&
                        (price * quantity) > (amount + 0.01);

                      const unitPrice = isPriceActuallyLineTotal ? price / quantity : price;
                      const lineTotal = isPriceActuallyLineTotal ? price : (price * quantity);

                      const name = item?.productName || "Unknown Product";
                      const lowerName = name.toLowerCase();
                      const isDeliveryItem = lowerName.includes('delivery') ||
                        lowerName.includes('shipping') ||
                        lowerName.includes('fulfillment') ||
                        lowerName.includes('fee') ||
                        lowerName.includes('service');

                      const hasCustomization = !!item?.customization && !isDeliveryItem;

                      // Enhanced detection: assume cup unless we find shirt-related terms
                      const isShirt = lowerName.includes('shirt') ||
                        lowerName.includes('tshirt') ||
                        lowerName.includes('tee') ||
                        lowerName.includes('top') ||
                        lowerName.includes('apparel');
                      const productType = isShirt ? 'tshirt' : 'cup';

                      return (
                        <Fragment key={index}>
                          <tr className={`hover:bg-white/5 transition-colors ${isDeliveryItem ? 'bg-orange-500/5' : ''}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden border border-white/5 p-1">
                                  {isDeliveryItem ? (
                                    <Truck className="w-5 h-5 text-orange-400" />
                                  ) : (
                                    <img
                                      src={productType === 'cup' ? '/general/cup.png' : '/general/tshirt.png'}
                                      alt={name}
                                      className="w-full h-full object-contain filter brightness-110"
                                    />
                                  )}
                                </div>
                                <div>
                                  <p className={`text-white font-medium ${isDeliveryItem ? 'text-orange-400' : ''}`}>
                                    {name}
                                  </p>
                                  {item.variant && <p className="text-white/40 text-xs">{item.variant}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center text-white/80">{item.quantity}</td>
                            <td className="px-6 py-4 text-right text-white/80">{formatCurrency(unitPrice)}</td>
                            <td className="px-6 py-4 text-right text-white font-bold">{formatCurrency(lineTotal)}</td>
                          </tr>
                          {hasCustomization && (
                            <tr key={`custom-${index}`}>
                              <td colSpan={4} className="px-6 py-4 bg-white/[0.02]">
                                <div className="flex flex-col md:flex-row gap-6">
                                  {/* Left: Metadata */}
                                  <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-2 text-[#4A0E64] mb-2 font-bold text-sm tracking-widest uppercase">
                                      <Info className="w-4 h-4" />
                                      Design Analysis
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                      {/* Base Color */}
                                      <div className="p-3 bg-black/40 rounded-xl border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Copy className="w-3 h-3 text-white/40 cursor-pointer hover:text-white" onClick={() => {
                                            if (item.customization?.color) {
                                              navigator.clipboard.writeText(item.customization.color);
                                            }
                                          }} />
                                        </div>
                                        <p className="text-white/40 text-[10px] uppercase font-bold mb-2 flex items-center gap-1.5">
                                          <div className="w-1 h-1 rounded-full bg-purple-500" />
                                          Base Color
                                        </p>
                                        <div className="flex items-center gap-2.5">
                                          <div
                                            className="w-5 h-5 rounded-lg border border-white/20 shadow-lg"
                                            style={{ backgroundColor: item.customization?.color || '#ffffff' }}
                                          />
                                          <div>
                                            <p className="text-white text-sm font-bold leading-none">{item.customization?.colorName || 'N/A'}</p>
                                            <p className="text-white/30 text-[10px] font-mono mt-1 uppercase">{item.customization?.color || ''}</p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Design Size */}
                                      <div className="p-3 bg-black/40 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                                        <p className="text-white/40 text-[10px] uppercase font-bold mb-2 flex items-center gap-1.5">
                                          <div className="w-1 h-1 rounded-full bg-blue-500" />
                                          Design Size
                                        </p>
                                        <div className="flex items-baseline gap-1">
                                          <p className="text-white text-lg font-bold">
                                            {item.customization?.designScale ? (item.customization.designScale * 100).toFixed(0) : '100'}
                                          </p>
                                          <span className="text-white/40 text-[10px] font-bold">%</span>
                                        </div>
                                      </div>

                                      {/* Coordinates */}
                                      <div className="p-3 bg-black/40 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                                        <p className="text-white/40 text-[10px] uppercase font-bold mb-2 flex items-center gap-1.5">
                                          <div className="w-1 h-1 rounded-full bg-green-500" />
                                          Position (X, Y)
                                        </p>
                                        <div className="flex items-center gap-3">
                                          <div className="space-y-0.5">
                                            <p className="text-white/30 text-[8px] uppercase font-bold">X-Axis</p>
                                            <p className="text-white text-xs font-mono font-bold">{item.customization?.designPosition?.[0]?.toFixed(2) || '0.00'}</p>
                                          </div>
                                          <div className="w-px h-6 bg-white/5" />
                                          <div className="space-y-0.5">
                                            <p className="text-white/30 text-[8px] uppercase font-bold">Y-Axis</p>
                                            <p className="text-white text-xs font-mono font-bold">{item.customization?.designPosition?.[1]?.toFixed(2) || '0.00'}</p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Original Asset */}
                                      <div className="p-3 bg-black/40 rounded-xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                                        <p className="text-white/40 text-[10px] uppercase font-bold mb-2 flex items-center gap-1.5">
                                          <div className="w-1 h-1 rounded-full bg-orange-500" />
                                          Original Asset
                                        </p>
                                        {item.customization?.originalDesign ? (
                                          <a
                                            href={item.customization.originalDesign}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-lg transition-all border border-blue-500/20"
                                          >
                                            <ExternalLink className="w-3 h-3" />
                                            View Design
                                          </a>
                                        ) : (
                                          <p className="text-white/20 text-xs font-medium">N/A</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Interactive 3D Inspector */}
                                <div className="mt-6 hidden lg:block">
                                  <div className="p-4 bg-black/30 rounded-2xl border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Interactive 3D Inspector</p>
                                      <div className="flex gap-2">
                                        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded border border-green-500/20 uppercase tracking-tighter">Rendered Live</span>
                                      </div>
                                    </div>
                                    <div className="h-[400px] w-full bg-[#080319]/50 rounded-xl overflow-hidden relative">
                                      <Fragment>
                                        <Suspense fallback={
                                          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="w-6 h-6 text-[#4A0E64] animate-spin" />
                                            <p className="text-white/20 text-[10px] uppercase font-bold">Initializing 3D Engine...</p>
                                          </div>
                                        }>
                                          {productType === 'cup' ? (
                                            <ThreeMugViewer
                                              color={item.customization?.color || '#ffffff'}
                                              imageUrl={item.customization?.originalDesign || item.image || ""}
                                              isApplied={true}
                                              zoomScale={100}
                                            />
                                          ) : (
                                            <TShirtMockupCanvas
                                              color={item.customization?.color || '#ffffff'}
                                              imageUrl={item.customization?.originalDesign || item.image || ""}
                                              isApplied={true}
                                              decalPosition={(Array.isArray(item.customization?.designPosition) && item.customization?.designPosition.length === 3) ? (item.customization?.designPosition as [number, number, number]) : [0, 0.04, 0.15]}
                                              decalScale={item.customization?.designScale || 0.18}
                                            />
                                          )}
                                        </Suspense>
                                      </Fragment>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-white/5 flex flex-col items-end gap-2">
                {(() => {
                  const itemsOnlyTotal = (order?.items || [])
                    .filter(item => {
                      const itmName = item.productName || "";
                      return !itmName.toLowerCase().includes('delivery') && !itmName.toLowerCase().includes('shipping');
                    })
                    .reduce((sum, item) => {
                      const isPriceActuallyLineTotal = item.quantity > 1 &&
                        (item.price * item.quantity) > ((order?.payment?.amount || 0) + 0.01);
                      return sum + (isPriceActuallyLineTotal ? item.price : (item.price * (item.quantity || 0)));
                    }, 0);

                  const totalAmount = order?.payment?.amount || 0;
                  const deliveryFee = totalAmount - itemsOnlyTotal;

                  return (
                    <Fragment>
                      <div className="flex justify-between w-full max-w-[240px] text-white/60">
                        <span>Products Subtotal</span>
                        <span>{formatCurrency(itemsOnlyTotal)}</span>
                      </div>
                      {deliveryFee > 0 && (
                        <div className="flex justify-between w-full max-w-[240px] text-orange-400">
                          <span>Delivery Fee</span>
                          <span>{formatCurrency(deliveryFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between w-full max-w-[240px] text-xl font-bold text-white pt-2 border-t border-white/10">
                        <span>Total Payed</span>
                        <span className="text-[#00E676] font-mono">{formatCurrency(order?.payment?.amount || 0)}</span>
                      </div>
                    </Fragment>
                  );
                })()}
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
                      <span className={`w-2 h-2 rounded-full ${order?.payment?.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      <p className="text-white font-medium capitalize">{order?.payment?.status || 'pending'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Transaction ID</p>
                    <p className="text-white/80 font-mono text-xs break-all">{order?.payment?.paymentIntentId || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Stripe Session</p>
                    <p className="text-white/80 font-mono text-xs break-all">{order?.payment?.stripeSessionId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Currency</p>
                    <p className="text-white font-medium uppercase">{order?.payment?.currency || 'USD'}</p>
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
                    <p className="text-white font-bold">{order?.customer?.name || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-0.5">Email Address</p>
                    <p className="text-white font-medium break-all">{order?.customer?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-0.5">Phone Number</p>
                    <p className="text-white font-medium">{order?.customer?.phone || 'N/A'}</p>
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
                  <div className={`px-4 py-3 rounded-xl border flex items-center justify-between ${order?.fulfillment?.method === 'express'
                    ? 'bg-purple-500/10 border-purple-500/30'
                    : 'bg-orange-500/10 border-orange-500/30'
                    }`}>
                    <span className={`font-bold uppercase tracking-widest text-sm ${order?.fulfillment?.method === 'express' ? 'text-purple-400' : 'text-orange-400'
                      }`}>
                      {order?.fulfillment?.method || 'Standard'}
                    </span>
                    <Truck className={`w-5 h-5 ${order?.fulfillment?.method === 'express' ? 'text-purple-400' : 'text-orange-400'
                      }`} />
                  </div>
                </div>

                {order?.fulfillment?.address && (
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-2">Delivery Address</p>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                      <div className="flex items-start gap-2 text-white/80">
                        <MapPin className="w-4 h-4 text-white/20 mt-1 shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-white">{order?.fulfillment?.address?.street}</p>
                          <p>{order?.fulfillment?.address?.city}, {order?.fulfillment?.address?.zip}</p>
                          {order?.fulfillment?.address?.country && <p>{order?.fulfillment?.address?.country}</p>}
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

