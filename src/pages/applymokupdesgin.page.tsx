import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { useImageStore } from "@/store/image.store";
import { cn } from "@/utils/cn.util";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";

const productOptions = [
  { id: "cup", label: "Cup", image: "/general/cup.png" },
  { id: "tshirt", label: "T-Shirt", image: "/general/cup.png" }, // Add tshirt.png when available
  { id: "lamp", label: "Lamp", image: "/general/cup.png" }, // Add lamp.png when available
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
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-cover bg-no-repeat overflow-y-auto p-4">
      <Box className="w-full min-h-screen flex flex-row gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 max-md:flex-col max-md:items-center max-md:justify-start max-md:py-6 max-sm:mt-30 mt-12">
        {/* Left Side - Product Options Sidebar */}
        <Box className="flex flex-col items-center justify-center gap-4 flex-shrink-0">
          <Box
            className="relative w-[310.9px] h-[396.77px] overflow-hidden rounded-[10px]"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {/* Background with Drop Effect */}
            <Box
              className="absolute inset-0 rounded-[10px]"
              style={{
                backgroundImage: "url('/general/productphotos.svg')",
                // backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />

            {/* "New" Tag */}
            <Box
              className="absolute z-10"
              style={{
                left: "57.46px",
                top: "4px",
                width: "29px",
                height: "18px",
                lineHeight: "16px",
              }}
            >
              <span
                style={{
                  fontFamily: "Outfit",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "18px",
                  letterSpacing: "0.03em",
                  color: "#C1C1C5",
                }}
              >
                Product Photos
              </span>
            </Box>

            {/* Product Options */}
            <Box
              className="absolute"
              style={{
                left: "18.11px",
                top: "80.59px",
                height: "240.77px",
                width: "279.16px",
              }}
            >
              <Flex className="flex-col gap-3 p-4">
                <span
                  style={{
                    fontFamily: "Outfit",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    marginBottom: "8px",
                  }}
                >
                  Customize Your Designs:
                </span>
                {productOptions.map((product) => (
                  <Box
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={cn(
                      "cursor-pointer rounded-lg px-4 py-3 transition-all duration-200",
                      selectedProduct === product.id
                        ? "bg-[#F70353]/20 border border-[#F70353]"
                        : "bg-[#29292D]/50 border border-transparent hover:bg-[#29292D]/70"
                    )}
                  >
                    <span
                      style={{
                        fontFamily: "Outfit",
                        fontStyle: "normal",
                        fontWeight: selectedProduct === product.id ? 500 : 300,
                        fontSize: "14px",
                        lineHeight: "20px",
                        color:
                          selectedProduct === product.id
                            ? "#FFFFFF"
                            : "#C1C1C5",
                      }}
                    >
                      {product.label}
                    </span>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>

        {/* Center - Product Mockup with Image Overlay */}
        <Box className="flex-1 flex items-center justify-center min-w-0 max-md:w-full max-md:flex-1 max-md:mt-4">
          <Stack className="w-full max-w-[650px] items-center justify-center">
            <Center
              className="w-full bg-transparent p-2 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-visible relative"
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
        <Box className="flex flex-col items-center justify-center gap-4 flex-shrink-0">
          <Box
            className="relative w-[310.9px] overflow-hidden rounded-[10px]"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {/* Background with Drop Effect */}
            <Box
              className="absolute inset-0 rounded-[10px]"
              style={{
                backgroundImage: "url('/general/dropeffect.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />

            {/* Content Container */}
            <Box className="relative z-10 p-6 flex flex-col gap-6">
              {/* Select Color Dropdown */}
              <Box className="flex flex-col gap-2">
                <span
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
                    className="cursor-pointer flex items-center justify-between px-4 py-3 rounded-lg bg-[#29292D]/50 border border-[#464646] hover:bg-[#29292D]/70 transition-all"
                  >
                    <Flex className="items-center gap-3">
                      {selectedColor.value === "none" ? (
                        <Box className="w-6 h-6 rounded-full border-2 border-dashed border-[#464646] flex items-center justify-center">
                          <span className="text-[10px] text-[#C1C1C5]">×</span>
                        </Box>
                      ) : (
                        <Box
                          className="w-6 h-6 rounded-full border border-[#464646]"
                          style={{ backgroundColor: selectedColor.value }}
                        />
                      )}
                      <span
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
                      <ChevronUp className="w-4 h-4 text-[#C1C1C5]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#C1C1C5]" />
                    )}
                  </Box>

                  {/* Dropdown Menu */}
                  {isColorDropdownOpen && (
                    <Box
                      className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-[#29292D] border border-[#464646] z-20 max-h-[200px] overflow-y-auto"
                      style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)" }}
                    >
                      {colorOptions.map((color) => (
                        <Box
                          key={color.id}
                          onClick={() => {
                            setSelectedColor(color);
                            setIsColorDropdownOpen(false);
                          }}
                          className="cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-[#464646]/50 transition-all border-b border-[#464646]/50 last:border-b-0"
                        >
                          {color.value === "none" ? (
                            <Box className="w-6 h-6 rounded-full border-2 border-dashed border-[#464646] flex items-center justify-center">
                              <span className="text-[10px] text-[#C1C1C5]">
                                ×
                              </span>
                            </Box>
                          ) : (
                            <Box
                              className="w-6 h-6 rounded-full border border-[#464646]"
                              style={{ backgroundColor: color.value }}
                            />
                          )}
                          <span
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
              <Box className="flex flex-col gap-2">
                <span
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
                <Flex className="items-center gap-3">
                  <Box
                    onClick={handleZoomOut}
                    className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg bg-[#29292D]/50 border border-[#464646] hover:bg-[#29292D]/70 transition-all"
                  >
                    <Minus className="w-5 h-5 text-[#C1C1C5]" />
                  </Box>
                  <Box className="flex-1 px-4 py-3 rounded-lg bg-[#29292D]/50 border border-[#464646] text-center">
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
                      {zoomScale}%
                    </span>
                  </Box>
                  <Box
                    onClick={handleZoomIn}
                    className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg bg-[#29292D]/50 border border-[#464646] hover:bg-[#29292D]/70 transition-all"
                  >
                    <Plus className="w-5 h-5 text-[#C1C1C5]" />
                  </Box>
                </Flex>
              </Box>

              {/* Cup Flip */}
              <Box className="flex flex-col gap-2">
                <span
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
                <Flex className="items-center gap-3">
                  <Box
                    onClick={() => setCupFlip("left")}
                    className={cn(
                      "cursor-pointer flex-1 px-4 py-3 rounded-lg border transition-all text-center",
                      cupFlip === "left"
                        ? "bg-[#F70353] border-[#F70353]"
                        : "bg-[#29292D]/50 border-[#464646] hover:bg-[#29292D]/70"
                    )}
                  >
                    <span
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
                      "cursor-pointer flex-1 px-4 py-3 rounded-lg border transition-all text-center",
                      cupFlip === "right"
                        ? "bg-[#F70353] border-[#F70353]"
                        : "bg-[#29292D]/50 border-[#464646] hover:bg-[#29292D]/70"
                    )}
                  >
                    <span
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
