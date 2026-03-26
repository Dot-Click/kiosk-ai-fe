import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn.util";
import { BiArrowBack } from "react-icons/bi";
import { useImageStore } from "@/store/image.store";
import DesignDescriptionInput from "@/components/designdescriptionsidebar/designdescriptionsidebar";
import CustomButton from "@/components/common/customButton";
import { BsStars } from "react-icons/bs";
import CustomBlackButton from "@/components/common/customBlackButton";
import ChooseAiStyle from "@/components/chooseaistyle/chooseaistyle";
import { toast } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Loader } from "@/components/loader";
import { RotateCcw } from "lucide-react";

import { axios } from "@/config/axios"; // for API calls

// --- Navbar helpers copied from speakprompt.page.tsx ---

const NavbarWrapper = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <Box
    className={cn("bg-transparent absolute cursor-pointer", className)}
    onClick={onClick}
  >
    {children}
  </Box>
);

const GoBackButton = ({
  onClick,
  className,
}: {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}) => (
  <Box
    onClick={onClick}
    className={cn(
      "flex items-center cursor-pointer hover:scale-105 transition-all duration-300 relative",
      "w-[100px] h-[45px] xl:w-[120px] xl:h-[55px] 2xl:w-[140px] 2xl:h-[65px] rounded-[12px] xl:rounded-[14px] 2xl:rounded-[16px] p-[1px]",
      "shadow-[0px_4px_32px_0px_rgba(21,2,8,0.87)]",
      className
    )}
    style={{
      background:
        "conic-gradient(from 90deg at 50% 50%, rgba(240, 196, 211, 1) 0%, rgba(255, 185, 208, 0.08) 25%, rgba(240, 196, 211, 1) 60%)",
      backdropFilter: "blur(32px)",
    }}
  >
    <Center className="gap-2 xl:gap-3 2xl:gap-4 w-full h-full rounded-[12px] xl:rounded-[14px] 2xl:rounded-[16px] flex items-center bg-black px-2 py-2 xl:px-3 xl:py-3 2xl:px-4 2xl:py-4">
      <Center
        className="rounded-md gap-0 xl:rounded-lg 2xl:rounded-xl"
        style={{
          padding: "8.89px",
          background:
            "linear-gradient(180deg, rgba(247, 3, 83, 1) 0%, rgba(247, 3, 83, 0.55) 100%)",
        }}
      >
        <BiArrowBack className="size-4 xl:size-5 2xl:size-6 text-white" />
      </Center>
      <Flex
        className="text-white font-normal uppercase text-base xl:text-lg 2xl:text-xl"
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "16px",
          lineHeight: "1.26em",
          letterSpacing: "0.03em",
        }}
      >
        Back
      </Flex>
    </Center>
  </Box>
);

const DescribeDesignNavbar = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box className="absolute items-center  gap-2 text-red-400 font-bold top-8 xl:top-10 2xl:top-12 left-26 max-lg:left-10 max-md:left-10 max-sm:left-2 xl:left-32 2xl:left-40 z-50">
        <GoBackButton onClick={() => navigate(-1)} />
      </Box>
      <NavbarWrapper className="flex items-center gap-2 justify-center text-white font-bold w-full">
        <Stack className="z-20 justify-center items-center mt-8 xl:mt-10 2xl:mt-12 p-0 gap-0 xl:gap-1 2xl:gap-2 max-sm:mt-18">
          <Flex className="gap-0 font-bold flex-col items-center justify-center text-center">
            <Flex className="gap-0">
              <h1 className="bg-clip-text text-transparent tracking-wide sm:text-[0.75rem] text-base lg:text-[1.75rem] xl:text-[1.30rem] 2xl:text-[1.60rem] p-0 m-0" style={{ backgroundImage: "linear-gradient(5deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 0%, #E5E5E1 40%, #E5E5E5 100%)" }}>
                Describe your
              </h1>
              <Box className="relative inline-flex items-center justify-center ml-2 xl:ml-3 2xl:ml-4">
                <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full" style={{ background: "radial-gradient(circle, rgba(247, 3, 83, 0.4) 0%, rgba(247, 3, 83, 0.2) 40%, transparent 70%)", filter: "blur(20px)" }} />
                <h1 className="text-[#F70353] sm:text-[1.10rem] text-xl lg:text-[2.15rem] xl:text-[1.50rem] 2xl:text-[1.80rem] p-0 relative z-10">Design</h1>
              </Box>
            </Flex>
            <p className="text-white/80 text-[12px] xl:text-[14px] 2xl:text-[16px] font-extralight tracking-widest text-center" style={{ letterSpacing: "1.6px", userSelect: "none" }}>
              Be as creative as you want! The AI will generate artwork based on your description.
            </p>
          </Flex>
        </Stack>
      </NavbarWrapper>
    </>
  );
};

