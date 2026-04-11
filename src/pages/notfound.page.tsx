// import { Button } from "@/components/ui/button";
// import { Center } from "@/components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { Flex } from "@/components/ui/flex";
import { useNavigate } from "react-router";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-center bg-no-repeat bg-fixed text-white relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F70353]/20 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">
        <div className="relative">
          <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter opacity-10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <img alt="404" src="/general/404.svg" className="h-40 md:h-64 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]" />
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 md:p-12 rounded-[3rem] shadow-2xl -mt-10 md:-mt-20">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-4">
            LOST IN <span className="text-[#F70353]">SPACE?</span>
          </h2>
          <p className="text-white/50 mb-8 text-sm md:text-base font-medium leading-relaxed max-w-md mx-auto uppercase tracking-wider">
            You've ventured into a terminal that doesn't exist. Let's get you back to the grid.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-10 py-5 rounded-2xl bg-[#F70353] text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-[#F70353]/90 transition-all active:scale-95 shadow-[0_15px_35px_rgba(247,3,83,0.3)]"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all active:scale-95"
            >
              Previous Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
