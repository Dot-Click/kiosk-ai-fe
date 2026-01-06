import  { useState } from "react";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { cn } from "@/utils/cn.util";
import { useNavigate } from "react-router";
import { useImageStore } from "@/store/image.store";
import { 
  ChevronLeft, 
  Minus, 
  Plus, 
  ChevronUp, 
  Clock, 
  Truck, 
  CreditCard 
} from "lucide-react";
import CustomButton from "../components/common/customButton";

const Checkout = () => {
  const navigate = useNavigate();
  const selectedImage = useImageStore((state) => state.selectedImage);
  const [quantity, setQuantity] = useState(0);

  return (
    <Box 
      className="min-h-screen w-full bg-[#050111] bg-[url('/general/grid.png')] bg-repeat overflow-x-hidden p-10 text-white"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      
      {/* 1. TOP NAVBAR - Exact Design Alignment */}
      <Flex className="items-center justify-between mb-16 max-w-[1400px] mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 bg-[#130E29]/90 border border-white/10 p-1.5 pr-6 rounded-full hover:scale-105 transition-all shadow-xl"
        >
          <div className="bg-[#F70353] p-2.5 rounded-full shadow-[0_0_15px_rgba(247,3,83,0.6)]">
            <ChevronLeft className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
          <span className="text-white font-bold text-[11px] tracking-[0.2em]">BACK</span>
        </button>

        <h1 className="text-4xl font-bold tracking-tight">
          Check <span className="text-[#F70353] drop-shadow-[0_0_15px_rgba(247,3,83,0.5)]">Out</span>
        </h1>
        <div className="w-[120px]" /> {/* Spacer for centering */}
      </Flex>

      {/* 2. MAIN CARDS LAYOUT */}
      <Flex className="justify-center gap-10 items-stretch max-w-[1400px] mx-auto">
        
        {/* LEFT SECTION: ORDER SUMMARY (using checkoutleft.png) */}
        <Box 
          className="w-[520px] bg-no-repeat bg-[length:100%_100%] p-10 flex flex-col shadow-2xl"
          style={{ backgroundImage: "url('/general/checkooutleft.png')" }}
        >
          <h2 className="text-2xl font-semibold mb-8 tracking-wide">Order Summary</h2>

          {/* Recessed Product Tray */}
          <Box className="bg-[#151515]/80 rounded-[35px] p-6 flex items-center gap-6 border border-white/5 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] mb-8">
            <div className="w-28 h-28 relative    flex items-center justify-center  ">
               <img src="/general/cup.png" alt="Mug" className="w-full h-full object-contain p-2" />
               {selectedImage && (
                 <img src={selectedImage} className="absolute w-[45%] h-[45%] top-[35%] left-[25%] object-cover opacity-90 mix-blend-multiply" />
               )}
            </div>
            <div className="space-y-1">
              <p className="text-xl font-medium leading-tight">Custom AI Mug Print</p>
              <p className="text-white/40 text-sm">Size: Standard (Customizable)</p>
            </div>
          </Box>

          {/* Controls Row - Quantity & Size */}
          <Flex className="gap-4 mb-auto">
            <Flex className="bg-[#151515]/80 rounded-[22px] px-5 py-3.5 items-center gap-4 border border-white/5 flex-1 justify-between shadow-inner">
              <span className="text-white/40 text-[13px] font-medium">Quantity:</span>
              <Flex className="items-center gap-4">
                <button onClick={() => setQuantity(q => Math.max(0, q-1))} className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"><Minus size={16} className="text-white/60"/></button>
                <span className="text-xl font-bold min-w-[20px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"><Plus size={16} className="text-white/60"/></button>
              </Flex>
            </Flex>

            <Flex className="bg-[#151515]/80 rounded-[22px] px-5 py-3.5 items-center justify-between w-[150px] border border-white/5 shadow-inner">
              <span className="text-white/40 text-[13px] font-medium">Size:</span>
              <Box className="bg-white/5 p-1.5 rounded-lg border border-white/10">
                <ChevronUp className="text-white/60" size={18} />
              </Box>
            </Flex>
          </Flex>
          

          {/* Pricing Bottom Area */}
          <div className="space-y-4 pt-10 mt-10">
            <div className="h-[1px] bg-white/10 my-4" />

            <Flex className="justify-between text-white/40 font-medium text-sm">
              <span>Subtotal</span>
              <span className="text-white/70">$29.99</span>
            </Flex>
            <Flex className="justify-between text-white/40 font-medium text-sm">
              <span>Tax</span>
              <span className="text-white/70">$0.00</span>
            </Flex>
            <div className="h-[1px] bg-white/10 my-4" />
            <Flex className="justify-between items-baseline">
              <span className="text-2xl font-bold text-white/80">Tax</span>
              <span className="text-4xl font-bold tracking-tighter">$0.00</span>
            </Flex>
          </div>
        </Box>

    {/* RIGHT SECTION: FULFILLMENT METHOD */}
<Box 
  className="w-[520px] bg-no-repeat bg-[length:100%_100%] p-10 flex flex-col shadow-2xl min-h-[620px]"
  style={{ backgroundImage: "url('/general/checkooutright.png')" }}
>
  <h2 className="text-white text-[22px] font-medium mb-8 tracking-wide font-outfit">
    Fulfillment Method
  </h2>

  {/* Express Option (Active State) */}
  <Box className="relative mb-4 cursor-pointer group">
    <div className="absolute inset-0 bg-[#F70353]/5 rounded-[24px] blur-sm" />
    <div className="relative border border-[#F70353] bg-gradient-to-r from-[#F70353]/20 to-[#1C182E]/40 rounded-[24px] p-6 flex items-center gap-6 shadow-[0_0_15px_rgba(247,3,83,0.2)]">
      <div className="text-[#F70353] filter drop-shadow-[0_0_8px_rgba(247,3,83,0.8)]">
        <Clock size={28} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-white text-lg font-normal leading-tight">Express Printing</p>
        <p className="text-white font-thin text-[15px] mt-1">Ready for pick in 15-20 minutes</p>
      </div>
    </div>
  </Box>

  {/* Doorstep Option (Standard State) */}
  <Box className="bg-[#161616] border border-white/5 rounded-[24px] p-6 mb-8 flex items-center gap-6 shadow-xl">
    <div className="text-[#B169F6] filter drop-shadow-[0_0_8px_rgba(177,105,246,0.6)]">
      <Truck size={28} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-white text-lg font-normal leading-tight">Doorstep Delivery</p>
      <p className="text-white text-[15px] font-thin mt-1">Delivered in 2-3 business days</p>
    </div>
  </Box>

  {/* Recessed Payment Tray (Darker with inner shadow) */}
  <Box 
        style={{ backgroundImage:"/general/Rectangle 19 (1.png)"}}
  className="bg-no-repeat bg-[length:100%_100%] rounded-[32px] p-8 border border-white/5 shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)]  ">
    <Flex className="items-center gap-3 mb-2">
      <div className="text-[#FFC700] filter drop-shadow-[0_0_10px_rgba(255,199,0,0.5)]">
        <CreditCard size={22} fill="currentColor" fillOpacity={0.1}/>
      </div>
      <span className="text-white text-xl font-bold">Payment</span>
    </Flex>
    
    <p className="text-white/40 text-[12px] mb-8 font-light">
      Tap your card or phone on the payment terminal below
    </p>
    
    {/* 3D Gradient Payment Button */}
    <CustomButton 
      title="Tap to Pay $29.99"
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="mr-1">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      }
      wrapperClassName="w-full h-[68px] rounded-[22px] p-[1px] bg-gradient-to-b from-white/20 to-transparent shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
      className={cn(
        "!bg-gradient-to-b !from-[#F70353] !to-[#9B0234]",
        "text-lg font-bold tracking-tight rounded-[21px] flex items-center justify-center gap-2",
        "border-t border-white/30" // This creates the 3D light-edge effect
      )}
    />
  </Box>
</Box>

      </Flex>
    </Box>
  );
};

export default Checkout;