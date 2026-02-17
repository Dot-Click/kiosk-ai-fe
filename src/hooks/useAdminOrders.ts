import { useState, useCallback } from "react";
import { axios } from "@/config/axios";

/** Currency used for display (backend may store in cents or decimal) */
export const CURRENCY_CODE = "EUR" as const;
export const CURRENCY_SYMBOL = "€" as const;

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  image?: string;
  variant?: string;
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
  status: "pending" | "processing" | "completed" | "cancelled";
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
}

export function formatCurrencyEur(amount: number): string {
  return new Intl.NumberFormat("en-US", {
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
  fetchOrders: (filters?: OrdersFilters) => Promise<void>;
  fetchOrderDetails: (id: string) => Promise<OrderDetail | null>;
  updateOrderStatus: (id: string, status: string) => Promise<boolean>;
  clearOrderDetail: () => void;
  formatCurrency: (amount: number) => string;
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

  const fetchOrders = useCallback(async (filters?: OrdersFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (filters?.status && filters.status !== "all") params.status = filters.status;
      if (filters?.search) params.search = filters.search;

      const response = await axios.get<GetOrdersResponse>("/admin/orders", {
        headers: getAuthHeaders(),
        params,
      });

      if (response.data.success && response.data.data) {
        // Correctly access the orders array from the data object
        setOrders(response.data.data.orders ?? []);
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
    formatCurrency: formatCurrencyEur,
  };
};
