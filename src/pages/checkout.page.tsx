import { useState, useEffect } from "react";
// import { Box } from "@/components/ui/box";
import { cn } from "@/utils/cn.util";
import { useNavigate } from "react-router";
import { useImageStore } from "@/store/image.store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  // Clock,
  Truck,
  Loader2,
  ShieldCheck,
  Package,
  ChevronLeft,
  MapPin,
  CreditCard,
  Sparkles,
  // CheckCircle,
  // Coffee,
  Zap,
  Home,
  Lock,
  Gift,
  Star,
  Heart
} from "lucide-react";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const UNIT_PRICE = 29.99;

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount);
}

// Payment Form Component
function PaymentForm({ amountInCents, currency, onBack }: { 
  amountInCents: number; 
  currency: string; 
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    
    setLoading(true);
    setError(null);
    
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });
    
    if (confirmError) {
      setError(confirmError.message || "Payment failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with Back */}
      <div className="flex items-center gap-4 pb-4 border-b border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h3 className="font-bold text-lg">Complete Payment</h3>
          <p className="text-white/40 text-sm">Secure checkout powered by Stripe</p>
        </div>
      </div>

      {/* Payment Element */}
      <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <PaymentElement />
      </div>

      {/* Total Amount */}
      <div className="bg-gradient-to-r from-[#F70353]/20 to-transparent rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-white/60">Total to pay</span>
          <span className="text-2xl font-bold text-[#F70353]">
            {formatAmount(amountInCents / 100, currency)}
          </span>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-5 rounded-xl font-bold text-lg bg-gradient-to-r from-[#F70353] to-[#C20241] text-white shadow-lg shadow-[#F70353]/25 hover:shadow-xl hover:shadow-[#F70353]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock size={18} />
            Pay {formatAmount(amountInCents / 100, currency)}
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-3 text-white/30 text-xs">
        <ShieldCheck size={14} />
        <span>256-bit SSL Encryption</span>
        <span>•</span>
        <span>PCI Compliant</span>
      </div>
    </form>
  );
}

// Main Checkout Component
const Checkout = () => {
  const navigate = useNavigate();
  const selectedImage = useImageStore((state) => state.selectedImage);
  
  // State
  const [quantity, setQuantity] = useState(1);
  const [fulfillment, setFulfillment] = useState<"express" | "doorstep">("express");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: "", city: "", zip: "" });
  const [showAddress, setShowAddress] = useState(false);

  // Hooks
  const { config, fetchStripeConfig, createPaymentIntent } = useStripeCheckout();

  useEffect(() => {
    fetchStripeConfig();
  }, [fetchStripeConfig]);

  // Calculations
  const subtotal = UNIT_PRICE * quantity;
  const shippingCost = fulfillment === "doorstep" ? 5 : 0;
  const total = subtotal + shippingCost;
  const amountInCents = Math.round(total * 100);
  const currency = config?.currency || "usd";

  // Handle fulfillment change
  const handleFulfillmentChange = (type: "express" | "doorstep") => {
    setFulfillment(type);
    if (type === "doorstep") {
      setShowAddress(true);
    } else {
      setShowAddress(false);
    }
  };

  // Handle continue to payment
  const handleContinue = async () => {
    if (fulfillment === "doorstep" && (!address.street || !address.city || !address.zip)) {
      alert("Please fill in your delivery address");
      return;
    }
    
    setLoading(true);
    try {
      const metadata: Record<string, string> = {
        quantity: String(quantity),
        fulfillment,
      };
      if (fulfillment === "doorstep") {
        metadata.addressStreet = address.street;
        metadata.addressCity = address.city;
        metadata.addressZip = address.zip;
      }
      const secret = await createPaymentIntent(amountInCents, metadata);
      setClientSecret(secret);
    } catch (err) {
      navigate("/checkout/failed");
    } finally {
      setLoading(false);
    }
  };

  const stripePromise = config?.publishableKey ? loadStripe(config.publishableKey) : null;

  return (
    <div className="min-h-screen w-full bg-[#080319] text-white font-['Outfit'] relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[url('/general/describmokupbg.png')] bg-repeat opacity-20" />
        <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#F70353]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#F70353]/10 blur-[120px] rounded-full" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <button
            onClick={() => clientSecret ? setClientSecret(null) : navigate(-1)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={20} className="md:w-5 md:h-5" />
          </button>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter">
            CHECK<span className="text-[#F70353] drop-shadow-[0_0_10px_rgba(247,3,83,0.5)]">OUT</span>
          </h1>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          
          {/* LEFT COLUMN - Order Summary */}
          <div className="space-y-4 md:space-y-6">
            {/* Product Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-6 md:p-8 bg-gradient-to-br from-[#F70353]/10 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="text-[#F70353]" size={20} />
                  <span className="text-sm uppercase tracking-wider text-[#F70353] font-semibold">Your Custom Design</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Product Image */}
                  <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F70353]/30 to-transparent rounded-2xl blur-xl" />
                    <div className="relative w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-2xl overflow-hidden flex items-center justify-center border-2 border-white/10">
                      <img 
                        src="/general/cup.png" 
                        alt="Mug" 
                        className="w-full h-full object-contain p-3"
                      />
                      {selectedImage && (
                        <img 
                          src={selectedImage} 
                          className="absolute w-[40%] h-[40%] top-[38%] left-[28%] object-cover mix-blend-multiply opacity-90"
                          alt="Custom print"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl md:text-2xl font-bold mb-2">AI-Generated Mug</h2>
                    <p className="text-white/40 text-sm mb-3">Premium ceramic • 11oz</p>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <span className="text-2xl font-bold text-[#F70353]">{formatAmount(UNIT_PRICE, currency)}</span>
                      <span className="text-white/30 line-through text-sm">{formatAmount(39.99, currency)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="p-6 md:p-8 border-t border-white/10">
                <label className="block text-sm font-medium text-white/60 mb-3">Quantity</label>
                <div className="flex items-center justify-between bg-black/40 rounded-2xl border border-white/10 p-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-bold text-2xl w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-6 md:p-8 border-t border-white/10 bg-gradient-to-r from-[#F70353]/5 to-transparent">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Gift size={18} className="text-[#F70353]" />
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                    <span>{formatAmount(subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span className={fulfillment === "doorstep" ? "text-white" : "text-green-400"}>
                      {fulfillment === "doorstep" ? "$5.00" : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/10">
                    <span className="font-bold text-lg">Total</span>
                    <span className="text-3xl font-black text-[#F70353]">
                      {formatAmount(total, currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="p-6 md:p-8 border-t border-white/10">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <ShieldCheck size={14} className="text-green-400" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <Star size={14} className="text-yellow-400" />
                    <span>Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <Truck size={14} className="text-blue-400" />
                    <span>Fast Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <Heart size={14} className="text-[#F70353]" />
                    <span>Satisfaction Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Fulfillment & Payment */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              
              {!clientSecret ? (
                /* Fulfillment Section */
                <div>
                  <div className="p-6 md:p-8 border-b border-white/10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Package size={18} className="text-[#F70353]" />
                      Delivery Method
                    </h3>
                    
                    <div className="space-y-3">
                      {/* Express Option */}
                      <button
                        onClick={() => handleFulfillmentChange("express")}
                        className={cn(
                          "w-full text-left p-5 rounded-2xl border-2 transition-all",
                          fulfillment === "express" 
                            ? "border-[#F70353] bg-[#F70353]/10 shadow-lg shadow-[#F70353]/20" 
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-3 rounded-xl",
                            fulfillment === "express" ? "bg-[#F70353] text-white" : "bg-white/10 text-white/60"
                          )}>
                            <Zap size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-lg">Express Printing</span>
                              <span className={fulfillment === "express" ? "text-[#F70353]" : "text-white/40"}>Free</span>
                            </div>
                            <p className="text-white/40 text-sm">Ready in 15-20 minutes • In-store pickup</p>
                          </div>
                        </div>
                      </button>

                      {/* Doorstep Option */}
                      <button
                        onClick={() => handleFulfillmentChange("doorstep")}
                        className={cn(
                          "w-full text-left p-5 rounded-2xl border-2 transition-all",
                          fulfillment === "doorstep" 
                            ? "border-[#F70353] bg-[#F70353]/10 shadow-lg shadow-[#F70353]/20" 
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-3 rounded-xl",
                            fulfillment === "doorstep" ? "bg-[#F70353] text-white" : "bg-white/10 text-white/60"
                          )}>
                            <Home size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-lg">Doorstep Delivery</span>
                              <span className={fulfillment === "doorstep" ? "text-[#F70353]" : "text-white/40"}>+$5.00</span>
                            </div>
                            <p className="text-white/40 text-sm">2-3 business days • Tracked shipping</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Address Form - Animated */}
                    <AnimatePresence>
                      {showAddress && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-2 mb-4 text-white/60">
                              <MapPin size={16} />
                              <span className="text-sm font-medium">Delivery Address</span>
                            </div>
                            <div className="space-y-3">
                              <input
                                type="text"
                                placeholder="Street Address"
                                value={address.street}
                                onChange={(e) => setAddress({...address, street: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-[#F70353]/50 outline-none transition-all"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  placeholder="City"
                                  value={address.city}
                                  onChange={(e) => setAddress({...address, city: e.target.value})}
                                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-[#F70353]/50 outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="ZIP Code"
                                  value={address.zip}
                                  onChange={(e) => setAddress({...address, zip: e.target.value})}
                                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-[#F70353]/50 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Continue Button */}
                  <div className="p-6 md:p-8">
                    <button
                      onClick={handleContinue}
                      disabled={loading}
                      className="w-full py-5 rounded-xl font-bold text-lg bg-gradient-to-r from-[#F70353] to-[#C20241] text-white shadow-lg shadow-[#F70353]/25 hover:shadow-xl hover:shadow-[#F70353]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} />
                          Continue to Payment
                        </>
                      )}
                    </button>

                    {/* Secure Checkout Note */}
                    <p className="text-center text-white/30 text-xs mt-4 flex items-center justify-center gap-2">
                      <Lock size={12} />
                      <span>Your information is secure and encrypted</span>
                    </p>
                  </div>
                </div>
              ) : (
                /* Payment Section */
                <div className="p-6 md:p-8">
                  {stripePromise && clientSecret && (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: "night",
                          variables: {
                            colorPrimary: "#F70353",
                            colorBackground: "#1a1625",
                            colorText: "#ffffff",
                            colorDanger: "#ef4444",
                            fontFamily: "Outfit, system-ui, sans-serif",
                            borderRadius: "12px",
                            spacingUnit: "4px",
                          },
                        },
                      }}
                    >
                      <PaymentForm
                        amountInCents={amountInCents}
                        currency={currency}
                        onBack={() => setClientSecret(null)}
                      />
                    </Elements>
                  )}
                </div>
              )}
            </div>

            {/* Help Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <p className="text-white/40 text-xs text-center">
                Need help? Contact our support team 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;