const DescribeDesignPage = () => {
  const selectedImage = useImageStore((state) => state.selectedImage);
  const selectedStyle = useImageStore((state) => state.selectedStyle);
  const selectedAdditionalStyle = useImageStore((state) => state.selectedAdditionalStyle);
  const setGeneratedImages = useImageStore((state) => state.setGeneratedImages);
  const selectImageByUrl = useImageStore((state) => state.selectImageByUrl);

  const [numberOfImages, setNumberOfImages] = useState(1);
  const [promptText, setPromptText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // dynamic background switch similar to speakprompt page


  // const bgClasses = isGenerated || isLoading
  //   ? "bg-[#080319] bg-[url('/general/fdsfdahf.PNG')] bg-cover bg-center bg-no-repeat text-white relative flex flex-col overflow-x-hidden"
  //   : "bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat overflow-y-auto p-4";


  // const containerClass = `min-h-screen w-full ${bgClasses}`;


  const handleGenerate = async () => {
    if (!promptText.trim()) {
      toast.error("Please enter a description first");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Generating your designs...");

    try {
      let imageBase64 = null;
      if (selectedImage && selectedImage.startsWith("blob:")) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } else if (selectedImage) {
        imageBase64 = selectedImage;
      }

      const resp = await axios.post("/ai/generate", {
        prompt: promptText,
        style: selectedStyle,
        additionalStyle: selectedAdditionalStyle,
        count: numberOfImages,
        image: imageBase64,
      });

      const urls: string[] = resp.data.images || [];
      setImages(urls);
      setIsGenerated(true);
      setGeneratedImages(urls, promptText);
      toast.dismiss(loadingToast);
      toast.success(`Successfully generated ${urls.length} design variations!`);
    } catch (err: any) {
      console.error("generation error", err);
      toast.dismiss(loadingToast);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      toast.error(
        `Failed to generate designs. ${serverMsg ? serverMsg : "Please try again."}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = () => {
    if (images.length === 0) {
      toast.error("Please generate images first");
      return;
    }
    if (!selectedImage) {
      selectImageByUrl(images[0]);
    }
    // Navigate to apply mockup design page
    navigate("/select-methods/capture-photo/describe-design/apply-mokup-design");
  };

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/fdsfdahf.PNG')] bg-cover bg-center bg-no-repeat text-white relative flex flex-col overflow-x-hidden">
      <DescribeDesignNavbar />

      {/* MAIN CONTENT AREA - Responsive layout */}
      <main className="flex-1 mt-32 flex flex-col xl:flex-row items-start justify-between px-4 sm:px-6 lg:px-20 py-6 sm:py-10 gap-6 sm:gap-10">
        
        {/* LEFT PANEL - Text Input + Buttons */}
        <div className="w-full xl:w-[350px] flex flex-col gap-4 sm:gap-6 z-30 order-2 lg:order-1">
          <div className="backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-bold">
                Text Input
              </label>
              <div className="flex items-center gap-2">
                {promptText && (
                  <button 
                    onClick={() => setPromptText("")}
                    className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
                    title="Clear text"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <DesignDescriptionInput 
              value={promptText}
              onChange={setPromptText}
              disabled={isLoading}
            />

            {/* Variations Slider */}
            <div className="flex flex-col gap-4 mt-6 sm:mt-8">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">Number of Variations</span>
                <span className="bg-[#F70353] px-3 py-0.5 rounded-full text-xs font-bold">{numberOfImages}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="4" 
                value={numberOfImages} 
                onChange={(e) => setNumberOfImages(Number(e.target.value))} 
                className="w-full h-1.5 bg-white/10 rounded-lg accent-[#F70353]" 
                disabled={isLoading}
              />
            </div>

            <Box className="flex flex-col gap-4 w-full items-center mt-6 sm:mt-8">
              {!isGenerated ? (
                <>
                  <CustomButton
                    wrapperClassName="w-full h-[48px]"
                    className="text-[14px] sm:text-[16px] md:text-[18px]"
                    title={isLoading ? "Generating…" : "Generate"}
                    icon={isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <BsStars className="size-4 sm:size-5" />}
                    onClick={handleGenerate}
                    disabled={isLoading}
                  />
                  <CustomBlackButton
                    wrapperClassName="w-full h-[48px]"
                    className="text-[14px] sm:text-[16px] md:text-[18px]"
                    title="Proceed Without Modifications"
                    onClick={() => navigate("/select-methods/capture-photo/describe-design/apply-mokup-design")}
                    disabled={isLoading}
                  />
                </>
              ) : (
                <>
                  <CustomButton
                    wrapperClassName="w-full h-[48px] bg-indigo-600 hover:bg-indigo-700"
                    className="text-[14px] sm:text-[16px] md:text-[18px]"
                    title="Try New Design"
                    icon={<RotateCcw className="size-4 sm:size-5" />}
                    onClick={() => {
                      setImages([]);
                      setIsGenerated(false);
                      setGeneratedImages([], "");
                      setPromptText("");
                      toast.info("Ready for new design description");
                    }}
                    disabled={isLoading}
                  />
                  <CustomBlackButton
                    wrapperClassName="w-full h-[48px]"
                    className="text-[14px] sm:text-[16px] md:text-[18px]"
                    title="Proceed With Selected Design"
                    onClick={handleProceed}
                    disabled={isLoading}
                  />
                </>
              )}
            </Box>
          </div>
          
          {/* Instructions - Hidden on mobile when generated */}
          {!isGenerated && (
            <div className="text-xs text-white/50 bg-black/20 p-4 rounded-xl hidden sm:block">
              <p className="font-bold mb-2">How to use:</p>
              <p>1. Ensure your photo looks correct in the center</p>
              <p>2. Type in the text box about how I should modify it</p>
              <p>3. Choose an AI Style variation (optional)</p>
              <p>4. Click "Generate Designs"</p>
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
                <h3 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight">Generating Your Designs</h3>
                <p className="text-white/70 text-sm sm:text-base">Creating {numberOfImages} variations...</p>
                <div className="mt-4 w-48 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F70353] to-purple-500 animate-pulse w-full"></div>
                </div>
              </div>
            </div>
          ) : !isGenerated ? (
            <div className="flex flex-col items-center gap-6 sm:gap-8 px-4 w-full max-w-lg mx-auto">
              <Center
                className="relative w-full bg-black border border-white/10 shadow-[0_0_50px_rgba(247,3,83,0.15)] p-2 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-3xl overflow-hidden"
                style={{ userSelect: "none" }}
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="selected-design"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src="/general/capture-photo.png"
                    alt="placeholder"
                    className="size-48 object-cover opacity-50"
                  />
                )}
              </Center>
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight uppercase">Describe Your Modifications</h3>
                <div className="space-y-4">
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                    Type instructions on the left to tell the AI how to modify your selected photo.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* --- FULLY RESPONSIVE IMAGE GRID --- */
            <div className="w-full px-4 sm:px-0 flex flex-col items-center">
              {/* Top Meta Info Bar */}
              <div className="w-full max-w-[500px] xl:max-w-[650px] 2xl:max-w-[750px] flex justify-between items-center mb-6 gap-3">
                <span className="bg-[#F70353]/10 border border-[#F70353]/20 text-[#F70353] px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  {images.length} Design Variations
                </span>
                <button
                  onClick={() => {
                    setImages([]);
                    setIsGenerated(false);
                    setGeneratedImages([], "");
                    setPromptText("");
                    toast.info("Images cleared. Ready for new description.");
                  }}
                  className="px-4 py-1.5 rounded-lg border border-white/10 text-xs font-medium hover:bg-white/5 hover:border-white/20 transition-all text-white/50 hover:text-white"
                >
                  Clear All
                </button>
              </div>

              {/* Dynamic Grid Layout Based on Number of Images */}
              <div className={`w-full mx-auto animate-in fade-in zoom-in-95 duration-500 ${
                images.length === 1
                  ? "max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px] flex justify-center" 
                  : "max-w-[500px] xl:max-w-[650px] 2xl:max-w-[750px] grid grid-cols-2 gap-3 sm:gap-6" 
              }`}>
                {images.map((url, i) => {
                  const isSelected = selectedImage === url;
                  return (
                    <div
                      key={i}
                      className={`group relative cursor-pointer ${
                        images.length === 1 ? "w-full max-w-[600px]" : ""
                      }`}
                      onClick={() => selectImageByUrl(url)}
                    >
                      {/* Blurred Background Image for Glassmorphism */}
                      <div
                        className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden blur-sm opacity-30"
                        style={{
                          backgroundImage: `url(${url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />

                      {/* Main Image Container */}
                      <div
                        className={`relative rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                          images.length === 1
                            ? "h-auto max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px]" 
                            : "aspect-square" 
                        } ${
                          isSelected
                            ? "border-[#F70353] scale-[1.03] z-10 shadow-[0_0_25px_rgba(247,3,83,0.3)]"
                            : "border-white/10 hover:border-white/30 hover:scale-[1.01]"
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Design variation ${i + 1}`}
                          className={`w-full h-full object-contain transition-transform duration-700 ${
                            images.length === 1
                              ? "group-hover:scale-105"
                              : "group-hover:scale-110"
                          }`}
                        />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Selected badge */}
                      {isSelected && (
                        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-20 bg-[#F70353] text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded sm:rounded-md font-bold uppercase tracking-wider shadow-lg animate-in zoom-in duration-200">
                          Selected
                        </div>
                      )}

                      {/* Variation number */}
                      <div className="absolute bottom-2 right-2 z-20 text-white/40 text-[9px] font-mono group-hover:text-white/80 transition-colors">
                        VAR_{i + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Side Panel */}
        <div className="w-full xl:w-[350px] flex flex-col items-stretch z-30 order-3 gap-5 mt-6 xl:mt-0">
          {/* Examples - Always show */}
          <div className="w-full p-6 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/10">
            <h4 className="font-bold mb-6 text-center text-sm tracking-tight text-white/90 uppercase tracking-[0.2em] opacity-60">Try these ideas</h4>
            <div className="space-y-3">
              {[
                { label: "Style Changes", text: "Make it look like a 90s anime", dot: "bg-amber-500" },
                { label: "Backgrounds", text: "Change the background to a sunny beach", dot: "bg-blue-500" },
                { label: "Atmosphere", text: "Make it moody and cinematic lighting", dot: "bg-pink-500" }
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => setPromptText(item.text)}
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1 cursor-pointer hover:bg-white/10 hover:border-[#F70353]/30 transition-all duration-300 group/item active:scale-95"
                >
                  <div className="flex items-center gap-2">
                     <span className={`w-1.5 h-1.5 rounded-full ${item.dot} group-hover/item:scale-125 transition-transform`} />
                     <p className="text-[10px] text-white/30 uppercase font-black group-hover/item:text-white/50 transition-colors">{item.label}</p>
                  </div>
                  <p className="text-sm text-white/80 italic font-medium group-hover/item:text-white transition-colors">"{item.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel logic kept simple; style selector moved back to the bottom */}
        </div>
      </main>

      {!isGenerated && (
        <ErrorBoundary fallback={<div className="text-red-400">Failed to load style selector.</div>}>
          <ChooseAiStyle />
        </ErrorBoundary>
      )}

      {/* Decorative background elements */}
      <div className="fixed -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F70353]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-1/2 -right-20 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
    </Box>
  );
};

export default DescribeDesignPage;
