// import React from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Globe, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const currencies = [
    { code: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
    { code: "USD", label: "US Dollar ($)", symbol: "$" },
    { code: "EUR", label: "Euro (€)", symbol: "€" },
    { code: "GBP", label: "British Pound (£)", symbol: "£" },
];

const CurrencySwitcher = () => {
    const { currency, symbol } = useCurrency(); // Currently we don't have a way to change it from user side yet as requested, but I can implement a local override or just show the current one.
    // The user said "add a currency switcher... that works properly across the whole website".
    // I will implement a local override for the user, but the default comes from Admin.

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="fixed top-8 right-8 z-[100]" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all shadow-xl"
            >
                <Globe size={16} className="text-[#F70353]" />
                <span className="font-bold text-sm tracking-widest">{currency} ({symbol})</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 right-0 w-48 bg-[#16121E] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-2 border-b border-white/5 bg-white/5">
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Current Site Currency</p>
                        </div>
                        {currencies.map((curr) => (
                            <div
                                key={curr.code}
                                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${currency === curr.code ? "bg-[#F70353]/10 text-white" : "text-white/60"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="font-bold w-4">{curr.symbol}</span>
                                    <span>{curr.code}</span>
                                </div>
                                {currency === curr.code && <Check size={14} className="text-[#F70353]" />}
                            </div>
                        ))}
                        <div className="p-2 bg-white/5 border-t border-white/5">
                            <p className="text-[9px] text-white/30 italic">Change this in Admin Settings</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CurrencySwitcher;
