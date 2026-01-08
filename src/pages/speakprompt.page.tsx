import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Box } from "@/components/ui/box";
import { ArrowLeft, Mic, MicOff, RotateCcw } from "lucide-react";
import { BsStars } from "react-icons/bs";
import { toast } from "sonner";

// Custom Components
import DesignDescriptionInput from "@/components/designdescriptionreadbleandeditable/designdescriptionreadbleandeditable";
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const accumulatedTranscript = useRef("");

  // Update button disabled state when transcript changes
  useEffect(() => {
    setIsButtonDisabled(!transcript.trim());
  }, [transcript]);

  // Check browser support on mount
  useEffect(() => {
    const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSpeechSupported(hasSpeechRecognition);
    
    if (!hasSpeechRecognition) {
      toast.error("Your browser doesn't support voice recognition. Please use Chrome, Edge or Safari.");
    }
  }, []);

  // --- Voice Recognition Logic ---
  useEffect(() => {
    if (!isSpeechSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Changed to false - stops after user stops speaking
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setPermissionDenied(false);
        toast.info("Listening... Speak now");
      };
      
      recognition.onresult = (event: any) => {
        console.log("Speech recognition result received");
        
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptPart = result[0].transcript;
          
          if (result.isFinal) {
            // This is a final result - user stopped speaking
            finalTranscript += transcriptPart;
          } else {
            // This is an interim result - user is still speaking
            interimTranscript += transcriptPart;
          }
        }

        // Update the accumulated transcript
        if (finalTranscript) {
          // User finished speaking, add to accumulated transcript
          accumulatedTranscript.current = (accumulatedTranscript.current + ' ' + finalTranscript).trim();
          setTranscript(accumulatedTranscript.current);
          console.log("Final transcript added:", finalTranscript);
        } else if (interimTranscript) {
          // User is still speaking, show interim results
          const currentDisplay = accumulatedTranscript.current 
            ? accumulatedTranscript.current + ' ' + interimTranscript
            : interimTranscript;
          setTranscript(currentDisplay);
          console.log("Interim transcript:", interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed' || event.error === 'audio-capture') {
          setPermissionDenied(true);
          toast.error("Microphone access denied. Please allow microphone access in browser settings.", {
            duration: 5000,
            action: {
              label: "Retry",
              onClick: () => requestMicrophonePermission()
            }
          });
        } else if (event.error === 'network') {
          toast.error("Network error occurred. Please check your connection.");
        } else if (event.error !== 'aborted') {
          toast.error(`Voice recognition error: ${event.error}`);
        }
      };
      
      recognition.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);
        accumulatedTranscript.current = transcript; // Save current transcript
        
        // Only restart if user is still supposed to be listening
        if (isListening && !permissionDenied) {
          setTimeout(() => {
            if (recognitionRef.current && isListening) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error("Error restarting recognition:", error);
              }
            }
          }, 100);
        } else if (!isGenerated && !permissionDenied) {
          toast.info("Stopped listening");
        }
      };

      recognitionRef.current = recognition;
    } catch (error: any) {
      console.error("Failed to initialize speech recognition:", error);
      toast.error("Failed to initialize voice recognition");
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [isSpeechSupported]);

  const requestMicrophonePermission = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Microphone access is not supported in this browser.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setPermissionDenied(false);
        toast.success("Microphone permission granted!");
        // Restart recognition after permission is granted
        if (recognitionRef.current) {
          startListening();
        }
      })
      .catch((error: any) => {
        console.error("Microphone permission error:", error);
        setPermissionDenied(true);
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          toast.error("Microphone permission denied. Please allow access in browser settings.");
        } else {
          toast.error("Failed to access microphone. Please check your settings.");
        }
      });
  };

  const startListening = () => {
    if (!isSpeechSupported) {
      toast.error("Voice recognition is not supported in your browser.");
      return;
    }

    if (permissionDenied) {
      toast.error("Microphone access was previously denied. Please allow access and try again.", {
        action: {
          label: "Allow",
          onClick: () => requestMicrophonePermission()
        }
      });
      return;
    }

    if (!recognitionRef.current) {
      toast.error("Voice recognition not available");
      return;
    }

    try {
      // First check if we have permission
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Microphone access is not supported in this browser.");
        return;
      }

      // Clear previous recognition
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }

      // Reset accumulated transcript when starting fresh
      accumulatedTranscript.current = transcript;

      // Try to start recognition
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error("Error starting recognition:", error);
          setIsListening(false);
          toast.error("Failed to start voice recognition");
        }
      }, 200);
      
      setIsListening(true);
      toast.info("Microphone activated. Start speaking...");
    } catch (error: any) {
      console.error("Error starting voice recognition:", error);
      setIsListening(false);
      
      // If permission error, show specific message
      if (error.toString().includes('Permission') || error.toString().includes('NotAllowed')) {
        setPermissionDenied(true);
        toast.error("Microphone access denied. Please allow microphone access.", {
          action: {
            label: "Allow",
            onClick: () => requestMicrophonePermission()
          }
        });
      } else {
        toast.error("Cannot access microphone. Please check permissions.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        // Save the current transcript
        accumulatedTranscript.current = transcript;
        if (!permissionDenied) {
          toast.info("Stopped listening");
        }
      } catch (error: any) {
        console.error("Error stopping voice recognition:", error);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleGenerate = () => {
    if (!transcript.trim()) {
      toast.error("Please speak or type your design description first!");
      return;
    }

    // Stop listening if active
    if (isListening) {
      stopListening();
    }

    // Show loading
    setIsLoading(true);
    setIsButtonDisabled(true);
    const loadingToast = toast.loading("Generating your designs...");

    // Simulate API call with timeout
    setTimeout(() => {
      // Generate mock images based on transcript
      const mockImages = [
        `https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=400&fit=crop&q=80&t=${Date.now()}`,
        `https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=400&h=400&fit=crop&q=80&t=${Date.now()}`,
        `https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=400&h=400&fit=crop&q=80&t=${Date.now()}`,
        `https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&q=80&t=${Date.now()}`
      ];

      // Take only the number of variations selected
      const selectedImages = mockImages.slice(0, numberOfPages);
      
      setImages(selectedImages);
      setIsGenerated(true);
      setIsLoading(false);
      
      // Update toast
      toast.dismiss(loadingToast);
      toast.success(`Successfully generated ${selectedImages.length} design variations!`);
      
    }, 1000);
  };

  const handleReset = () => {
    setTranscript("");
    accumulatedTranscript.current = "";
    setIsGenerated(false);
    setImages([]);
    setIsButtonDisabled(true);
    stopListening();
    
    toast.info("Ready for new design description");
  };

  const handleManualType = (text: string) => {
    setTranscript(text);
    accumulatedTranscript.current = text;
    // If user starts typing while listening, stop listening
    if (isListening) {
      stopListening();
    }
  };

  // Clear speech recognition history
  const clearSpeechHistory = () => {
    setTranscript("");
    accumulatedTranscript.current = "";
    // Reset the recognition to avoid old results
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          if (isListening && recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 100);
      } catch (e) {
        // Ignore errors
      }
    }
  };

  // --- UI Components ---
  const MicVisual = ({ size = "large" }: { size?: "small" | "large" }) => (
    <div className={`flex flex-col items-center justify-center gap-6 w-full animate-in fade-in zoom-in duration-500`}>
      <div className={`relative ${size === "large" ? "scale-125 lg:scale-150" : "scale-100"} flex items-center justify-center`}>
        {isListening && (
          <div className="absolute w-[130px] h-[130px] border border-[#F70353]/40 rounded-full animate-ping" />
        )}
        <div className="absolute w-[110px] h-[110px] bg-[#F70353] blur-[45px] opacity-25 rounded-full" />
        <button 
          onClick={toggleListening}
          disabled={isLoading || permissionDenied || !isSpeechSupported}
          className={`relative p-5 rounded-full shadow-lg border border-red-400/30 flex items-center justify-center transition-all ${
            permissionDenied 
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : !isSpeechSupported
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : isListening 
                  ? 'bg-red-600 animate-pulse' 
                  : isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-red-500/20 backdrop-blur-md hover:bg-red-500/30'
          }`}
          title={permissionDenied ? "Microphone permission denied. Click to allow." : !isSpeechSupported ? "Voice not supported" : ""}
        >
          {permissionDenied || !isSpeechSupported ? (
            <MicOff className="w-7 h-7 text-gray-400" />
          ) : isListening ? (
            <MicOff className="w-7 h-7 text-white" />
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}
        </button>
      </div>
      {isListening && (
        <div className="flex items-center gap-1.5 h-8">
          {[40, 90, 60, 30, 80,40,60,90,20,60,100,20,40, 90, 60, 30, 80,40,60,90,20,60,100,20].map((h, i) => (
            <div key={i} className="w-[3px] bg-[#F70353] rounded-full animate-pulse" style={{ height: `${h}%`, animationDelay: `${i*0.1}s` }} />
          ))}
        </div>
      )}
      {permissionDenied && (
        <div className="text-center text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded-full">
          Microphone permission needed
        </div>
      )}
      {!isSpeechSupported && (
        <div className="text-center text-xs text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
          Voice not supported in this browser
        </div>
      )}
    </div>
  );

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/fdsfdahf.PNG')] bg-cover bg-center bg-no-repeat text-white relative flex flex-col overflow-x-hidden">
      
      {/* HEADER */}
      <header className="w-full pt-10 px-4 sm:px-6 lg:px-10 z-50 text-center relative">
        <button 
          onClick={() => navigate(-1)} 
          className="lg:absolute left-4 lg:left-10 top-10 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/20 p-2 pr-5 rounded-xl transition-all hover:scale-105"
        >
          <div className="bg-gradient-to-b from-[#F70353] to-[#A30237] p-2 rounded-[10px]">
            <ArrowLeft className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-[11px] tracking-widest uppercase">Back</span>
        </button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight mt-12 lg:mt-0 px-4">
          How would you like to create <span className="text-[#F70353]">YOUR DESIGN?</span>
        </h1>
      </header>

      {/* MAIN CONTENT AREA - Responsive layout */}
      <main className="flex-1 flex flex-col xl:flex-row items-center justify-between px-4 sm:px-6 lg:px-20 py-6 sm:py-10 gap-6 sm:gap-10">
        
        {/* LEFT PANEL - Transcription + Manual Typing + Buttons */}
        <div className="w-full lg:w-[350px] flex flex-col gap-4 sm:gap-6 z-30 order-2 lg:order-1">
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-bold">
                {isListening ? "Voice Input (Live)" : "Text Input"}
              </label>
              <div className="flex items-center gap-2">
                {isListening && (
                  <div className="flex items-center gap-1">
                    {/* <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> */}
                    {/* <span className="text-[10px] text-green-400 font-bold">LIVE</span> */}
                  </div>
                )}
                {transcript && (
                  <button 
                    onClick={clearSpeechHistory}
                    className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
                    title="Clear text"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            {/* Use the fixed DesignDescriptionInput component */}
            <DesignDescriptionInput 
              value={transcript}
              onChange={handleManualType}
              placeholder={
                permissionDenied 
                  ? "Microphone access denied. Click allow to use voice." 
                  : isListening 
                    ? "Speaking... Your words appear here..." 
                    : "Click microphone to speak OR type here..."
              }
              disabled={isLoading}
              isListening={isListening}
              onMicClick={toggleListening}
            />

            {/* Speech status indicator */}
            {isListening && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="w-1 h-1 bg-green-500 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-green-400">
                  Listening... Speak clearly
                </span>
              </div>
            )}

            {/* Permission denied warning */}
            {permissionDenied && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-bold text-red-400">Microphone Access Required</span>
                </div>
                <p className="text-xs text-red-300/80">
                  Please allow microphone access to use voice input. Click the microphone button and allow permission when prompted.
                </p>
                <button 
                  onClick={requestMicrophonePermission}
                  className="mt-2 text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                >
                  Allow Microphone
                </button>
              </div>
            )}

            {/* Variations Slider */}
            <div className="flex flex-col gap-4 mt-6 sm:mt-8">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">Number of Variations</span>
                <span className="bg-[#F70353] px-3 py-0.5 rounded-full text-xs font-bold">{numberOfPages}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={numberOfPages} 
                onChange={(e) => setNumberOfPages(Number(e.target.value))} 
                className="w-full h-1.5 bg-white/10 rounded-lg accent-[#F70353]" 
                disabled={isLoading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-6 sm:mt-8">
              {!isGenerated ? (
                <>
                  <CustomButton 
                    wrapperClassName={`w-full h-[55px] rounded-2xl ${
                      isButtonDisabled || isLoading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : ''
                    }`}
                    title={isLoading ? "Generating..." : "Generate Designs"}
                    icon={<BsStars className="size-5" />}
                    onClick={handleGenerate}
                    disabled={isButtonDisabled || isLoading}
                  />
                  <div className="text-center text-xs text-white/40 mt-2">
                    {isButtonDisabled 
                      ? "← Speak or type description first" 
                      : `Ready to generate ${numberOfPages} variations`}
                  </div>
                </>
              ) : (
                <>
                  <CustomButton 
                    wrapperClassName="w-full h-[55px] rounded-2xl bg-indigo-600 hover:bg-indigo-700" 
                    title="Start New Design" 
                    icon={<RotateCcw className="size-5" />} 
                    onClick={handleReset}
                    disabled={isLoading}
                  />
                  <CustomBlackButton 
                    wrapperClassName="w-full h-[55px] rounded-2xl border border-white/10" 
                    title="Proceed With Selected Design" 
                    onClick={() => {
                      if (images.length > 0) {
                        navigate("/next-step", { state: { images, description: transcript } });
                      } else {
                        toast.error("No designs generated yet");
                      }
                    }}
                    disabled={images.length === 0 || isLoading}
                  />
                </>
              )}
            </div>
          </div>
          
          {/* Instructions - Hidden on mobile when generated */}
          {!isGenerated && (
            <div className="text-xs text-white/50 bg-black/20 p-4 rounded-xl hidden sm:block">
              <p className="font-bold mb-2">How to use:</p>
              <p>1. Click microphone and speak your design idea</p>
              <p>2. OR type directly in the text box</p>
              <p>3. Text appears automatically as you speak/type</p>
              <p>4. Click "Generate" to create designs</p>
            </div>
          )}
        </div>

        {/* CENTER COLUMN - Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center z-20 min-h-[400px] sm:min-h-[500px] order-1 lg:order-2 w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-[#F70353]/20 border-t-[#F70353] rounded-full animate-spin"></div>
                <BsStars className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 text-[#F70353] animate-pulse" />
              </div>
              <div className="text-center px-4">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Generating Your Designs</h3>
                <p className="text-white/70 text-sm sm:text-base">Creating {numberOfPages} variations based on:</p>
                <p className="text-[#F70353] font-medium mt-2 max-w-md text-sm sm:text-base">"{transcript.substring(0, 80)}{transcript.length > 80 ? '...' : ''}"</p>
                <div className="mt-4 w-48 sm:w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F70353] to-purple-500 animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : !isGenerated ? (
            <div className="flex flex-col items-center gap-6 sm:gap-8 px-4">
              <MicVisual size="large" />
              <div className="text-center max-w-md">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Describe Your Design</h3>
                <div className="space-y-4">
                  <p className="text-white/70 text-sm sm:text-base">
                    Click the <span className="text-[#F70353] font-bold">microphone</span> and speak naturally.
                    Your words will appear in the left panel instantly.
                  </p>
                  {/* {!permissionDenied && (
                    <div className="p-4 bg-white/5 rounded-xl hidden sm:block">
                      <p className="text-sm text-white/60 mb-2">Example phrases:</p>
                      <p className="text-white/80 text-sm">• "A modern logo for a tech startup"</p>
                      <p className="text-white/80 text-sm">• "Website header with blue gradient"</p>
                      <p className="text-white/80 text-sm">• "Business card design with geometric shapes"</p>
                    </div>
                  )} */}
                  <p className="text-white/70 text-sm sm:text-base">
                    Or simply <span className="text-blue-400 font-bold">type</span> in the left panel.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full px-4 sm:px-0">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Your Generated Designs</h2>
                  <p className="text-white/60 mt-1 text-sm">
                    Based on: "{transcript.substring(0, 60)}{transcript.length > 60 ? '...' : ''}"
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-[#F70353] px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                    {images.length} variations
                  </span>
                  <button 
                    onClick={handleReset}
                    className="px-3 sm:px-4 py-1 rounded-full border border-white/20 text-xs sm:text-sm hover:bg-white/10 transition-colors"
                  >
                    New Design
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-in zoom-in-95 duration-700">
                {images.map((url, i) => (
                  <div key={i} className="group relative">
                    <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#F70353]/50">
                      <img 
                        src={url} 
                        alt={`Design variation ${i + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/80 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                      #{i + 1}
                    </div>
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-black/90 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-black transition-colors">
                        Select This
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Side Panel */}
        <div className="w-full lg:w-[350px] flex flex-col items-center justify-center z-30 order-3 gap-4 sm:gap-6 mt-4 sm:mt-0">
          {isGenerated ? (
            <>
              <div className="p-4 sm:p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 w-full">
                <p className="text-center text-xs sm:text-sm uppercase tracking-widest text-white/30 mb-4">Modify Design</p>
                <MicVisual size="small" />
                <p className="text-center text-xs sm:text-sm text-white/60 mt-4">
                  Speak to modify or create new variations
                </p>
                
                <div className="mt-4 sm:mt-6 space-y-2">
                  <button 
                    onClick={() => setTranscript(transcript + " Make it more colorful.")}
                    className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs sm:text-sm text-left"
                  >
                    "Add more color"
                  </button>
                  <button 
                    onClick={() => setTranscript(transcript + " Make it minimal and clean.")}
                    className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs sm:text-sm text-left"
                  >
                    "Make it minimalist"
                  </button>
                  <button 
                    onClick={startListening}
                    disabled={isListening || isLoading || permissionDenied || !isSpeechSupported}
                    className={`w-full p-3 rounded-lg transition-colors text-xs sm:text-sm ${
                      isListening || isLoading || permissionDenied || !isSpeechSupported
                        ? 'bg-gray-700/50 cursor-not-allowed text-gray-400'
                        : 'bg-blue-500/20 hover:bg-blue-500/30'
                    }`}
                  >
                    {isListening ? 'Listening...' : 'Start Speaking Again'}
                  </button>
                </div>
              </div>
              
              <div className="w-full p-4 sm:p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/5">
                <h4 className="font-bold mb-3 text-center text-sm">Quick Actions</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      if (transcript) {
                        handleGenerate();
                      } else {
                        toast.error("Please add a description first");
                      }
                    }}
                    disabled={isLoading}
                    className={`w-full p-3 rounded-lg text-xs sm:text-sm transition-colors ${
                      isLoading
                        ? 'bg-gray-700/50 cursor-not-allowed text-gray-400'
                        : 'bg-green-500/20 hover:bg-green-500/30'
                    }`}
                  >
                    {isLoading ? 'Generating...' : 'Regenerate Designs'}
                  </button>
                  <button 
                    onClick={handleReset}
                    className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs sm:text-sm"
                  >
                    Start Over Completely
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full p-4 sm:p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/5">
              <h4 className="font-bold mb-4 text-center text-sm sm:text-base">Voice Commands Examples</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xs sm:text-sm text-white/60 mb-1">For logos:</p>
                  <p className="text-white/90 text-xs sm:text-sm">"Create a modern tech logo"</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xs sm:text-sm text-white/60 mb-1">For websites:</p>
                  <p className="text-white/90 text-xs sm:text-sm">"Design a website header"</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xs sm:text-sm text-white/60 mb-1">For colors:</p>
                  <p className="text-white/90 text-xs sm:text-sm">"Make it blue and white"</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/40 text-center">
                  You can also just type in the left panel if voice doesn't work
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Instructions Bottom Sheet */}
      {!isGenerated && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 p-4 z-40 sm:hidden">
          <div className="text-xs text-white/80">
            <p className="font-bold mb-1">How to use:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-[#F70353] rounded-full"></div>
                <span>Click mic to speak</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>Type in text box</span>
              </div>
              <div className="flex items-center gap-1 col-span-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Click Generate when ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative background elements */}
      <div className="fixed -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F70353]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-1/2 -right-20 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
    </Box>
  );
};

export default SpeakPrompt;