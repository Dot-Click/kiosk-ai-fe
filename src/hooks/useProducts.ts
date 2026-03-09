import { useState, useEffect, useCallback } from "react";
import { axios } from "@/config/axios";

export interface Product {
    _id: string;
    code: string;
    productCategory: string;
    price: number;
    quantity: number;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get("/products/all");
            if (res.data.success) {
                setProducts(res.data.data);
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    }, []);

    const createProduct = async (data: Partial<Product>) => {
        try {
            const res = await axios.post("/products/create", data);
            if (res.data.success) {
                setProducts(prev => [res.data.data, ...prev]);
                return true;
            }
            return false;
        } catch (err: any) {
            setError(err.message || "Failed to create product");
            return false;
        }
    };

    const updateProduct = async (id: string, data: Partial<Product>) => {
        try {
            const res = await axios.put(`/products/${id}`, data);
            if (res.data.success) {
                setProducts(prev => prev.map(p => p._id === id ? res.data.data : p));
                return true;
            }
            return false;
        } catch (err: any) {
            setError(err.message || "Failed to update product");
            return false;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const res = await axios.delete(`/products/${id}`);
            if (res.data.success) {
                setProducts(prev => prev.filter(p => p._id !== id));
                return true;
            }
            return false;
        } catch (err: any) {
            setError(err.message || "Failed to delete product");
            return false;
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct
    };
}
