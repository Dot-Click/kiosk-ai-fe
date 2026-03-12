import { useState, useEffect } from "react";
import { cn } from "@/utils/cn.util";
import { useNavigate } from "react-router";
import { useImageStore } from "@/store/image.store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Truck,
  Loader2,
  ShieldCheck,
  Package,
  ChevronLeft,
  MapPin,
  CreditCard,
  Sparkles,
  Zap,
  Home,
  Lock,
  Gift,
  Star,
  Heart,
  User,
  Eye,
  X
} from "lucide-react";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useProducts } from "@/hooks/useProducts";
import Price from "@/components/common/Price";
import { useCurrency } from "@/context/CurrencyContext";

const Checkout = () => {
  const navigate = useNavigate();
  const selectedImage = useImageStore((state) => state.selectedImage);
  const mockupImageUrl = useImageStore((state) => state.mockupImageUrl);
  const selectedProduct = useImageStore((state) => state.selectedProduct);
  const customizationDetails = useImageStore((state) => state.customizationDetails);
  const { } = useCurrency();

  // Hooks
  const {  fetchStripeConfig, createCheckoutSession } = useStripeCheckout();
  const { products } = useProducts();

  // Dynamic Product Info
  const activeProduct = products.find(p => {
    const searchCode = selectedProduct === "tshirt" ? "price-tshirt" : "price-mug";
    const searchName = selectedProduct === "tshirt" ? "t-shirt" : "mug";
    return p.code === searchCode || p.productCategory.toLowerCase().includes(searchName);
  });
  const basePrice = activeProduct?.price || (selectedProduct === "tshirt" ? 500.00 : 300.00);

  const productInfo = {
    name: selectedProduct === "tshirt" ? "AI-Generated T-Shirt" : "AI-Generated Mug",
    description: selectedProduct === "tshirt" ? "Premium Cotton • Soft Feel" : "Premium ceramic • 11oz",
    basePrice: basePrice
  };

  // State
  const [quantity, setQuantity] = useState(1);
  const [fulfillment, setFulfillment] = useState<"express" | "doorstep">("express");
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({ street: "", city: "", zip: "" });
  const [showAddress, setShowAddress] = useState(false);
  const [showDesignPreview, setShowDesignPreview] = useState(false);

  useEffect(() => {
    fetchStripeConfig();
  }, [fetchStripeConfig]);

  // Calculations
  const subtotal = productInfo.basePrice * quantity;
  const shippingCost = fulfillment === "doorstep" ? 5 : 0;
  const total = subtotal + shippingCost;


  // Handle fulfillment change
  const handleFulfillmentChange = (type: "express" | "doorstep") => {
    setFulfillment(type);
    setShowAddress(type === "doorstep");
  };

  // Handle Payment
  const handlePay = async () => {
    // Validation
    if (!contactInfo.name || !contactInfo.phone) {
      alert("Please fill in your name and phone number");
      return;
    }

    if (fulfillment === "doorstep") {
      if (!contactInfo.email) {
        alert("Email is required for doorstep delivery");
        return;
      }
      if (!address.street || !address.city || !address.zip) {
        alert("Please fill in your delivery address");
        return;
      }
    }

    setLoading(true);
    try {
      const checkoutData = {
        items: [{
          name: productInfo.name,
          quantity,
          price: productInfo.basePrice * 100, // cents
          image: mockupImageUrl || selectedImage,
          customization: customizationDetails ? {
            color: customizationDetails.color,
            colorName: customizationDetails.colorName,
            designPosition: customizationDetails.position,
            designScale: customizationDetails.scale,
            ...(customizationDetails.cupOffset !== undefined ? { cupOffset: customizationDetails.cupOffset } : {}),
            originalDesign: selectedImage
          } : undefined
        }],
        customer: {
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone
        },
        fulfillment: {
          method: fulfillment,
          address: fulfillment === 'doorstep' ? address : undefined
        }
      };

      const url = await createCheckoutSession(checkoutData);
      window.location.href = url;

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to start payment");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080319] text-white font-['Outfit'] relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[url('/general/describmokupbg.png')] bg-repeat opacity-20" />
        <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#F70353]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#F70353]/10 blur-[120px] rounded-full" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">

        {/* Header with Back Button */}
        <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/10"
          >
            <ChevronLeft size={20} className="md:w-5 md:h-5" />
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter">
            CHECK<span className="text-[#F70353] drop-shadow-[0_0_10px_rgba(247,3,83,0.5)]">OUT</span>
          </h1>
        </div>

        {/* Two Column Layout - Perfect alignment with image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">

          {/* LEFT COLUMN - Order Summary (Matches image layout) */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            {/* Product Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden">
              {/* Product Header */}
              <div className="p-5 md:p-6 lg:p-7 border-b border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="text-[#F70353]" size={16} />
                  <span className="text-xs uppercase tracking-wider text-[#F70353] font-semibold">Your Custom Design</span>
                </div>

                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F70353]/30 to-transparent rounded-xl blur-md" />
                    <div
                      className="relative w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-xl overflow-hidden flex items-center justify-center border border-white/10 group-hover:border-[#F70353]/50 transition-colors cursor-pointer"
                      onClick={() => setShowDesignPreview(true)}
                    >
                      {mockupImageUrl ? (
                        <img
                          src={mockupImageUrl}
                          alt="Custom Mockup"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <>
                          <img
                            src={selectedProduct === "tshirt" ? "/general/tshirt.png" : "/general/cup.png"}
                            alt={selectedProduct === "tshirt" ? "T-Shirt" : "Mug"}
                            className="w-full h-full object-contain p-2"
                          />
                          {selectedImage && (
                            <img
                              src={selectedImage}
                              className="absolute w-[40%] h-[40%] top-[38%] left-[28%] object-cover mix-blend-multiply opacity-90"
                              alt="Custom print"
                            />
                          )}
                        </>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="text-white w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h2 className="text-base md:text-lg font-bold mb-1">{productInfo.name}</h2>
                    <p className="text-white/40 text-xs mb-2">{productInfo.description}</p>
                    <div className="flex items-center gap-2">
                      <Price amount={productInfo.basePrice} className="text-lg md:text-xl text-[#F70353]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="p-5 md:p-6 lg:p-7 border-b border-white/10">
                <label className="block text-xs font-medium text-white/60 mb-2">Quantity</label>
                <div className="flex items-center justify-between bg-black/40 rounded-xl border border-white/10 p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-xl w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-5 md:p-6 lg:p-7 border-b border-white/10 bg-gradient-to-r from-[#F70353]/5 to-transparent">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Gift size={16} className="text-[#F70353]" />
                  Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                    <Price amount={subtotal} className="text-white/60 font-normal" />
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span className={fulfillment === "doorstep" ? "text-white" : "text-green-400"}>
                      {fulfillment === "doorstep" ? "+₹5.00" : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                    <span className="font-bold">Total</span>
                    <Price amount={total} className="text-xl text-[#F70353]" />
                  </div>
                </div>
              </div>

              {/* Trust Badges - Perfect grid as in image */}
              <div className="p-5 md:p-6 lg:p-7">
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

          {/* RIGHT COLUMN - Fulfillment & Payment (Matches image exactly) */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden">
              {/* Delivery Method Section */}
              <div className="p-5 md:p-6 lg:p-7">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Package size={16} className="text-[#F70353]" />
                  Delivery Method
                </h3>

                {/* Contact Information - Matches image layout */}
                <div className="mb-5 p-4 bg-white/5 rounded-xl border border-white/10">
                  <h4 className="text-white/60 text-xs font-medium mb-3 flex items-center gap-2">
                    <User size={14} />
                    Contact Details
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 ring-[#F70353]/50 outline-none transition-all placeholder:text-white/30"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 ring-[#F70353]/50 outline-none transition-all placeholder:text-white/30"
                      />
                      <input
                        type="email"
                        placeholder={fulfillment === "express" ? "Email (Optional)" : "Email (Required)"}
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 ring-[#F70353]/50 outline-none transition-all placeholder:text-white/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Options - Perfect alignment with image */}
                <div className="space-y-3">
                  {/* Express Option */}
                  <button
                    onClick={() => handleFulfillmentChange("express")}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all",
                      fulfillment === "express"
                        ? "border-[#F70353] bg-[#F70353]/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        fulfillment === "express" ? "bg-[#F70353] text-white" : "bg-white/10 text-white/60"
                      )}>
                        <Zap size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">Express Printing</span>
                          <span className={fulfillment === "express" ? "text-[#F70353] text-sm font-medium" : "text-white/40 text-sm"}>
                            Free
                          </span>
                        </div>
                        <p className="text-white/40 text-xs mt-0.5">Ready in 15-20 minutes • In-store pickup</p>
                      </div>
                    </div>
                  </button>

                  {/* Doorstep Option */}
                  <button
                    onClick={() => handleFulfillmentChange("doorstep")}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all",
                      fulfillment === "doorstep"
                        ? "border-[#F70353] bg-[#F70353]/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        fulfillment === "doorstep" ? "bg-[#F70353] text-white" : "bg-white/10 text-white/60"
                      )}>
                        <Home size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">Doorstep Delivery</span>
                          <span className={fulfillment === "doorstep" ? "text-[#F70353] text-sm font-medium" : "text-white/40 text-sm"}>
                            +₹5.00
                          </span>
                        </div>
                        <p className="text-white/40 text-xs mt-0.5">2-3 business days • Tracked shipping</p>
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
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-3 text-white/60">
                          <MapPin size={14} />
                          <span className="text-xs font-medium">Delivery Address</span>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Street Address"
                            value={address.street}
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 ring-[#F70353]/50 outline-none transition-all placeholder:text-white/30"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="City"
                              value={address.city}
                              onChange={(e) => setAddress({ ...address, city: e.target.value })}
                              className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 ring-[#F70353]/50 outline-none placeholder:text-white/30"
                            />
                            <input
                              type="text"
                              placeholder="ZIP Code"
                              value={address.zip}
                              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                              className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 ring-[#F70353]/50 outline-none placeholder:text-white/30"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pay Button Section */}
              <div className="p-5 md:p-6 lg:p-7 border-t border-white/10">
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-[#F70353] to-[#C20241] text-white shadow-lg shadow-[#F70353]/25 hover:shadow-xl hover:shadow-[#F70353]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Pay <Price amount={total} className="text-white inline-block ml-1" />
                    </>
                  )}
                </button>

                {/* Secure Checkout Note - Exactly as in image */}
                <p className="text-center text-white/30 text-xs mt-3 flex items-center justify-center gap-1.5">
                  <Lock size={10} />
                  <span>Your information is secure and encrypted</span>
                </p>
              </div>
            </div>

            {/* Help Card - Matches image */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <p className="text-white/40 text-xs text-center">
                Need help? Contact our support team 24/7
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Design Preview Modal */}
      <AnimatePresence>
        {showDesignPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowDesignPreview(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl p-4 max-w-md w-full max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setShowDesignPreview(false)}
                className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="flex-1 flex items-center justify-center p-6 bg-[#080319]/50 rounded-xl overflow-hidden relative min-h-[300px]">
                <img
                  src={selectedProduct === "tshirt" ? "/general/tshirt.png" : "/general/cup.png"}
                  alt={selectedProduct === "tshirt" ? "T-Shirt" : "Mug"}
                  className="w-full h-full object-contain max-h-[300px]"
                />
                {selectedImage && (
                  <img
                    src={selectedImage}
                    className="absolute w-[40%] h-[40%] top-[38%] left-[28%] object-cover mix-blend-multiply opacity-90"
                    alt="Custom print"
                  />
                )}
              </div>

              <div className="p-4 text-center">
                <h3 className="text-base font-bold mb-1">Your Custom Masterpiece</h3>
                <p className="text-white/40 text-xs">Preview of how your design will look on the {selectedProduct === "tshirt" ? "t-shirt" : "mug"}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;