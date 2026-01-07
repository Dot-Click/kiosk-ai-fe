

import { useState } from "react";
import { useNavigate } from "react-router";
import { Box } from "@/components/ui/box";
import { ArrowLeft, Mic } from "lucide-react";
import { BsStars } from "react-icons/bs";
import { toast } from "sonner";

// Custom Components
import DesignDescriptionInput from "@/components/designdescriptionsidebar/designdescriptionsidebar";
import CustomButton from "@/components/common/customButton";
import CustomBlackButton from "@/components/common/customBlackButton";

const SpeakPrompt = () => {
  const navigate = useNavigate();
  const [numberOfPages, setNumberOfPages] = useState(8);

  const handleProcessImage = () => {
    toast.success("Image processed successfully!");
    navigate("/select-methods/capture-photo/describe-design/apply-mokup-design");
  };

  return (
    <Box 
      className="min-h-screen w-full bg-[#080319] bg-[url('/general/fdsfdahf.PNG')] bg-cover bg-center bg-no-repeat text-white relative flex flex-col overflow-x-hidden overflow-y-auto"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* --- HEADER SECTION --- */}
      <header className="w-full pt-6 lg:pt-10 px-4 lg:px-10 z-50 shrink-0">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center relative">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="lg:absolute left-0 top-0 mb-6 lg:mb-0 group flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 p-2 pr-5 rounded-xl hover:scale-105 transition-all"
          >
            <div className="bg-gradient-to-b from-[#F70353] to-[#A30237] p-2 rounded-[10px]">
              <ArrowLeft className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
            <span className="text-white font-bold text-[11px] tracking-[0.15em]">BACK</span>
          </button>

          {/* Titles */}
          <div className="text-center px-2">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight uppercase leading-tight">
              How would you like to create <br className="sm:hidden" />
              <span className="text-[#F70353] drop-shadow-[0_0_15px_rgba(247,3,83,0.5)]">
                YOUR DESIGN?
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs lg:text-sm text-white/50 mt-2 font-light tracking-wide max-w-xs sm:max-w-none mx-auto">
              Choose one of the following methods to get started
            </p>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      {/* lg:flex-row turns on desktop layout at 1024px */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center relative px-6 lg:px-24 py-10 lg:py-0">
        
        {/* CENTER VISUAL: Mic and Signal 
            order-1: Keeps it at the TOP on mobile/tablet
            lg:absolute: Makes it centered on Desktop
        */}
        <div className="flex flex-col items-center justify-center z-10 pointer-events-none lg:absolute lg:inset-0 order-1 lg:order-none mb-16 lg:mb-0 translate-y-4 lg:translate-y-12 translate-x-4 lg:translate-x-5">
          
       {/* Microphone Icon & Concentric Rings Area */}
  <div className="relative mb-12 lg:mb-20 scale-100 lg:scale-125 flex items-center justify-center">
    
    {/* 1. Outer Wavy Blue Line (Simulated with irregular border-radius) */}
    {/* <div className="absolute w-[240px] h-[240px] border border-[#3b82f6]/40 rounded-[48%_52%_45%_55%/_55%_48%_52%_45%] animate-pulse" /> */}
    
    {/* 2. Two Light Red Round Lines */}
    <div className="absolute w-[120px]  
rounded-[48%_52%_45%_55%/_55%_48%_52%_45%] animate-pulse  h-[120px] border border-[#F70353]/20 rounded-full shadow-[0_0_10px_rgba(247,3,83,0.1)]" />
    <div className="absolute w-[100px]  rounded-[48%_52%_45%_55%/_55%_48%_52%_45%] animate-pulse h-[100px] border border-[#F70353]/40 rounded-full shadow-[0_0_15px_rgba(247,3,83,0.15)]" />

    {/* 3. Central Glassmorphism Glow */}
    <div className="absolute w-[110px] h-[110px] bg-[#F70353] blur-[50px] opacity-30 rounded-full" />
    
  <div className="relative p-4 bg-red-500/20 backdrop-blur-md rounded-full shadow-[0_0_50px_rgba(247,3,83,0.3)] border border-red-400/30 flex items-center justify-center ring-1 ring-white/10">
  <Mic className="w-7 h-7 text-white fill-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
</div>
  </div>

  {/* Audio Waveform Signal (Keep your existing waveform code here) */}
  <div className="flex items-center gap-2 lg:gap-3 h-14 lg:h-20 pointer-events-none">
    {[45, 50, 65, 90, 65, 50, 20, 20, 45, 45, 15, 90, 90, 45, 65, 45, 15, 20, 15].map((height, i) => (
      <div 
        key={i} 
        className="w-[5px] lg:w-[8px] bg-[#F70353] rounded-full animate-pulse" 
        style={{ 
            height: `${height}%`,
                    animationDelay: `${i * 0.12}s`,
                    boxShadow: '0 0 10px rgba(247, 3, 83, 0.4)',
                }} 
              />
            ))}
          </div>
        </div>

        {/* SIDEBAR AREA 
            order-2: Keeps it at the BOTTOM on mobile/tablet
            lg:absolute: Moves it to the left side on Desktop
        */}
        <div className="w-full lg:absolute lg:left-12 xl:left-24 lg:top-1/2 lg:-translate-y-1/2 max-w-[340px] flex flex-col gap-6 z-30 order-2 lg:order-none mt-10 lg:mt-0">
          <DesignDescriptionInput />

          {/* Number of Pages Slider */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs lg:text-sm">
              <span className="font-light text-white/80">Number of Images</span>
              <div className="bg-[#1A1A1E] border border-white/10 px-3 py-1 rounded min-w-[40px] text-center">
                {numberOfPages}
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={numberOfPages}
              onChange={(e) => setNumberOfPages(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#F70353]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <CustomButton
              wrapperClassName="w-full h-[50px] rounded-xl"
              title="Generate"
              icon={<BsStars className="size-5" />}
              onClick={handleProcessImage}
            />
            <CustomBlackButton
              wrapperClassName="w-full h-[50px] rounded-xl border border-white/10 bg-black/40 backdrop-blur-md"
              title="Proceed With This Image?"
              onClick={handleProcessImage}
            />
          </div>
        </div>
      </main>

      {/* Background Decorative Planet */}
      <div className="fixed -bottom-20 lg:-bottom-40 left-1/2 -translate-x-1/2 w-[300px] lg:w-[600px] h-[300px] bg-[#F70353]/10 blur-[100px] lg:blur-[120px] rounded-full pointer-events-none z-0" />
    </Box>
  );
};

export default SpeakPrompt;