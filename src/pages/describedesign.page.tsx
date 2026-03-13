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
        {/* simple title could be added here if desired */}
        <></>
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
  const bgClasses = isGenerated || isLoading
    ? "bg-[#080319] bg-[url('/general/fdsfdahf.PNG')] bg-cover bg-center bg-no-repeat text-white relative flex flex-col overflow-x-hidden"
    : "bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat overflow-y-auto p-4";
  const containerClass = `min-h-screen w-full ${bgClasses}`;


  const handleGenerate = async () => {
    if (!promptText.trim()) {
      toast.error("Please enter a description first");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Generating your designs...");

    try {
      const resp = await axios.post("/ai/generate", {
        prompt: promptText,
        style: selectedStyle,
        additionalStyle: selectedAdditionalStyle,
        count: numberOfImages,
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
    <Box className={containerClass}>
      <DescribeDesignNavbar />
      <Box className="w-full min-h-screen flex flex-row gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 max-md:flex-col-reverse max-md:items-center max-md:justify-start max-md:py-6 max-sm:mt-30 mt-12">
        {/* Left Side - Design Description Input */}
        <Box className="flex flex-col items-center justify-center gap-4 flex-shrink-0">
          <DesignDescriptionInput
            value={promptText}
            onChange={setPromptText}
            disabled={isLoading}
          />

          {/* Number of Pages Section */}
          <Box
            className="flex flex-col items-end gap-[7px] w-[311px] h-[57.43px]"
            style={{
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {/* Title and Number Box Row */}
            <Flex className="w-full items-center justify-between">
              {/* Title */}
              <span
                style={{
                  fontFamily: "Outfit",
                  fontStyle: "normal",
                  fontWeight: 300,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#FFFFFF",
                }}
              >
                Number of Images
              </span>

              {/* Number Box */}
              <Box
                className="flex items-center justify-center"
                style={{
                  width: "60px",
                  height: "30px",
                  background: "#29292D",
                  border: "1px solid #464646",
                  borderRadius: "6px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Outfit",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                  }}
                >
                  {numberOfImages}
                </span>
              </Box>
            </Flex>

            {/* Range Slider */}
            <Box
              className="relative w-full flex items-center"
              style={{ height: "14px" }}
            >
              <Box
                className="absolute w-full rounded-sm"
                style={{
                  height: "4px",
                  top: "60%",
                  transform: "translateY(-50%)",
                  background: `linear-gradient(to right, #F70353 0%, #F70353 ${
                    ((numberOfImages - 1) / 3) * 100
                  }%, #29292D ${
                    ((numberOfImages - 1) / 3) * 100
                  }%, #29292D 100%)`,
                  pointerEvents: "none",
                }}
              />
              <input
                type="range"
                min="1"
                max="4"
                value={numberOfImages}
                onChange={(e) => setNumberOfImages(Number(e.target.value))}
                className="number-of-pages-slider w-full relative z-10"
                disabled={isLoading}
              />
            </Box>
          </Box>

          <Box className="flex flex-col gap-4 w-full items-center max-md:w-full max-md:max-w-[300px]">
            {!isGenerated ? (
              <CustomButton
                wrapperClassName="w-full max-w-[300px] h-[48px]"
                className="text-[14px] sm:text-[16px] md:text-[18px]"
                title={isLoading ? "Generating…" : "Generate"}
                icon={isLoading ? <Loader className="w-4 h-4" /> : <BsStars className="size-4 sm:size-5" />}
                onClick={handleGenerate}
                disabled={isLoading}
              />
            ) : (
              <CustomButton
                wrapperClassName="w-full max-w-[300px] h-[48px] bg-indigo-600 hover:bg-indigo-700"
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
            )}
            <CustomBlackButton
              wrapperClassName="w-full max-w-[300px] h-[48px]"
              className="text-[14px] sm:text-[16px] md:text-[18px]"
              title="Proceed With Selected Design"
              onClick={handleProceed}
              disabled={!isGenerated}
            />
          </Box>
        </Box>

        {/* Center - Image Display */}
        <Box className="flex-1 flex items-center justify-center min-w-0 max-md:w-full max-md:flex-1 max-md:mt-4">
          {isGenerated && images.length > 0 ? (
            /* --- FULLY RESPONSIVE IMAGE GRID LIKE SPEAKPROMPT --- */
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
                    toast.info("Images cleared. Ready for new generation.");
                  }}
                  className="px-4 py-1.5 rounded-lg border border-white/10 text-xs font-medium hover:bg-white/5 hover:border-white/20 transition-all text-white/50 hover:text-white"
                >
                  Clear All
                </button>
              </div>

              {/* The Responsive Grid: Always 2 columns to prevent images from being "too big" on mobile */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-[500px] xl:max-w-[650px] 2xl:max-w-[750px] mx-auto animate-in fade-in zoom-in-95 duration-500">
                {images.map((url, i) => {
                  const isSelected = selectedImage === url;
                  return (
                    <div
                      key={i}
                      className="group relative cursor-pointer"
                      onClick={() => selectImageByUrl(url)}
                    >
                      {/* Image Container with Dynamic Scale and Ring Glow */}
                      <div className={`aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-300 relative ${
                        isSelected
                          ? 'border-[#F70353] scale-[1.03] z-10 shadow-[0_0_25px_rgba(247,3,83,0.3)]'
                          : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'
                      }`}>
                        <img
                          src={url}
                          alt={`Design variation ${i + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Selected badge with responsive positioning and size */}
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
          ) : (
            <Stack className="w-full max-w-[650px] items-center justify-center">
              <Center
                className="relative w-full bg-black border-2 border-[#707070]/60 p-2 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden"
                style={{ userSelect: "none" }}
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="selected-design"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src="/general/capture-photo.png"
                    alt="placeholder"
                    className="size-86 object-cover"
                  />
                )}

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <Loader className="w-16 h-16 text-white" />
                  </div>
                )}
              </Center>
            </Stack>
          )}
        </Box>
      </Box>

      <ErrorBoundary fallback={<div className="text-red-400">Failed to load style selector.</div>}>
        <ChooseAiStyle />
      </ErrorBoundary>
    </Box>
  );
};

export default DescribeDesignPage;
