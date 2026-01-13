import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { cn } from "@/utils/cn.util";
import CustomButton from "../common/customButton";
import { Center } from "../ui/center";
import { additionalStyles } from "@/utils/freepik.util";
import { toast } from "sonner";

interface StyleOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
}

const styleOptions: StyleOption[] = [
  {
    id: "caricature",
    title: "Caricature",
    description: "Convert your selfie into a fun caricature portrait",
    icon: <img src="/chooseaistyle/Caricature.png" alt="caricature" />,
    iconColor: "#A855F7",
  },
  {
    id: "pencil-art",
    title: "Pencil Art",
    description: "Transform into a detailed pencil sketch portrait",
    icon: <img src="/chooseaistyle/PencilArt.png" alt="pencil-art" />,
    iconColor: "#EAB308",
  },
  {
    id: "anime",
    title: "Anime",
    description: "Transform yourself into an anime-style character",
    icon: <img src="/chooseaistyle/Anime.png.png" alt="anime" />,
    iconColor: "#EAB308",
  },
  {
    id: "pixar-disney",
    title: "Pixar/Disney 3D",
    description: "Become a Pixar or Disney 3D cartoon character",
    icon: <img src="/chooseaistyle/PixarDisney3D.png" alt="pixar-disney" />,
    iconColor: "#EC4899",
  },
  {
    id: "cyberpunk",
    title: "Cyberpunk",
    description: "Get a futuristic cyberpunk portrait",
    icon: <img src="/chooseaistyle/Cyberpunk.png" alt="cyberpunk" />,
    iconColor: "#3B82F6",
  },
  {
    id: "vintage-retro",
    title: "Vintage Retro",
    description: "Classic vintage retro sunset aesthetic",
    icon: <img src="/chooseaistyle/VintageRetro.png" alt="vintage-retro" />,
    iconColor: "#A16207",
  },
  {
    id: "cosmic-superhero",
    title: "Cosmic Superhero",
    description: "Classic vintage retro sunset aesthetic",
    icon: (
      <img src="/chooseaistyle/CosmicSuperhero.png" alt="cosmic-superhero" />
    ),
    iconColor: "#3B82F6",
  },
  {
    id: "stencil-graffiti",
    title: "Stencil Graffiti",
    description: "Street art stencil graffiti style",
    icon: (
      <img src="/chooseaistyle/StencilGraffiti.png" alt="stencil-graffiti" />
    ),
    iconColor: "#A855F7",
  },
];

