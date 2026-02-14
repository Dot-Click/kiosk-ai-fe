import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Box } from "@/components/ui/box";
import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { ArrowLeft, MapPin } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminOrders } from "@/hooks/useAdminOrders";

const AdminOrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAdminAuth();
  const {
    orderDetail,
    loadingDetail,
    error,
    fetchOrderDetails,
    clearOrderDetail,
    formatCurrency,
  } = useAdminOrders();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setMounted(true);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (mounted && id) {
      fetchOrderDetails(id);
      return () => clearOrderDetail();
    }
  }, [mounted, id]);

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!mounted) return null;

  if (loadingDetail) {
    return (
      <Box className="min-h-screen w-full bg-[#080319] flex items-center justify-center">
        <p className="text-white text-xl">Loading order...</p>
      </Box>
    );
  }

  if (error || !orderDetail) {
    return (
      <Box className="min-h-screen w-full bg-[#080319] p-4 md:p-8">
        <Box className="max-w-2xl mx-auto">
          <Flex className="items-center gap-4 mb-6">
            <Box
              onClick={() => navigate("/admin/orders")}
              className="h-[40px] w-[40px] flex items-center justify-center rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Box>
            <p className="text-red-400">{error || "Order not found."}</p>
          </Flex>
        </Box>
      </Box>
    );
  }

  const addr = orderDetail.shippingAddress;

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-center bg-no-repeat p-4 md:p-8">
      <Box className="max-w-2xl mx-auto">
        <Flex className="items-center gap-4 mb-8">
          <Box
            onClick={() => navigate("/admin/orders")}
            className="h-[40px] w-[40px] flex items-center justify-center rounded-lg bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] cursor-pointer transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Box>
          <Box className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Order #{orderDetail.orderNumber}
            </h1>
            <p className="text-white/60 text-sm">{formatDate(orderDetail.createdAt)}</p>
          </Box>
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
              orderDetail.status
            )}`}
          >
            {orderDetail.status.charAt(0).toUpperCase() + orderDetail.status.slice(1)}
          </span>
        </Flex>

        <Stack className="gap-6">
          {/* Customer */}
          <Box className="bg-[#16121E] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-3">Customer</h2>
            <p className="text-white font-medium">{orderDetail.customerName}</p>
            <p className="text-white/60 text-sm">{orderDetail.customerEmail}</p>
          </Box>

          {/* Items */}
          <Box className="bg-[#16121E] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-3">Items</h2>
            <Stack className="gap-3">
              {orderDetail.items.map((item, idx) => (
                <Flex
                  key={idx}
                  className="justify-between items-center py-2 border-b border-white/5 last:border-0"
                >
                  <Box>
                    <p className="text-white font-medium">{item.productName}</p>
                    <p className="text-white/50 text-sm">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </Box>
                  <p className="text-white font-semibold">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                </Flex>
              ))}
            </Stack>
            <Flex className="justify-between items-center mt-4 pt-4 border-t border-white/10">
              <span className="text-white/80 font-semibold">Total</span>
              <span className="text-white text-lg font-bold">
                {formatCurrency(orderDetail.totalAmount)}
              </span>
            </Flex>
          </Box>

          {/* Shipping */}
          {addr && (addr.street || addr.city || addr.country) && (
            <Box className="bg-[#16121E] border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping address
              </h2>
              <p className="text-white/80 text-sm whitespace-pre-line">
                {[addr.street, [addr.city, addr.state, addr.zip].filter(Boolean).join(", "), addr.country]
                  .filter(Boolean)
                  .join("\n")}
              </p>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default AdminOrderDetailPage;
