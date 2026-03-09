import { useState, useCallback } from "react";
import { axios } from "@/config/axios";
import { downloadCSV } from "@/utils/csv.util";
import { downloadPDF } from "@/utils/pdf.util";

/** Currency used for display (backend may store in cents or decimal) */
export const CURRENCY_CODE = "INR" as const;
export const CURRENCY_SYMBOL = "₹" as const;

export interface Customization {
  color?: string;
  colorName?: string;
  designPosition?: [number, number, number];
  designScale?: number;
  originalDesign?: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  image?: string;
  variant?: string;
  customization?: Customization;
}

export interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
  };
  items: OrderItem[];
  fulfillment: {
    method: "express" | "doorstep";
    address?: ShippingAddress;
  };
  payment: {
    stripeSessionId: string;
    paymentIntentId?: string;
    amount: number;
    currency: string;
    status: "pending" | "paid" | "failed";
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail extends Order { }

interface GetOrdersResponse {
  success: boolean;
  message: string;
  data?: {
    orders: Order[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  };
}

interface GetOrderDetailsResponse {
  success: boolean;
  message: string;
  data?: OrderDetail;
}

export interface OrdersFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function formatCurrencyInr(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${CURRENCY_SYMBOL}0.00`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: CURRENCY_CODE,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface UseAdminOrdersReturn {
  orders: Order[];
  orderDetail: OrderDetail | null;
  loading: boolean;
  loadingDetail: boolean;
  updating: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  fetchOrders: (filters?: OrdersFilters) => Promise<void>;
  fetchOrderDetails: (id: string) => Promise<OrderDetail | null>;
  updateOrderStatus: (id: string, status: string) => Promise<boolean>;
  clearOrderDetail: () => void;
  formatCurrency: (amount: number) => string;
  exportOrdersToCSV: (filters?: OrdersFilters) => Promise<void>;
  exportOrdersToPDF: (filters?: OrdersFilters) => Promise<void>;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const useAdminOrders = (): UseAdminOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  const fetchOrders = useCallback(async (filters?: OrdersFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {};
      if (filters?.status && filters.status !== "all") params.status = filters.status;
      if (filters?.search) params.search = filters.search;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;

      const response = await axios.get<GetOrdersResponse>("/admin/orders", {
        headers: getAuthHeaders(),
        params,
      });

      if (response.data.success && response.data.data) {
        // Correctly access the orders array and pagination from the data object
        setOrders(response.data.data.orders ?? []);
        if (response.data.data.pagination) {
          setPagination(response.data.data.pagination);
        }
      } else {
        setOrders([]);
        setError(response.data.message ?? "Failed to load orders");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ?? err.message ?? "Failed to load orders";
      setError(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderDetails = useCallback(async (id: string): Promise<OrderDetail | null> => {
    setLoadingDetail(true);
    setError(null);
    try {
      const response = await axios.get<GetOrderDetailsResponse>(`/admin/orders/${id}`, {
        headers: getAuthHeaders(),
      });

      if (response.data.success && response.data.data) {
        setOrderDetail(response.data.data);
        return response.data.data;
      }
      setError(response.data.message ?? "Order not found");
      return null;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ?? err.message ?? "Failed to load order details";
      setError(msg);
      setOrderDetail(null);
      return null;
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: string): Promise<boolean> => {
    setUpdating(true);
    setError(null);
    try {
      const response = await axios.patch<GetOrderDetailsResponse>(
        `/admin/orders/${id}`,
        { status },
        { headers: getAuthHeaders() }
      );

      if (response.data.success && response.data.data) {
        setOrderDetail(response.data.data);
        // Also update the order in the list if it exists
        setOrders(prev => prev.map(o => o._id === id || o.orderNumber === id ? response.data.data! : o));
        return true;
      }
      setError(response.data.message ?? "Failed to update status");
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? err.message ?? "Failed to update status";
      setError(msg);
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  const clearOrderDetail = useCallback(() => {
    setOrderDetail(null);
  }, []);

  const exportOrdersToCSV = useCallback(async (filters?: OrdersFilters) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        limit: 1000 // Fetch up to 1000 orders for export
      };
      if (filters?.status && filters.status !== "all") params.status = filters.status;
      if (filters?.search) params.search = filters.search;

      const response = await axios.get<GetOrdersResponse>("/admin/orders", {
        headers: getAuthHeaders(),
        params,
      });

      if (response.data.success && response.data.data?.orders) {
        const ordersToExport = response.data.data.orders;

        // Flatten orders for CSV with safety guards
        const csvData = ordersToExport.map(order => {
          const amount = order?.payment?.amount || 0;
          const productQty = order?.items?.reduce((sum, item) => {
            const isDelivery = item.productName.toLowerCase().includes('delivery') || item.productName.toLowerCase().includes('shipping');
            return sum + (isDelivery ? 0 : (item.quantity || 0));
          }, 0) || 0;

          return {
            'Order Number': order?.orderNumber || 'N/A',
            'Date': order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A',
            'Customer Name': order?.customer?.name || 'Unknown',
            'Email': order?.customer?.email || 'N/A',
            'Phone': order?.customer?.phone || 'N/A',
            'Products (Qty)': productQty,
            'Total Amount': amount.toFixed(2),
            'Currency': order?.payment?.currency || 'INR',
            'Method': order?.fulfillment?.method || 'N/A',
            'Status': order?.status || 'pending',
            'Payment Status': order?.payment?.status || 'unknown',
            'Address': order?.fulfillment?.address
              ? `${order.fulfillment.address.street || ''}, ${order.fulfillment.address.city || ''}`
              : 'N/A'
          };
        });

        const headers = [
          'Order Number', 'Date', 'Customer Name', 'Email', 'Phone',
          'Products (Qty)', 'Total Amount', 'Currency', 'Method',
          'Status', 'Payment Status', 'Address'
        ];

        downloadCSV(csvData, `orders_export_${new Date().toISOString().split('T')[0]}.csv`, headers);
      }
    } catch (err: any) {
      console.error("Export failed:", err);
      setError("Failed to export CSV. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const exportOrdersToPDF = useCallback(async (filters?: OrdersFilters) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        limit: 1000
      };
      if (filters?.status && filters.status !== "all") params.status = filters.status;
      if (filters?.search) params.search = filters.search;

      const response = await axios.get<GetOrdersResponse>("/admin/orders", {
        headers: getAuthHeaders(),
        params,
      });

      if (response.data.success && response.data.data?.orders) {
        const ordersToExport = response.data.data.orders;

        const pdfData = ordersToExport.map(order => {
          const amount = order?.payment?.amount || 0;
          const productQty = order?.items?.reduce((sum, item) => {
            const isDelivery = item.productName.toLowerCase().includes('delivery') || item.productName.toLowerCase().includes('shipping');
            return sum + (isDelivery ? 0 : (item.quantity || 0));
          }, 0) || 0;

          // Smart Calculation for historical data consistency in PDF
          // Note: The specific details page is more complex, here we just ensure the amount/qty shown are accurate
          return {
            'Order #': order?.orderNumber || 'N/A',
            'Date': order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A',
            'Customer': order?.customer?.name || 'Unknown',
            'Items': productQty,
            'Amount': `${order?.payment?.currency?.toUpperCase() || 'INR'} ${amount.toFixed(2)}`,
            'Status': order?.status || 'pending',
            'Method': order?.fulfillment?.method || 'N/A'
          };
        });

        const headers = ['Order #', 'Date', 'Customer', 'Items', 'Amount', 'Status', 'Method'];

        downloadPDF(
          pdfData,
          `orders_export_${new Date().toISOString().split('T')[0]}.pdf`,
          'Orders Management Report',
          headers
        );
      }
    } catch (err: any) {
      console.error("PDF Export failed:", err);
      setError("Failed to export PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    orderDetail,
    loading,
    loadingDetail,
    updating,
    error,
    fetchOrders,
    fetchOrderDetails,
    updateOrderStatus,
    clearOrderDetail,
    formatCurrency: formatCurrencyInr,
    pagination,
    exportOrdersToCSV,
    exportOrdersToPDF,
  };
};
