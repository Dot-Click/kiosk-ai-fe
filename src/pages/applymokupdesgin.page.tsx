import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { useImageStore } from "@/store/image.store";
import { cn } from "@/utils/cn.util";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";

const productOptions = [
  { id: "cup", label: "Cup", image: "/general/cup.png" },
  { id: "tshirt", label: "Shirt", image: "/general/tshirt.png" }, // Add tshirt.png when available
  { id: "lamp", label: "Lamp", image: "/general/lamp.svg" }, // Add lamp.png when available
];

const colorOptions = [
  { id: "no-color", name: "No Color", value: "none" },
  { id: "red", name: "Red", value: "#F70353" },
  { id: "blue", name: "Blue", value: "#3B82F6" },
  { id: "green", name: "Green", value: "#10B981" },
  { id: "yellow", name: "Yellow", value: "#EAB308" },
  { id: "purple", name: "Purple", value: "#A855F7" },
  { id: "pink", name: "Pink", value: "#EC4899" },
  { id: "orange", name: "Orange", value: "#F97316" },
  { id: "black", name: "Black", value: "#000000" },
  { id: "white", name: "White", value: "#FFFFFF" },
];

// Helper function to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Helper function to get hue rotation for color filter
const getHueRotation = (colorHex: string): number => {
  const rgb = hexToRgb(colorHex);
  if (!rgb) return 0;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = ((g - b) / (max - min)) % 6;
  } else if (max === g) {
    h = (b - r) / (max - min) + 2;
  } else {
    h = (r - g) / (max - min) + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  return h;
};

const ApplyMokupDesignPage = () => {
  const selectedImage = useImageStore((state) => state.selectedImage);
  const [selectedProduct, setSelectedProduct] = useState<string>("cup");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]); // No Color by default
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(100);
  const [cupFlip, setCupFlip] = useState<"left" | "right">("left"); // Cup flip direction
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - 10, 50));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedImage) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedImage) return;
    setImagePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-cover 3xl:bg-center bg-no-repeat overflow-y-auto p-2 xl:p-2 2xl:p-8">
      <Box className="w-full min-h-screen flex flex-row gap-4 sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12 p-2 xl:p-2 2xl:p-8 max-md:flex-col max-md:items-center max-md:justify-start max-md:py-6 max-sm:mt-30 mt-12">
       {/* Left Side - Product Options Sidebar */}
