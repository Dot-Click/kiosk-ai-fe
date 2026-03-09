import React from "react";
import { useCurrency } from "@/context/CurrencyContext";

interface PriceProps {
    amount: number;
    className?: string;
    showStrikethrough?: boolean;
    strikethroughAmount?: number;
}

const Price: React.FC<PriceProps> = ({
    amount,
    className = "",
    showStrikethrough = false,
    strikethroughAmount
}) => {
    const { formatPrice, loading } = useCurrency();

    if (loading) {
        return <span className={`animate-pulse bg-white/10 rounded w-16 h-4 inline-block ${className}`} />;
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="font-bold">{formatPrice(amount)}</span>
            {showStrikethrough && strikethroughAmount && (
                <span className="text-white/30 line-through text-xs italic">
                    {formatPrice(strikethroughAmount)}
                </span>
            )}
        </div>
    );
};

export default Price;
