import { useState } from "react";
import { useNavigate } from "react-router";
import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { Flex } from "@/components/ui/flex";
import { Search, Package, Calendar, CreditCard, Loader2, CheckCircle2, Truck, Eye, Download } from "lucide-react";
// import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { axios } from "@/config/axios";
import { toast } from "sonner";
import { cn } from "@/utils/cn.util";
import { motion, AnimatePresence } from "framer-motion";
import { BiArrowBack } from "react-icons/bi";
import ThreeMugViewer from "@/components/3dView/ThreeMugViewer";
import TShirtMockupCanvas from "@/components/3dView/TShirtMockupCanvas";
import ErrorBoundary from "@/components/ErrorBoundary";

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
  customization?: {
    color?: string;
    originalDesign?: string;
    designPosition?: number[] | [number, number, number];
    designScale?: number;
  };
}

interface OrderData {
  orderNumber: string;
  status: string;
  createdAt: string;
  amount: number | string;
  currency?: string;
  paymentStatus?: string;
  fulfillment?: {
    method?: string;
    address?: {
      street?: string;
      city?: string;
      zip?: string;
      country?: string;
    };
  };
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
}

const TrackPage = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const navigate = useNavigate();
  const componentRef = useRef<HTMLDivElement>(null);

  // const handlePrint = useReactToPrint({
  //   contentRef: componentRef,
  // });

  const handleDownloadPDF = async () => {
    if (!componentRef.current) return;
    setLoading(true);
    try {
      const element = componentRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, // High quality
        logging: true,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // CRITICAL: Tailwind 4 oklch colors CRASH html2canvas.
          // This code forces standard colors so the PDF can generate.
          const el = clonedDoc.getElementById('receipt-slip-container');
          if (el) {
            el.style.backgroundColor = '#ffffff';
            el.style.color = '#000000';
            const allItems = el.getElementsByTagName('*');
            for (let i = 0; i < allItems.length; i++) {
              const item = allItems[i] as HTMLElement;
              const computed = window.getComputedStyle(item);
              if (computed.color.includes('oklch')) item.style.color = '#000000';
              if (computed.backgroundColor.includes('oklch')) item.style.backgroundColor = 'transparent';
            }
          }
        }
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [100, canvas.height * (100 / canvas.width)] // Receipt size
      });
      pdf.addImage(imgData, "PNG", 0, 0, 100, canvas.height * (100 / canvas.width));
      pdf.save(`Order_${orderData?.orderNumber || 'Slip'}.pdf`);
      toast.success("Receipt downloaded!");
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId.trim()) {
      toast.error("Please enter an Order Number or ID");
      return;
    }

    setLoading(true);
    setOrderData(null);

    try {
      const response = await axios.get(`/track/${orderId.trim()}`);
      if (response.data.success) {
        setOrderData(response.data.data);
        toast.success("Order found!");
      } else {
        toast.error(response.data.message || "Order not found");
      }
    } catch (error: any) {
      console.error("Tracking error:", error);
      const message = error.response?.data?.message || "Could not find order. Please check the ID.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'processing':
      case 'shipped':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const formatPrice = (price: any) => {
    const val = typeof price === 'number' ? price : parseFloat(price);
    return isNaN(val) ? "0.00" : val.toFixed(2);
  };

  const formatDate = (dateStr: any) => {
    const fallback = { date: "N/A", time: "" };
    if (!dateStr) return fallback;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return fallback;
      return {
        date: date.toLocaleDateString(undefined, { dateStyle: 'long' }),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return fallback;
    }
  };

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-center bg-no-repeat bg-fixed text-white relative flex flex-col overflow-x-hidden">
      {/* Dynamic Background Overlays/Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-black/40" />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-black/60" />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#F70353]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header / Navbar */}
      <nav className="w-full px-6 py-6 flex items-center justify-between z-50 sticky top-0 bg-black/20 backdrop-blur-md border-b border-white/5">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 group"
        >
          <BiArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase text-[10px] font-black tracking-[0.2em]">Dashboard</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none">
            TRACK <span className="text-[#F70353]">ORDER</span>
          </h1>
          <div className="h-1 w-12 bg-[#F70353] mt-1 rounded-full shadow-[0_0_10px_#F70353]" />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {/* Placeholder for symmetry */}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-20 py-10 gap-10 z-20">

        {/* Search Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-[2.5rem] shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-center">Track your package</h2>
            <p className="text-white/50 text-center mb-8 text-sm">Enter your tracking number or order ID below</p>

            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/30 group-focus-within:text-[#F70353] transition-colors" />
                <input
                  type="text"
                  placeholder="Order ID (e.g. ORD-123456)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#F70353]/50 focus:ring-1 focus:ring-[#F70353]/50 transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#F70353] hover:bg-[#F70353]/90 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(247,3,83,0.3)]"
              >
                {loading ? <Loader2 className="size-5 animate-spin" /> : "Track Now"}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {orderData ? (
            <ErrorBoundary>
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Status Card */}
                  <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-[40px] border border-white/10 p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col gap-10">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="space-y-1">
                        <p className="text-white/30 text-[9px] uppercase font-black tracking-[0.4em] pl-1">Consignment No.</p>
                        <h3 className="text-4xl font-black font-mono text-[#F70353] drop-shadow-[0_0_15px_rgba(247,3,83,0.3)] tracking-tight">
                          {orderData.orderNumber?.toUpperCase()}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleDownloadPDF}
                          disabled={loading}
                          className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group/btn"
                        >
                          {loading && orderData ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Download className="size-3 text-[#F70353] group-hover/btn:scale-110 transition-transform" />
                          )}
                          Receipt
                        </button>
                        <div className={cn("px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] shadow-lg", getStatusColor(orderData.status))}>
                          {orderData.status?.toUpperCase() || "PENDING"}
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Progress Bar based on Method */}
                    <div className="relative pt-2">
                      {(() => {
                        const method = orderData.fulfillment?.method || "doorstep";
                        const isExpress = method === "express";

                        const steps = isExpress
                          ? ["Received", "Processing", "Handoff"]
                          : ["Processing", "Shipped", "Delivered"];

                        const status = orderData.status?.toLowerCase() || "pending";

                        let progress = "10%";
                        if (isExpress) {
                          if (status === "completed" || status === "delivered") progress = "100%";
                          else if (status === "processing" || status === "shipped") progress = "50%";
                          else progress = "10%";
                        } else {
                          if (status === "completed" || status === "delivered") progress = "100%";
                          else if (status === "shipped") progress = "66%";
                          else if (status === "processing") progress = "33%";
                          else progress = "10%";
                        }

                        return (
                          <>
                            <div className="flex justify-between mb-2">
                              {steps.map((step, i) => (
                                <span key={i} className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{step}</span>
                              ))}
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: progress }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#F70353] to-purple-500 rounded-full"
                              />
                            </div>
                            <div className="flex justify-between mt-2">
                              {isExpress ? (
                                <>
                                  <CheckCircle2 className={cn("size-4", status !== 'pending' ? 'text-[#F70353]' : 'text-white/10')} />
                                  <CheckCircle2 className={cn("size-4", ['processing', 'shipped', 'delivered', 'completed'].includes(status) ? 'text-[#F70353]' : 'text-white/10')} />
                                  <CheckCircle2 className={cn("size-4", ['delivered', 'completed'].includes(status) ? 'text-[#F70353]' : 'text-white/10')} />
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className={cn("size-4", status !== 'pending' ? 'text-[#F70353]' : 'text-white/10')} />
                                  <CheckCircle2 className={cn("size-4", ['shipped', 'delivered', 'completed'].includes(status) ? 'text-[#F70353]' : 'text-white/10')} />
                                  <CheckCircle2 className={cn("size-4", ['delivered', 'completed'].includes(status) ? 'text-[#F70353]' : 'text-white/10')} />
                                </>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-2 gap-6 mt-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-white/30 text-[10px] font-bold uppercase flex items-center gap-2"><Calendar className="size-3" /> Ordered On</p>
                        <p className="text-sm font-medium">
                          {(() => {
                            const d = formatDate(orderData.createdAt);
                            return `${d.date} ${d.time ? `at ${d.time}` : ""}`;
                          })()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-white/30 text-[10px] font-bold uppercase flex items-center gap-2"><CreditCard className="size-3" /> Payment</p>
                        <p className="text-sm font-medium capitalize">{orderData.paymentStatus} — {formatPrice(orderData.amount)} {orderData.currency || "INR"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info Card */}
                  <div className="bg-white/[0.04] backdrop-blur-[40px] border border-white/10 p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col gap-8">
                    <h4 className="font-black flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#F70353] filter drop-shadow-[0_0_5px_rgba(247,3,83,0.3)]">
                      <Package className="size-4" /> Transit Details
                    </h4>

                    <div className="flex flex-col gap-6">
                      <div>
                        <p className="text-white font-black text-lg uppercase tracking-tight">{orderData.customer?.name}</p>
                        <p className="text-white/50 text-[11px] mt-2 leading-relaxed font-medium">
                          {orderData.fulfillment?.address?.street ? (
                            <>
                              {orderData.fulfillment.address.street}<br />
                              <span className="text-white/30 font-bold">{orderData.fulfillment.address.city}, {orderData.fulfillment.address.zip}</span><br />
                              {orderData.fulfillment.address.country}
                            </>
                          ) : "N/A"}
                        </p>
                      </div>
                      <div className="h-px bg-white/5 w-full" />
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">Email</p>
                          <p className="text-xs font-bold text-white/80">{orderData.customer?.email}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">Phone</p>
                          <p className="text-xs font-bold text-white/60">{orderData.customer?.phone}</p>
                        </div>
                      </div>
                    </div>


                  </div>

                  {/* Items List */}
                  <div className="lg:col-span-3 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
                    <div className="space-y-6">
                      {(() => {
                        const itemsTotal = orderData.items?.filter((i: OrderItem) => !i.productName?.toLowerCase().includes('delivery') && !i.productName?.toLowerCase().includes('shipping'))
                          .reduce((sum: number, i: OrderItem) => sum + (i.price * i.quantity), 0) || 0;

                        const deliveryItem = orderData.items?.find((i: OrderItem) => i.productName?.toLowerCase().includes('delivery') || i.productName?.toLowerCase().includes('shipping'));
                        const deliveryPrice = deliveryItem ? deliveryItem.price : 0;

                        return (
                          <>
                            <div className="space-y-6">
                              {orderData.items?.map((item: OrderItem, idx: number) => {
                                const lowerName = item.productName?.toLowerCase() || "";
                                const isDelivery = lowerName.includes('delivery') || lowerName.includes('shipping');
                                const isShirt = lowerName.includes('shirt') || lowerName.includes('tee');

                                return (
                                  <div key={idx} className={cn(
                                    "flex flex-col gap-6 p-6 rounded-[2rem] border transition-all overflow-hidden",
                                    isDelivery ? "bg-orange-500/5 border-orange-500/10" : "bg-white/5 border-white/5 group hover:border-[#F70353]/30"
                                  )}>
                                    <div className="flex items-center justify-between ">
                                      <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/5 overflow-hidden">
                                          {isDelivery ? (
                                            <Truck className="size-6 text-orange-400" />
                                          ) : (
                                            <img
                                              src={isShirt ? '/general/tshirt.png' : '/general/cup.png'}
                                              className="w-full h-full object-contain brightness-110"
                                              alt={item.productName}
                                            />
                                          )}
                                        </div>
                                        <div>
                                          <p className={cn("text-sm font-bold", isDelivery && "text-orange-400")}>{item.productName}</p>
                                          <p className="text-xs text-white/40">
                                            {item.quantity} x {item.price} {orderData.currency}
                                            {item.variant ? ` — ${item.variant}` : ""}
                                          </p>
                                        </div>
                                      </div>
                                      <p className={cn("text-sm font-bold font-mono", isDelivery ? "text-orange-400" : "text-[#F70353]")}>
                                        {formatPrice((item.price || 0) * (item.quantity || 1))} {orderData.currency || "INR"}
                                      </p>
                                    </div>

                                    {/* 3D Mockup Inspector (ONLY for products, NOT for delivery fees) */}
                                    {item.customization && !isDelivery && (
                                      <div className="mt-2 space-y-4">
                                        <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold tracking-widest pl-2">
                                          <Eye className="size-3 text-[#F70353]" /> Interactive 3D Mockup
                                        </div>
                                        <div className="h-[450px] w-full bg-black/40 rounded-2xl overflow-hidden border border-white/5 relative">
                                          <ErrorBoundary>
                                            {isShirt ? (
                                              <TShirtMockupCanvas
                                                color={item.customization.color || '#ffffff'}
                                                imageUrl={item.customization.originalDesign || item.image || ""}
                                                isApplied={true}
                                                decalPosition={(Array.isArray(item.customization.designPosition) && item.customization.designPosition.length === 3) ? (item.customization.designPosition as [number, number, number]) : [0, 0.04, 0.15]}
                                                decalScale={item.customization.designScale || 0.18}
                                              />
                                            ) : (
                                              <ThreeMugViewer
                                                color={item.customization.color || '#ffffff'}
                                                imageUrl={item.customization.originalDesign || item.image || ""}
                                                isApplied={true}
                                                zoomScale={100}
                                              />
                                            )}
                                          </ErrorBoundary>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Summary Section */}
                            <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span className="font-mono">{formatPrice(itemsTotal)} {orderData.currency || "INR"}</span>
                              </div>
                              {deliveryPrice > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-orange-400/60 font-bold uppercase tracking-widest text-[10px]">Delivery Fee</span>
                                  <span className="font-mono text-orange-400">{formatPrice(deliveryPrice)} {orderData.currency || "INR"}</span>
                                </div>
                              )}
                              <div className="flex justify-between items-center pt-2">
                                <span className="text-white font-black uppercase tracking-[0.2em] text-xs">Total Amount Paid</span>
                                <span className="text-2xl font-black font-mono text-[#F70353] bg-[#F70353]/10 px-4 py-2 rounded-xl">
                                  {formatPrice(orderData.amount)} {orderData.currency || "INR"}
                                </span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                </div>
              </motion.div>
            </ErrorBoundary>
          ) : !loading && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 opacity-50"
            >
              <Package className="size-16 text-white/10" />
              <p className="text-sm uppercase tracking-widest font-bold text-white/40">Ready to track your order</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative footer elements */}
      <footer className="w-full py-10 px-6 mt-10 text-center relative">
        <div className="flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
          <span>Kiosk AI</span>
          <span className="size-1 bg-white/10 rounded-full" />
          <span>Support</span>
          <span className="size-1 bg-white/10 rounded-full" />
          <span>Privacy</span>
        </div>
      </footer>
      {/* Hidden Receipt Slip for printing/downloading */}
      <div className="fixed top-0 left-0 opacity-0 pointer-events-none -z-50 overflow-hidden" style={{ width: '400px', height: '1px' }} aria-hidden="true">
        <div
          ref={componentRef}
          id="receipt-slip-container"
          className="p-10 w-full font-mono text-sm leading-relaxed"
          style={{ width: '400px', backgroundColor: '#ffffff', color: '#000000' }}
        >
          {/* Slip Header */}
          <div className="text-center border-b-2 border-dashed border-gray-200 pb-6 mb-6" style={{ borderColor: '#d1d5db' }}>
            <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#000000' }}>
              KIOSK<span style={{ color: '#F70353' }}>AI</span>
            </h2>
            <p className="text-[10px] text-gray-400 mt-1 uppercase" style={{ color: '#6b7280' }}>Terminal #88742 • Official Receipt</p>
          </div>

          {/* Slip Info */}
          <div className="space-y-1 mb-6 text-xs">
            <div className="flex justify-between">
              <span className="font-bold uppercase">Order ID:</span>
              <span className="font-bold">{orderData?.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold uppercase">Date:</span>
              <span>{formatDate(orderData?.createdAt).date} {formatDate(orderData?.createdAt).time}</span>
            </div>
          </div>

          {/* Slip Customer */}
          <div className="mb-6 border border-gray-100 p-3 rounded-md">
            <p className="font-bold text-[9px] text-gray-400 uppercase mb-1">Billed To</p>
            <p className="font-bold text-sm uppercase leading-none">{orderData?.customer?.name}</p>
            <p className="text-gray-500 text-[10px] mt-1">{orderData?.customer?.email}</p>
          </div>

          {/* Slip Items */}
          <div className="border-b-2 border-black pb-1 mb-3 flex justify-between font-bold uppercase text-[10px]">
            <span>Description</span>
            <span>Total</span>
          </div>

          <div className="space-y-4 mb-6">
            {orderData?.items?.map((item: OrderItem, index: number) => (
              <div key={index} className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <p className="font-bold leading-tight uppercase text-xs">{item.productName}</p>
                  <p className="text-gray-400 mt-0.5 text-[10px]">
                    {item.quantity} x {formatPrice(item.price)}
                  </p>
                </div>
                <span className="font-bold text-xs">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Slip Totals */}
          <div className="border-t-2 border-dashed border-gray-200 pt-4 space-y-1.5">
            <div className="flex justify-between text-gray-400 uppercase text-[9px] font-bold">
              <span>Total Balance</span>
              <span className="text-black text-sm font-black">{formatPrice(orderData?.amount)} {orderData?.currency || "INR"}</span>
            </div>
          </div>

          {/* Slip Footer */}
          <div className="mt-10 text-center border-t border-gray-100 pt-6">
            <div className="inline-block border border-gray-100 p-1.5 mb-3 opacity-30">
              <div className="h-6 w-32 bg-[url('https://bwipjs-api.metafloor.com/?bcid=code128&text=Kiosk-AI')] bg-no-repeat bg-center bg-contain"></div>
            </div>
            <p className="font-black text-xs uppercase tracking-tighter">Thank You!</p>
            <p className="text-[9px] text-gray-400 mt-1 uppercase italic">Powered by Kiosk AI</p>
            <div className="mt-3 pt-3 border-t border-dashed border-gray-100">
              <p className="text-[8px] font-bold text-gray-400 uppercase">Track your order at</p>
              <p className="text-[10px] font-black text-[#F70353]">{window.location.origin}/order-track</p>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default TrackPage;