const ChooseAiStyle = () => {
  const [selectedStyle, setSelectedStyle] = useState<string>("caricature");
  const [selectedAdditionalStyle, setSelectedAdditionalStyle] = useState<
    string | null
  >(null);

  return (
    <Box className="w-full mt-12 bg-[#303030] rounded-2xl p-[1px]">
      {/* Main Container with Gradient Border */}
      <Box
        className="w-full rounded-2xl p-[1px] bg-[#303030]"
        style={{
          background:
            "linear-gradient(135deg, rgba(56, 56, 56, 0) 0%, #707070 100%)",
        }}
      >
        <Box
          className="w-full h-full rounded-2xl p-6 sm:p-8 md:p-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(48, 48, 48, 0.62) 0%, #252424 100%)",
          }}
        >
          {/* Header Section */}
          <Flex className="items-center justify-between mb-8 flex-wrap gap-4">
            <Flex className="gap-0">
              <h2
                className="bg-clip-text text-transparent tracking-wide sm:text-[0.75rem] text-base lg:text-[1.75rem] xl:text-[1.50rem] font-semibold"
                style={{
                  backgroundImage:
                    "linear-gradient(5deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 0%, #E5E5E1 40%, #E5E5E5 100%)",
                }}
              >
                Choose AI
              </h2>
              <Box className="relative inline-flex items-center justify-center ml-2">
                <Box
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] lg:w-[60px] lg:h-[60px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(247, 3, 83, 0.4) 0%, rgba(247, 3, 83, 0.2) 40%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />
                <h1 className="text-[#F70353] sm:text-[1.10rem] text-xl lg:text-[2.15rem] xl:text-[1.90rem] p-0 relative z-10 font-semibold">
                  Style
                </h1>
              </Box>
            </Flex>

            {/* Apply Filter Button */}
            <CustomButton
              title="Apply Filter"
              onClick={() => console.log("Apply Filter clicked")}
              wrapperClassName="w-full max-w-[150px] h-[45px]"
              className="font-semibol tracking-widest"
            />
          </Flex>

          {/* Style Options Grid with Wrapper */}
          <Box
            className="rounded-2xl p-[1px] mb-8"
            style={{
              background:
                "linear-gradient(0deg, rgba(56, 56, 56, 0) 0%, #707070 100%)",
            }}
          >
            <Box
              className="rounded-2xl p-6"
              style={{
                background:
                  "linear-gradient(335deg, rgba(48, 48, 48, 0.62) 0%, rgba(56, 56, 56, 0.8) 100%)",
              }}
            >
              <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {styleOptions.map((style) => {
                  const isSelected = selectedStyle === style.id;

                  return (
                    <Box
                      key={style.id}
                      className={cn(
                        "relative cursor-pointer rounded-xl transition-all duration-300 hover:scale-105 active:scale-95",
                        isSelected ? "p-[1px]" : "p-[1px]"
                      )}
                      style={
                        isSelected
                          ? {
                              background:
                                "linear-gradient(135deg, rgba(247, 3, 83, 0.25) 0%, #910231 100%)",
                              boxShadow:
                                "0px 0px 2px rgba(247, 3, 83, 0.5), 0px 0px 2px rgba(247, 3, 83, 0.3), 0px 0px 2px rgba(247, 3, 83, 0.2)",
                            }
                          : {
                              background:
                                "linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #707070 100%)",
                            }
                      }
                      onClick={() => setSelectedStyle(style.id)}
                    >
                      {/* Inner Content Box */}
                      <Center
                        className={cn(
                          "rounded-xl h-full gap-4 text-start justify-start min-h-[30px]",
                          isSelected ? "p-3.5" : "p-3.5"
                        )}
                        style={{
                          background: isSelected
                            ? "linear-gradient(135deg, #591091 10%, #111111 50%, #680A60 90%)"
                            : "linear-gradient(135deg, #111111 0%, rgba(1, 1, 1, 0.5) 52%, #111111 100%)",
                        }}
                      >
                        {/* Icon */}
                        <Box className="flex-shrink-0">{style.icon}</Box>

                        {/* Content */}
                        <Flex className="flex-col text-start items-start gap-0 flex-1 min-w-0">
                          {/* Title */}
                          <h3
                            className="text-base sm:text-[16px] font-medium"
                            style={{
                              fontFamily: "Outfit, sans-serif",
                              color: "#FFFFFF",
                            }}
                          >
                            {style.title}
                          </h3>

                          {/* Description */}
                          <p
                            className="text-xs sm:text-[13px] leading-4 text-start"
                            style={{
                              fontFamily: "Outfit, sans-serif",
                              color: isSelected
                                ? "rgba(255, 255, 255, 0.8)"
                                : "#9999AE",
                              fontWeight: 300,
                            }}
                          >
                            {style.description}
                          </p>
                        </Flex>
                      </Center>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* Discover More Style Section */}
          <Box className="pt-6 border-t border-white/10">
            <Flex className="items-center justify-between mb-6 flex-wrap gap-4">
              <Flex className="gap-0">
                <h2
                  className="bg-clip-text text-transparent tracking-wide sm:text-[0.75rem] text-base lg:text-[1.75rem] xl:text-[1.50rem] font-semibold"
                  style={{
                    backgroundImage:
                      "linear-gradient(5deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 0%, #E5E5E1 40%, #E5E5E5 100%)",
                  }}
                >
                  Discover more
                </h2>
                <Box className="relative inline-flex items-center justify-center ml-2">
                  <Box
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] lg:w-[60px] lg:h-[60px] rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(247, 3, 83, 0.4) 0%, rgba(247, 3, 83, 0.2) 40%, transparent 70%)",
                      filter: "blur(20px)",
                    }}
                  />
                  <h1 className="text-[#F70353] sm:text-[1.10rem] text-xl lg:text-[2.15rem] xl:text-[1.90rem] p-0 relative z-10 font-semibold">
                    Style
                  </h1>
                </Box>
              </Flex>

              {/* Custom Button next to Discover more style */}

              <CustomButton
                title={
                  selectedAdditionalStyle
                    ? "Proceed selected style"
                    : "Apply more style"
                }
                onClick={() => {
                  if (selectedAdditionalStyle) {
                    const selectedStyleData = additionalStyles.find(
                      (style) => style.id === selectedAdditionalStyle
                    );
                    if (selectedStyleData) {
                      console.log(
                        "Processing selected style:",
                        selectedStyleData
                      );
                      // Show success toast with selected image details
                      toast.success("Style Selected!", {
                        description: `Processing "${selectedStyleData.title}" style...`,
                        duration: 3000,
                      });
                    }
                  } else {
                    toast.error("Please select an image first!", {
                      description:
                        "Click on an image from the grid below to select it.",
                      duration: 3000,
                    });
                  }
                }}
                wrapperClassName="w-full max-w-[210px] h-[45px]"
                className="font-semibol tracking-widest"
              />
            </Flex>

            {/* Additional Styles Grid */}
            <Box className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mt-6">
              {additionalStyles.map((style) => {
                const isSelected = selectedAdditionalStyle === style.id;
                return (
                  <Box
                    key={style.id}
                    className={cn(
                      "cursor-pointer rounded-xl transition-all duration-300 hover:scale-105 active:scale-95",
                      isSelected ? "p-[2px]" : "p-[1px]"
                    )}
                    onClick={() => setSelectedAdditionalStyle(style.id)}
                  >
                    <Center className="rounded-xl h-full gap-3 text-start justify-start p-3">
                      <Flex className="flex-col text-center items-center gap-1 w-full">
                        <img
                          style={
                            isSelected
                              ? {
                                  border: "1px solid #F70353",
                                  borderRadius: "25px",
                                }
                              : {
                                  background: "none",
                                  borderRadius: "20px",
                                }
                          }
                          src={style.previewUrl}
                          alt={style.title}
                        />
                        <h3
                          className="text-sm font-light w-full text-center"
                          style={{
                            fontFamily: "Outfit, sans-serif",
                            color: "#C1C1C5",
                          }}
                        >
                          {style.title}
                        </h3>
                      </Flex>
                    </Center>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChooseAiStyle;
