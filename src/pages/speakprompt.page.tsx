import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Box } from "@/components/ui/box";
import { ArrowLeft, Mic, MicOff, RotateCcw } from "lucide-react";
import { BsStars } from "react-icons/bs";
import { toast } from "sonner";

// Custom Components
import CustomButton from "@/components/common/customButton";
import CustomBlackButton from "@/components/common/customBlackButton";

const SpeakPrompt = () => {
  const navigate = useNavigate();
  const [numberOfPages, setNumberOfPages] = useState(4);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const recognitionRef = useRef<any>(null);

  // --- Voice Recognition Logic ---
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Voice recognition not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      let liveText = "";
      // Loop through results to get everything spoken so far
      for (let i = 0; i < event.results.length; i++) {
        liveText += event.results[i][0].transcript;
      }
      // UPDATE THE LEFT PANEL INPUT LIVE
      setTranscript(liveText);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleGenerate = () => {
    if (!transcript.trim()) {
      toast.error("Please provide a description first!");
      return;
    }
    if (isListening) recognitionRef.current?.stop();
    setIsLoading(true);
    
    // Simulate generation
    setTimeout(() => {
      setImages([
        "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop"
      ]);
      setIsGenerated(true);
      setIsLoading(false);
      toast.success("Designs generated!");
    }, 1500);
  };

  const MicVisual = ({ size = "large" }: { size?: "small" | "large" }) => (
    <div className="flex flex-col items-center justify-center gap-6 w-full animate-in fade-in zoom-in duration-500">
      <div className={`relative ${size === "large" ? "scale-125 lg:scale-150" : "scale-100"} flex items-center justify-center`}>
        {isListening && (
          <div className="absolute w-[130px] h-[130px] border border-[#F70353]/40 rounded-full animate-ping" />
        )}
        <div className="absolute w-[110px] h-[110px] bg-[#F70353] blur-[45px] opacity-25 rounded-full" />
        <button 
          onClick={toggleListening}
          className={`relative p-5 rounded-full shadow-lg border border-red-400/30 flex items-center justify-center transition-all ${
            isListening ? 'bg-red-600 animate-pulse' : 'bg-red-500/20 backdrop-blur-md hover:bg-red-500/30'
          }`}
        >
          {isListening ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white fill-white" />}
        </button>
      </div>
      {isListening && (
        <div className="flex items-center gap-1.5 h-8">
          {[40, 90, 60, 30, 80].map((h, i) => (
            <div key={i} className="w-[3px] bg-[#F70353] rounded-full animate-pulse" style={{ height: `${h}%`, animationDelay: `${i*0.1}s` }} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/fdsfdahf.PNG')] bg-cover bg-center bg-no-repeat text-white relative flex flex-col overflow-x-hidden">
      
      {/* HEADER */}
      <header className="w-full pt-10 px-6 lg:px-10 z-50 text-center relative">
        <button onClick={() => navigate(-1)} className="lg:absolute left-10 top-10 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/20 p-2 pr-5 rounded-xl transition-all hover:scale-105">
          <div className="bg-gradient-to-b from-[#F70353] to-[#A30237] p-2 rounded-[10px]"><ArrowLeft className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold text-[11px] tracking-widest uppercase">Back</span>
        </button>
        <h1 className="text-2xl lg:text-4xl font-bold uppercase tracking-tight mt-12 lg:mt-0">
          How would you like to create <span className="text-[#F70353] drop-shadow-[0_0_10px_rgba(247,3,83,0.5)]">YOUR DESIGN?</span>
        </h1>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-10 gap-10">
        
        {/* LEFT PANEL - THE INPUT SECTION */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 z-30 order-2 lg:order-1">
          <div className="bg-black/30 backdrop-blur-xl rounded-[32px] p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-bold">Transcription / Prompt</label>
              {isListening && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-green-400 font-bold">LIVE</span>
                </div>
              )}
            </div>
            
            {/* TEXTAREA BOUND TO TRANSCRIPT STATE */}
            <div className="relative">
              <textarea 
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={isListening ? "Listening... start speaking..." : "Click microphone to speak or type here manually..."}
                className="w-full h-48 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-[#F70353]/50 transition-all resize-none text-sm leading-relaxed"
              />
              {!isListening && transcript && (
                <button 
                  onClick={() => setTranscript("")}
                  className="absolute bottom-3 right-3 text-[10px] text-white/40 hover:text-white underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* VARIATIONS SLIDER */}
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">Number of Variations</span>
                <span className="bg-[#F70353] px-3 py-0.5 rounded-full text-xs font-bold">{numberOfPages}</span>
              </div>
              <input type="range" min="1" max="10" value={numberOfPages} onChange={(e) => setNumberOfPages(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F70353]" />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3 mt-8">
              {!isGenerated ? (
                <CustomButton 
                  wrapperClassName="w-full h-[55px] rounded-2xl" 
                  title={isLoading ? "Generating..." : "Generate Designs"} 
                  icon={<BsStars className="size-5" />} 
                  onClick={handleGenerate} 
                  disabled={isLoading}
                />
              ) : (
                <CustomButton 
                  wrapperClassName="w-full h-[55px] rounded-2xl bg-indigo-600" 
                  title="Speak New Description" 
                  icon={<RotateCcw className="size-5" />} 
                  onClick={() => { setIsGenerated(false); setTranscript(""); toggleListening(); }} 
                />
              )}
              <CustomBlackButton 
                wrapperClassName="w-full h-[55px] rounded-2xl border border-white/10" 
                title="Proceed With Design" 
                onClick={() => navigate("/next")} 
              />
            </div>
          </div>
        </div>

        {/* CENTER COLUMN - Mic (Initial) or Images (Generated) */}
        <div className="flex-1 flex items-center justify-center z-20 min-h-[450px] order-1 lg:order-2 w-full">
          {!isGenerated ? (
            <MicVisual size="large" />
          ) : (
            <div className="grid grid-cols-2 gap-5 w-full max-w-[550px] animate-in zoom-in-95 duration-700">
              {images.map((url, i) => (
                <div key={i} className="aspect-square rounded-[24px] overflow-hidden border border-white/10 shadow-2xl transition-transform hover:scale-105">
                  <img src={url} alt="Generated" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Mic moves here after generation */}
        <div className="w-full lg:w-[350px] flex items-center justify-center z-30 order-3">
          {isGenerated ? (
            <div className="p-8 bg-black/20 backdrop-blur-md rounded-[32px] border border-white/5 w-full">
               <p className="text-center text-[10px] uppercase tracking-widest text-white/30 mb-6">Modify via Voice</p>
               <MicVisual size="small" />
            </div>
          ) : (
            <div className="hidden lg:block w-full" />
          )}
        </div>
      </main>

      <div className="fixed -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F70353]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
    </Box>
  );
};

export default SpeakPrompt;