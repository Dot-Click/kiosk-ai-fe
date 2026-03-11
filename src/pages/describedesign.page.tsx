import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { useImageStore } from "@/store/image.store";
import DesignDescriptionInput from "@/components/designdescriptionsidebar/designdescriptionsidebar";
import CustomButton from "@/components/common/customButton";
import { BsStars } from "react-icons/bs";
import CustomBlackButton from "@/components/common/customBlackButton";
import ChooseAiStyle from "@/components/chooseaistyle/chooseaistyle";
import { toast } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

import { axios } from "@/config/axios"; // for API calls

const DescribeDesignPage = () => {
  const selectedImage = useImageStore((state) => state.selectedImage);
  const selectedStyle = useImageStore((state) => state.selectedStyle);
  const selectedAdditionalStyle = useImageStore((state) => state.selectedAdditionalStyle);
  const setGeneratedImages = useImageStore((state) => state.setGeneratedImages);
  const selectImageByUrl = useImageStore((state) => state.selectImageByUrl);

  const [numberOfPages, setNumberOfPages] = useState(1);
  const [promptText, setPromptText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


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
        count: numberOfPages,
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
    // Do not navigate; just show generated image versions
    toast.success("Image selected! You can now view variations below.");
  };

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat overflow-y-auto p-4">
      <Box className="w-full min-h-screen flex flex-row gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 max-md:flex-col-reverse max-md:items-center max-md:justify-start max-md:py-6 max-sm:mt-30 mt-12">
        {/* Left Side - Design Description Input */}
        <Box className="flex flex-col items-center justify-center gap-4 flex-shrink-0">
          <DesignDescriptionInput
            value={promptText}
            onChange={setPromptText}
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
                Number of Pages
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
                  {numberOfPages}
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
                    ((numberOfPages - 1) / 9) * 100
                  }%, #29292D ${
                    ((numberOfPages - 1) / 9) * 100
                  }%, #29292D 100%)`,
                  pointerEvents: "none",
                }}
              />
              <input
                type="range"
                min="1"
                max="10"
                value={numberOfPages}
                onChange={(e) => setNumberOfPages(Number(e.target.value))}
                className="number-of-pages-slider w-full relative z-10"
              />
            </Box>
          </Box>

          <Box className="flex flex-col gap-4 w-full items-center max-md:w-full max-md:max-w-[300px]">
            <CustomButton
              wrapperClassName="w-full max-w-[300px] h-[48px]"
              className="text-[14px] sm:text-[16px] md:text-[18px]"
              title="Generate"
              icon={<BsStars className="size-4 sm:size-5" />}
              onClick={handleGenerate}
              disabled={isLoading}
            />
            <CustomBlackButton
              wrapperClassName="w-full max-w-[300px] h-[48px]"
              className="text-[14px] sm:text-[16px] md:text-[18px]"
              title="Proceed With This Image!"
              onClick={handleProceed}
              disabled={!isGenerated}
            />
          </Box>
          {isGenerated && images.length > 0 && (
            <Box className="mt-4 w-full">
              <p className="text-white/70 text-sm mb-2">Variations</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative cursor-pointer"
                    onClick={() => selectImageByUrl(img)}
                  >
                    <img
                      src={img}
                      alt={`var-${idx}`}
                      className={`w-full h-auto object-cover rounded-lg border-2 transition-all ${
                        selectedImage === img
                          ? "border-[#F70353]"
                          : "border-transparent"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </Box>
          )}
        </Box>

        {/* Center - Image Display */}
        <Box className="flex-1 flex items-center justify-center min-w-0 max-md:w-full max-md:flex-1 max-md:mt-4">
          <Stack className="w-full max-w-[650px] items-center justify-center">
            <Center
              className="w-full bg-black border-2 border-[#707070]/60 p-2 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden"
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
            </Center>
          </Stack>
        </Box>
      </Box>

      <ErrorBoundary fallback={<div className="text-red-400">Failed to load style selector.</div>}>
        <ChooseAiStyle />
      </ErrorBoundary>
    </Box>
  );
};

export default DescribeDesignPage;