<Box className="flex flex-col items-center justify-center gap-4 xl:gap-6 2xl:gap-8 flex-shrink-0">
  <Box
    className="relative w-[310.9px] xl:w-[380px] 2xl:w-[450px] h-[410px] xl:h-[490px] 2xl:h-[590px] overflow-hidden rounded-[10px] xl:rounded-[12px] 2xl:rounded-[14px]"
    style={{ fontFamily: "Outfit, sans-serif" }}
  >
    {/* Background Frame - Set to 100% to ensure it scales perfectly */}
    <Box
      className="absolute inset-0 rounded-[10px]"
      style={{
        backgroundImage: "url('/general/productphotos.svg')",
        backgroundSize: "81% 81%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />

    {/* 1. Product Photos Header - Positioned by % for perfect gap from Top/Left */}
    <Box className="absolute z-10 left-[12%] top-[11.5%] xl:top-[11.5%] 2xl:top-[12.5%]">
      <Flex className="items-center gap-2 xl:gap-3">
        <img
          src="/general/cup.svg"
          alt="icon"
          className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 object-cover rounded shadow-sm"
        />
        <Stack className="gap-0">
          <span className="text-[10px] xl:text-[12px] 2xl:text-sm text-[#C1C1C5] leading-none  tracking-wider">
            Product
          </span>
          <span className="text-[10px] xl:text-[12px] 2xl:text-sm  text-[#C1C1C5] font-medium leading-tight">
            Photos
          </span>
        </Stack>
        <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 text-[#C1C1C5]" />
      </Flex>
    </Box>

    {/* 2. Customize Heading - Responsive vertical spacing */}
    <Box className="absolute left-[13%] top-[24%] xl:top-[25%] 2xl:top-[27%]">
      <Flex className="items-center gap-3">
        <Box className="w-7 h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 flex-shrink-0">
          <img src="/general/squre.svg" alt="square" className="w-full h-full" />
        </Box>
        <span className="text-sm xl:text-base 2xl:text-lg text-white font-light">
          Customize Your Designs:
        </span>
      </Flex>
    </Box>

   
            {/* Product Options */}
            <Box
              className="absolute
    left-[52px]  top-[160px]
    xl:left-[50px]  xl:top-[160px]
    2xl:left-[60px]  2xl:top-[212px]
    3xl:top-[160px] 2xl:w-[330px] w-[279.16px]"
              style={{
                // width: ".16px",
              }}
            >
              <Flex className="flex-col">
                {productOptions.map((product) => (
                  <Box
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={cn(
                      "cursor-pointer rounded-lg p-3 transition-all duration-200 xl:rounded-xl 2xl:rounded-2xl flex items-center gap-3 xl:gap-4 2xl:gap-5",
                      selectedProduct === product.id
                        ? "border border-[#F70353] xl:border-2 2xl:border-2"
                        : "border border-transparent hover:bg-[#29292D]/70"
                    )}
                    style={
                      selectedProduct === product.id
                        ? {
                            background: `linear-gradient(to bottom, rgba(247, 3, 83, 0.06) 0%, rgba(247, 3, 83, 0.06) 73%, rgba(23, 7, 38, 1) 100%)`,
                            borderColor: "#F70353",
                            borderWidth: "1px",
                          }
                        : {
                            background: `linear-gradient(to top, rgba(23, 7, 38, 1) 0%, rgba(23, 7, 38, 1) 73%, rgba(23, 7, 38, 1) 100%)`,
                            borderColor: "#170726",
                            borderWidth: "1px",
                          }
                    }
                  >
                    {/* Product Image */}
                    <Box className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 flex-shrink-0 rounded-lg xl:rounded-xl 2xl:rounded-2xl overflow-hidden bg-[#29292D]/50">
                      <img
                        src={product.image}
                        alt={product.label}
                        className="w-full h-full object-cover"
                      />
                    </Box>

                    {/* Product Text */}
                    <Flex className="flex-col flex-1 min-w-0">
                      <span
                        className="text-sm xl:text-base 2xl:text-lg"
                        style={{
                          fontFamily: "Outfit",
                          fontStyle: "normal",
                          fontWeight:
                            selectedProduct === product.id ? 500 : 300,
                          fontSize: "14px",
                          lineHeight: "20px",
                          color:
                            selectedProduct === product.id
                              ? "#FFFFFF"
                              : "#C1C1C5",
                        }}
                      >
                        Apply your design on {product.label}
                      </span>
                    </Flex>

                    {/* Chevron Right Icon */}
                    <ChevronRight className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-[#C1C1C5] flex-shrink-0" />
                  </Box>
                ))}
              </Flex>
            </Box>
  </Box>
</Box>
        {/* Center - Product Mockup with Image Overlay */}
        <Box className="flex-1 flex items-center justify-center min-w-0 max-md:w-full max-md:flex-1 max-md:mt-4">
          <Stack className="w-full max-w-[650px] xl:max-w-[800px] 2xl:max-w-[950px] items-center justify-center">
            <Center
              className="w-full bg-transparent p-2 xl:p-3 2xl:p-4 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[550px] 2xl:h-[650px] rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-visible relative"
              style={{ userSelect: "none" }}
            >
              {(() => {
                const currentProduct = productOptions.find(
                  (p) => p.id === selectedProduct
                );
                if (!currentProduct) return null;

                return (
                  <Box
                    className="relative w-full h-full flex items-center justify-center"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {/* Product Base Image with Color Overlay - Flippable */}
                    <Box
                      className="relative w-full h-full flex items-center justify-center"
                      style={{
                        transform: `scaleX(${cupFlip === "right" ? -1 : 1})`,
                        transformStyle: "preserve-3d",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <img
                        src={currentProduct.image}
                        alt={currentProduct.label}
                        className="w-full h-full object-contain"
                        style={{
                          filter:
                            selectedColor.value === "#FFFFFF"
                              ? "brightness(1.1)"
                              : selectedColor.value === "#000000"
                              ? "brightness(0.7)"
                              : `hue-rotate(${getHueRotation(
                                  selectedColor.value
                                )}) saturate(1.2)`,
                        }}
                      />
                      {/* Color Overlay - using mask like before */}
                      {selectedColor.value !== "none" && (
                        <Box
                          className="absolute inset-0"
                          style={{
                            backgroundColor: selectedColor.value,
                            mixBlendMode: "multiply",
                            opacity: 0.7,
                            pointerEvents: "none",
                            // Mask to cup shape - only tints the product, not background
                            maskImage: `url(${currentProduct.image})`,
                            maskSize: "contain",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                            WebkitMaskImage: `url(${currentProduct.image})`,
                            WebkitMaskSize: "contain",
                            WebkitMaskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                          }}
                        />
                      )}
                    </Box>

                    {/* User's Image Overlay - Full Cup Wrap with Flip Sync */}
                    {selectedImage && (
                      <Box
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          // Mask to cup shape - only show on cup
                          maskImage: `url(${currentProduct.image})`,
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskImage: `url(${currentProduct.image})`,
                          WebkitMaskSize: "contain",
                          WebkitMaskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          // Clip to exclude rim/inside area - allow full wrap
                          clipPath:
                            selectedProduct === "cup"
                              ? "inset(13% 0% 6% 0%)"
                              : "none",
                          overflow: "hidden",
                          // 3D perspective for cylindrical effect
                          perspective:
                            selectedProduct === "cup" ? "600px" : "none",
                          perspectiveOrigin: "50% 50%",
                          // Sync with cup flip
                          transform: `scaleX(${cupFlip === "right" ? -1 : 1})`,
                          transformStyle: "preserve-3d",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        {/* Container - Full width for wrapping around cup */}
                        <Box
                          className={cn(
                            "relative",
                            isDragging ? "cursor-grabbing" : "cursor-grab"
                          )}
                          style={{
                            // Full width to wrap around entire cup
                            width: selectedProduct === "cup" ? "100%" : "100%",
                            height: selectedProduct === "cup" ? "82%" : "100%",
                            position: "absolute",
                            top: selectedProduct === "cup" ? "13%" : "0%",
                            left: selectedProduct === "cup" ? "0%" : "0%",
                            transform: `
                              translate(${imagePosition.x}px, ${
                              imagePosition.y
                            }px) 
                              scale(${zoomScale / 100})
                            `,
                            transformOrigin: "center center",
                            transformStyle: "preserve-3d",
                            pointerEvents: "auto",
                            userSelect: "none",
                            transition: isDragging
                              ? "none"
                              : "transform 0.1s ease",
                          }}
                          onMouseDown={handleMouseDown}
                        >
                          {/* Image with cylindrical wrap - covers full cup */}
                          <img
                            src={selectedImage}
                            alt="design-overlay"
                            className="w-full h-full"
                            style={{
                              objectFit: "cover",
                              filter:
                                "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.4)) brightness(0.98) contrast(1.05)",
                              opacity: 1,
                              mixBlendMode: "normal",
                              // Cylindrical wrap - curves around entire cup surface
                              transform:
                                selectedProduct === "cup"
                                  ? `
                                  perspective(400px) 
                                  rotateY(0deg) 
                                  scaleX(1) 
                                  scaleY(1.05)
                                `
                                  : "none",
                              // Ensure image repeats/wraps around
                              willChange: "transform",
                            }}
                            draggable={false}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                );
              })()}
            </Center>
          </Stack>
        </Box>

        {/* Right Side - Color, Zoom, Rotation Controls */}
        <Box className="flex flex-col items-center justify-center gap-4 xl:gap-6 2xl:gap-8 flex-shrink-0">
          <Box
            className="relative w-[310.9px] xl:w-[380px] 2xl:w-[450px] overflow-hidden rounded-[10px] xl:rounded-[12px] 2xl:rounded-[14px]"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {/* Background with Drop Effect */}
            <Box className="absolute inset-0 rounded-[10px] bg-black" />

            {/* Content Container */}
            <Box className="relative z-10 p-6 xl:p-7 2xl:p-8 flex flex-col gap-6 xl:gap-7 2xl:gap-8">
              {/* Select Color Dropdown */}
              <Box className="flex flex-col gap-2 xl:gap-3 2xl:gap-4">
                <span
                  className="text-base xl:text-lg 2xl:text-xl"
                  style={{
                    fontFamily: "Outfit",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    marginBottom: "4px",
                  }}
                >
                  Select Color
                </span>
                <Box className="relative">
                  <Box
                    onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                    className="cursor-pointer flex items-center justify-between px-4 py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5 rounded-lg xl:rounded-xl 2xl:rounded-2xl bg-[#29292D]/50 border border-[#464646] xl:border-2 2xl:border-2 hover:bg-[#29292D]/70 transition-all"
                  >
                    <Flex className="items-center gap-3 xl:gap-4 2xl:gap-5">
                      {selectedColor.value === "none" ? (
                        <Box className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 rounded-full border-2 xl:border-[3px] 2xl:border-[3px] border-dashed border-[#464646] flex items-center justify-center">
                          <span className="text-[10px] xl:text-xs 2xl:text-sm text-[#C1C1C5]">
                            ×
                          </span>
                        </Box>
                      ) : (
                        <Box
                          className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 rounded-full border border-[#464646] xl:border-2 2xl:border-2"
                          style={{ backgroundColor: selectedColor.value }}
                        />
                      )}
                      <span
                        className="text-sm xl:text-base 2xl:text-lg"
                        style={{
                          fontFamily: "Outfit",
                          fontStyle: "normal",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "20px",
                          color: "#C1C1C5",
                        }}
                      >
                        {selectedColor.name}
                      </span>
                    </Flex>
                    {isColorDropdownOpen ? (
                      <ChevronUp className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-[#C1C1C5]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-[#C1C1C5]" />
                    )}
                  </Box>

                  {/* Dropdown Menu */}
                  {isColorDropdownOpen && (
                    <Box
                      className="absolute top-full left-0 right-0 mt-2 xl:mt-3 2xl:mt-4 rounded-lg xl:rounded-xl 2xl:rounded-2xl bg-[#29292D] border border-[#464646] xl:border-2 2xl:border-2 z-20 max-h-[200px] xl:max-h-[240px] 2xl:max-h-[280px] overflow-y-auto"
                      style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)" }}
                    >
                      {colorOptions.map((color) => (
                        <Box
                          key={color.id}
                          onClick={() => {
                            setSelectedColor(color);
                            setIsColorDropdownOpen(false);
                          }}
                          className="cursor-pointer flex items-center gap-3 xl:gap-4 2xl:gap-5 px-4 py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5 hover:bg-[#464646]/50 transition-all border-b border-[#464646]/50 last:border-b-0"
                        >
                          {color.value === "none" ? (
                            <Box className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 rounded-full border-2 xl:border-[3px] 2xl:border-[3px] border-dashed border-[#464646] flex items-center justify-center">
                              <span className="text-[10px] xl:text-xs 2xl:text-sm text-[#C1C1C5]">
                                ×
                              </span>
                            </Box>
                          ) : (
                            <Box
                              className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 rounded-full border border-[#464646] xl:border-2 2xl:border-2"
                              style={{ backgroundColor: color.value }}
                            />
                          )}
                          <span
                            className="text-sm xl:text-base 2xl:text-lg"
                            style={{
                              fontFamily: "Outfit",
                              fontStyle: "normal",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "20px",
                              color: "#C1C1C5",
                            }}
                          >
                            {color.name}
                          </span>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Zoom Scale */}
              <Box className="flex flex-col gap-2 xl:gap-3 2xl:gap-4">
                <span
                  className="text-base xl:text-lg 2xl:text-xl"
                  style={{
                    fontFamily: "Outfit",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    marginBottom: "4px",
                  }}
                >
                  Zoom Scale
                </span>
                <Flex className="items-center gap-3 xl:gap-4 2xl:gap-5">
                  <Box
                    onClick={handleZoomOut}
                    className="cursor-pointer flex items-center justify-center w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 rounded-lg xl:rounded-xl 2xl:rounded-2xl bg-[#29292D]/50 border border-[#464646] xl:border-2 2xl:border-2 hover:bg-[#29292D]/70 transition-all"
                  >
                    <Minus className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-[#C1C1C5]" />
                  </Box>
                  <Box className="flex-1 px-4 py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5 rounded-lg xl:rounded-xl 2xl:rounded-2xl bg-[#29292D]/50 border border-[#464646] xl:border-2 2xl:border-2 text-center">
                    <span
                      className="text-base xl:text-lg 2xl:text-xl"
                      style={{
                        fontFamily: "Outfit",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "20px",
                        color: "#FFFFFF",
                      }}
                    >
                      {zoomScale}%
                    </span>
                  </Box>
                  <Box
                    onClick={handleZoomIn}
                    className="cursor-pointer flex items-center justify-center w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 rounded-lg xl:rounded-xl 2xl:rounded-2xl bg-[#29292D]/50 border border-[#464646] xl:border-2 2xl:border-2 hover:bg-[#29292D]/70 transition-all"
                  >
                    <Plus className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-[#C1C1C5]" />
                  </Box>
                </Flex>
              </Box>

              {/* Cup Flip */}
              <Box className="flex flex-col gap-2 xl:gap-3 2xl:gap-4">
                <span
                  className="text-base xl:text-lg 2xl:text-xl"
                  style={{
                    fontFamily: "Outfit",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    marginBottom: "4px",
                  }}
                >
                  Cup Flip
                </span>
                <Flex className="items-center gap-3 xl:gap-4 2xl:gap-5">
                  <Box
                    onClick={() => setCupFlip("left")}
                    className={cn(
                      "cursor-pointer flex-1 px-4 py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5 rounded-lg xl:rounded-xl 2xl:rounded-2xl border xl:border-2 2xl:border-2 transition-all text-center",
                      cupFlip === "left"
                        ? "bg-[#F70353] border-[#F70353]"
                        : "bg-[#29292D]/50 border-[#464646] hover:bg-[#29292D]/70"
                    )}
                  >
                    <span
                      className="text-sm xl:text-base 2xl:text-lg"
                      style={{
                        fontFamily: "Outfit",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#FFFFFF",
                      }}
                    >
                      Left
                    </span>
                  </Box>
                  <Box
                    onClick={() => setCupFlip("right")}
                    className={cn(
                      "cursor-pointer flex-1 px-4 py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5 rounded-lg xl:rounded-xl 2xl:rounded-2xl border xl:border-2 2xl:border-2 transition-all text-center",
                      cupFlip === "right"
                        ? "bg-[#F70353] border-[#F70353]"
                        : "bg-[#29292D]/50 border-[#464646] hover:bg-[#29292D]/70"
                    )}
                  >
                    <span
                      className="text-sm xl:text-base 2xl:text-lg"
                      style={{
                        fontFamily: "Outfit",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#FFFFFF",
                      }}
                    >
                      Right
                    </span>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ApplyMokupDesignPage;
