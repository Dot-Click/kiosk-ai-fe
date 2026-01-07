import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { cn } from "@/utils/cn.util";
import { useNavigate } from "react-router";
import { useImageStore } from "@/store/image.store";
import { 
  Minus, 
  Plus, 
  ChevronUp, 
  ArrowLeft,
  Clock, 
  Truck, 
  CreditCard 
} from "lucide-react";
import CustomButton from "../components/common/customButton";

const Checkout = () => {
  const navigate = useNavigate();
  const selectedImage = useImageStore((state) => state.selectedImage);
  const [quantity, setQuantity] = useState(1);
  const [fulfillment, setFulfillment] = useState("express"); // "express" or "doorstep"

  return (
    <Box 
      className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-repeat overflow-x-hidden p-4 md:p-10 text-white"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      
     <Flex className="items-center justify-between mb-8 md:mb-16 max-w-[1400px] mx-auto">
  <button 
    onClick={() => navigate(-1)}
    className="group flex items-center gap-3 bg-black border border-[#F0C4D3] p-2 pr-5 rounded-xl hover:scale-105 transition-all duration-300 shadow-xl"
  >
    {/* The Pink/Red Icon Box - Scaled Down */}
    <div className="bg-gradient-to-b from-[#F70353] to-[#A30237] p-2 rounded-[10px] shadow-md">
      <ArrowLeft className="w-4 h-4 text-white" strokeWidth={3} />
    </div>

    {/* The Text - Scaled Down */}
    <span className="text-white font-bold text-[11px] tracking-[0.15em]">
      BACK
    </span>
  </button>

  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
    Check <span className="text-[#F70353] drop-shadow-[0_0_15px_rgba(247,3,83,0.5)]">Out</span>
  </h1>
  
  <div className="w-[60px] md:w-[120px]" /> 
</Flex>

      {/* 2. MAIN CARDS LAYOUT */}
      <Flex className="flex-col lg:flex-row justify-center gap-6 lg:gap-10 items-start max-w-[1400px] mx-auto">
        
        {/* LEFT SECTION: ORDER SUMMARY */}
        <Box 
          className="w-full lg:w-[520px] bg-no-repeat bg-cover md:bg-[length:100%_100%] p-6 md:p-10 flex flex-col shadow-2xl min-h-[500px]"
          style={{ backgroundImage: "url('/general/checkooutleft.png')" }}
        >
          <h2 className="text-2xl font-semibold mb-8 tracking-wide">Order Summary</h2>

          <Box className="bg-[#151515]/80 rounded-[25px] md:rounded-[35px] p-4 md:p-6 flex items-center gap-4 md:gap-6 border border-white/5 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] mb-6">
            <div className="w-20 h-20 md:w-28 md:h-28 relative flex items-center justify-center bg-white/5 rounded-2xl">
               <img src="/general/cup.png" alt="Mug" className="w-full h-full object-contain p-2" />
               {selectedImage && (
                 <img src={selectedImage} className="absolute w-[45%] h-[45%] top-[35%] left-[25%] object-cover opacity-90 mix-blend-multiply" />
               )}
            </div>
            <div className="space-y-1">
              <p className="text-lg md:text-xl font-medium leading-tight">Custom AI Mug Print</p>
              <p className="text-white/40 text-xs md:text-sm">Size: Standard (Customizable)</p>
            </div>
          </Box>

          <Flex className="flex-col sm:flex-row gap-4 mb-6">
            <Flex className="bg-[#151515]/80 rounded-[22px] px-5 py-3.5 items-center gap-4 border border-white/5 flex-1 justify-between shadow-inner">
              <span className="text-white text-[13px] font-medium">Quantity:</span>
              <Flex className="items-center gap-4">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"><Minus size={16}/></button>
                <span className="text-xl border border-white/20 py-1 px-3 rounded-[10px] font-bold min-w-[30px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"><Plus size={16}/></button>
              </Flex>
            </Flex>

            <Flex className="bg-[#151515]/80 rounded-[22px] px-5 py-3.5 items-center justify-between w-full sm:w-[150px] border border-white/5 shadow-inner">
              <span className="text-white text-[13px] font-light">Size:</span>
              <Box className="bg-white/5 p-1.5 rounded-lg border border-white/10">
                <ChevronUp className="text-white" size={18} />
              </Box>
            </Flex>
          </Flex>
          
          <div className="space-y-4 pt-4 border-t border-white/10 mt-auto">
            <Flex className="justify-between text-white/40 font-light text-sm">
              <span>Subtotal</span> <span className="text-white/70">${(29.99 * quantity).toFixed(2)}</span>
            </Flex>
            <Flex className="justify-between text-white/40 font-light text-sm">
              <span>Tax</span> <span className="text-white/70">$0.00</span>
            </Flex>
            <div className="h-[1px] bg-white/10 my-2" />
            <Flex className="justify-between items-baseline">
              <span className="text-2xl font-medium text-white">Total</span>
              <span className="text-3xl font-medium tracking-tighter">${(29.99 * quantity).toFixed(2)}</span>
            </Flex>
          </div>
        </Box>

        {/* RIGHT SECTION: FULFILLMENT METHOD */}
        <Box 
          className="w-full lg:w-[500px] bg-no-repeat bg-cover md:bg-[length:100%_100%] p-6 md:p-8 flex flex-col shadow-2xl rounded-[22px]"
          style={{ backgroundImage: "url('/general/Group 1410090222 (1).png')" }}
        >
          <h2 className="text-white text-[20px] font-medium mb-6 tracking-wide font-outfit">
            Fulfillment Method
          </h2>

          {/* 1. Express Printing */}
          <button 
            onClick={() => setFulfillment("express")}
            className={cn(
              "w-full text-left py-5 px-5 mb-4 flex items-center gap-5 border transition-all duration-300 rounded-2xl",
              fulfillment === "express" 
              ? "border-[#F70353] bg-[#F70353]/10 backdrop-blur-md" 
        : "border-[#6B6B6B] bg-[#171717] hover:opacity-100"
            )}
          >
            <div className={cn(
              "filter transition-all",
              fulfillment === "express" ? "text-[#F70353] drop-shadow-[0_0_8px_rgba(247,3,83,0.7)]" : "text-white/40"
            )}>
              <Clock size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white text-[17px] font-medium leading-tight">Express Printing</p>
              <p className="text-white/50 text-[12px] mt-0.5">Ready for pick in 15-20 minutes</p>
            </div>
          </button>
{/* 2. Doorstep Option + Accordion Form */}
<Box className="mb-4 ">
  <button 
    onClick={() => setFulfillment("doorstep")}
    className={cn(
      "w-full text-left py-4 px-6 flex items-center gap-5 rounded-[22px] transition-all duration-300 border",
      fulfillment === "doorstep" 
                ? "border-[#F70353] bg-[#F70353]/10 backdrop-blur-md" 
        : "border-[#6B6B6B] bg-[#171717] hover:opacity-100"
    )}
  >
    <div className={cn(
      "transition-all",
      fulfillment === "doorstep" ? "text-[#B169F6] drop-shadow-[0_0_8px_rgba(177,105,246,0.6)]" : "text-white/30"
    )}>
      <Truck size={24} strokeWidth={2} />
    </div>
    <div className="flex-1">
      <p className="text-white text-[17px] font-medium leading-tight">Doorstep Delivery</p>
      <p className="text-white/40 text-[12px] mt-0.5">Delivered in 2-3 business days</p>
    </div>
  </button>

  {/* Accordion Content - Styled exactly like the screenshot */}
  <div className={cn(
    "overflow-hidden transition-all duration-500 ease-in-out",
    fulfillment === "doorstep" ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"
  )}>
    <div className="space-y-3 px-1 pb-4">
      <input 
        type="text" 
        placeholder="Street Address" 
        className="w-full bg-[#252033]/60 border border-white/10 rounded-[22px] px-6 py-5 text-[15px] focus:outline-none focus:border-white/30 transition-all placeholder:text-white/30 font-light"
      />
      <input 
        type="text" 
        placeholder="Phone Number" 
        className="w-full bg-[#252033]/60 border border-white/10 rounded-[22px] px-6 py-5 text-[15px] focus:outline-none focus:border-white/30 transition-all placeholder:text-white/30 font-light"
      />
      <Flex className="gap-3">
        <input 
          type="text" 
          placeholder="City" 
          className="flex-[1.5] bg-[#252033]/60 border border-white/10 rounded-[22px] px-6 py-5 text-[15px] focus:outline-none focus:border-white/30 transition-all placeholder:text-white/30 font-light"
        />
        <input 
          type="text" 
          placeholder="ZIP" 
          className="flex-1 bg-[#252033]/60 border border-white/10 rounded-[22px] px-6 py-5 text-[15px] focus:outline-none focus:border-white/30 transition-all placeholder:text-white/30 font-light"
        />
      </Flex>
    </div>
  </div>
</Box>
          {/* 3. Recessed Payment Tray */}
          <Box 
            className="bg-no-repeat bg-cover md:bg-[length:100%_100%] rounded-[28px] p-5 border border-white/10 shadow-[inset_0_4px_20px_rgba(0,0,0,0.6)]"
            style={{ backgroundImage: "url('/general/checkout1.png')" }}
          >
            <Flex className="items-center gap-2.5 mb-1.5">
              <div className="text-[#FFC700] filter drop-shadow-[0_0_10px_rgba(255,199,0,0.5)]">
                <CreditCard size={18} />
              </div>
              <span className="text-white text-[18px] font-bold">Payment</span>
            </Flex>
            <p className="text-white/40 text-[11px] mb-5 font-light">
              Tap your card or phone on the payment terminal below
            </p>
            <CustomButton 
              title={`Tap to Pay $${(29.99 * quantity).toFixed(2)}`}
              icon={<CreditCard size={16} className="mr-2"/>}
              wrapperClassName="w-full h-[54px] rounded-xl p-[1px] bg-gradient-to-b from-white/20 to-transparent shadow-xl"
              className={cn(
                "!bg-gradient-to-b !from-[#F70353] !to-[#9B0234]",
                "text-[16px] font-bold rounded-[11px] flex items-center justify-center border-t border-white/30" 
              )}
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Checkout;