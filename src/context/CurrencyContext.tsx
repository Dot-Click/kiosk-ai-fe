import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useStripeCheckout, StripeConfig } from "@/hooks/useStripeCheckout";

interface CurrencyContextType {
    currency: string;
    symbol: string;
    loading: boolean;
    formatPrice: (amount: number) => string;
    refreshConfig: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { fetchStripeConfig } = useStripeCheckout();
    const [config, setConfig] = useState<StripeConfig | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshConfig = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchStripeConfig();
            if (data) {
                setConfig(data);
            }
        } catch (error) {
            console.error("Failed to load currency config:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchStripeConfig]);

    useEffect(() => {
        refreshConfig();
    }, [refreshConfig]);

    const currencyCode = (config?.currency || "INR").toUpperCase();

    const getSymbol = (code: string) => {
        switch (code) {
            case "INR": return "₹";
            case "USD": return "$";
            case "EUR": return "€";
            case "GBP": return "£";
            case "CAD": return "C$";
            case "AUD": return "A$";
            default: return "₹";
        }
    };

    const symbol = getSymbol(currencyCode);

    const formatPrice = useCallback((amount: number) => {
        // Determine locale based on currency
        const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';

        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currencyCode,
            minimumFractionDigits: 2,
        }).format(amount);
    }, [currencyCode]);

    return (
        <CurrencyContext.Provider value={{
            currency: currencyCode,
            symbol,
            loading,
            formatPrice,
            refreshConfig
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
};
