import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { useImageStore } from "@/store/image.store";
import { cn } from "@/utils/cn.util";
import CustomButton from "../components/common/customButton"
import CustomBlackButton from "../components/common/customBlackButton"
// import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Minus,
  Redo2,
  Undo2,
  Search,
  RotateCcw,
  Plus,
  RotateCw,
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
  const [cupFlip,] = useState<"left" | "right">("left"); 
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [zoomScale, setZoomScale] = useState(100);
  const [rotation, setRotation] = useState(0); // Design rotation
  const [objectRotation, setObjectRotation] = useState(0); // New: Object rotation
  const [isColorsOpen, setIsColorsOpen] = useState(true);
  const [isApplied, setIsApplied] = useState(false);

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

  // New: Rotate object functions
  const rotateObjectLeft = () => {
    setObjectRotation((prev) => {
      const newRotation = prev - 15;
      return newRotation < 0 ? 360 + newRotation : newRotation;
    });
  };

  const rotateObjectRight = () => {
    setObjectRotation((prev) => {
      const newRotation = prev + 15;
      return newRotation >= 360 ? newRotation - 360 : newRotation;
    });
  };

  const navigate = useNavigate();

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-cover 3xl:bg-center bg-no-repeat overflow-y-auto p-2 xl:p-2 2xl:p-8">
     
      <Box  className="w-full min-h-screen flex flex-row gap-4 sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12 p-2 xl:p-2 2xl:p-8 max-lg:flex-col max-lg:items-center items-start max-md:justify-start max-md:py-6 max-sm:mt-30 mt-30">
   
   {/* Left Side - Product Options Sidebar */}
<Box className="flex flex-col items-center ml-18 justify-start gap-1 flex-shrink-0"> 
 <Box
    className="relative mb-2 w-[310.9px] xl:w-[380px] 2xl:w-[450px] h-[410px] xl:h-[490px] 2xl:h-[590px] overflow-hidden rounded-[10px] xl:rounded-[12px] 2xl:rounded-[14px]"
    style={{ fontFamily: "Outfit, sans-serif" }}
  >
    {/* Background Frame - Set to 100% to ensure it scales perfectly */}
    <Box
      className="absolute inset-0 xl:bg-[length:81%_81%] bg-[length:90%_90%] rounded-[10px]"
      style={{
        backgroundImage: "url('/general/productphotos.svg')",
        // backgroundSize: "81% 81%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />

    {/* 1. Product Photos Header - Positioned by % for perfect gap from Top/Left */}
    <Box className="absolute z-10 xl:left-[12%] left-[10%] top-[8.5%] xl:top-[11.5%] 2xl:top-[12.5%]">
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
    left-[35px]  top-[130px]
    xl:left-[50px]  xl:top-[160px]
    2xl:left-[60px]  2xl:top-[212px]
    3xl:top-[160px] 2xl:w-[330px] xl:w-[279.16px] w-[240.16px]"
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

  {/* 2. BOTTOM SECTION: Design Card & Checkout (Reduced gaps) */}
  {selectedImage && (
    <Box className="flex flex-col gap-1 items-center w-full max-w-[350px] mx-auto">
      
      {/* Design "Tray" Card */}
      <div 
        className="relative w-[330px] h-[210px] bg-no-repeat bg-contain" 
        style={{ backgroundImage: "url('/general/applybg.png')" }}
      >
        <div className="absolute bg-[#130E29]/50 backdrop-blur-xl border border-white/10 rounded-[30px] p-4 top-[33.7%] left-[10px] right-[10px] flex items-center justify-between">
          <div className="w-[85px] h-[85px] rounded-2xl overflow-hidden border border-white/10">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <CustomButton
            title={isApplied ? "Applied" : "Apply"}
            onClick={() => setIsApplied(true)}
            wrapperClassName={cn("w-[140px] h-[52px] rounded-[18px]", isApplied && "bg-none shadow-none")}
          />
        </div>
      </div>

      {/* Checkout Button (Almost no gap from tray card) */}
      <Box className="w-full items-center text-center px-2">
        <CustomButton
          title="Continue to Checkout"
          onClick={() => navigate("/checkout")}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>}
          wrapperClassName="w-[96%] h-[60px] rounded-[25px]"
          className="text-[18px]"
        />
      </Box>

      {/* {isApplied && (
        <button onClick={() => setIsApplied(false)} className="mt-2 text-white/40 text-xs underline">
          Remove design from object
        </button>
      )} */}
    </Box>
  )}
</Box>        {/* Center - Product Mockup with Image Overlay */}
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
                    {/* Product Base Image with Color Overlay - Flippable and Rotatable */}
                    <Box
                      className="relative w-full h-full flex items-center justify-center"
                      style={{
                        transform: `
                          scaleX(${cupFlip === "right" ? -1 : 1})
                          rotate(${objectRotation}deg)
                        `,
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

                    {/* User's Image Overlay - ONLY SHOWS IF APPLIED */}
                    {selectedImage && isApplied && (
                      <Box
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          // Mask to cup shape - only show on cup
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "center", 
                          maskImage: `url(${currentProduct.image})`,
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
                          transform: `
                            scaleX(${cupFlip === "right" ? -1 : 1})
                            rotate(${objectRotation}deg)
                          `,
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
                            width: selectedProduct === "cup" ? "100%" : "100%",
                            height: selectedProduct === "cup" ? "82%" : "100%",
                            position: "absolute",
                            top: selectedProduct === "cup" ? "13%" : "0%",
                            left: selectedProduct === "cup" ? "0%" : "0%",
                            
                            // Transform includes design rotation and object rotation
                            transform: `
                              translate(${imagePosition.x}px, ${imagePosition.y}px) 
                              scale(${zoomScale / 100})
                              rotate(${rotation}deg)
                            `,
                            
                            transformOrigin: "center center",
                            transformStyle: "preserve-3d",
                            pointerEvents: "auto",
                            userSelect: "none",
                            transition: isDragging ? "none" : "transform 0.1s ease",
                          }}
                          onMouseDown={handleMouseDown}
                        >
                          {/* Image with cylindrical wrap */}
                          <img
                            src={selectedImage}
                            alt="design-overlay"
                            className="w-full h-full"
                            style={{
                              objectFit: "cover",
                              filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.4))",
                              transform: selectedProduct === "cup"
                                  ? `perspective(400px) rotateY(0deg) scaleX(1) scaleY(1.05)`
                                  : "none",
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

        {/* Right Side - Functional Controls */}
<Box className="flex flex-col items-center justify-center gap-4 mr-18 xl:gap-8 flex-shrink-0 bg-transparent">
  
  {/* 1. SELECT COLORS SECTION */}
  <Box 
    className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 rounded-[20px] border border-white/10 overflow-hidden bg-cover bg-center shadow-2xl transition-all duration-300"
    style={{ backgroundImage: "url('/general/specialbg.png')" }}
  >
    {/* Header - Toggles Dropdown */}
    <Flex 
      className="items-center justify-between mb-3 cursor-pointer select-none"
      onClick={() => setIsColorsOpen(!isColorsOpen)}
    >
      <Flex className="items-center gap-2">
        <Box className="w-5 h-5 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="5" fill="#00BED5" fillOpacity="0.8"/>
                <circle cx="8" cy="15" r="5" fill="#FF3A02" fillOpacity="0.8"/>
                <circle cx="16" cy="15" r="5" fill="#FBAF00" fillOpacity="0.8"/>
            </svg>
        </Box>
        <span className="text-white text-base font-medium">Select Colors</span>
      </Flex>
      
      <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/20">
        {isColorsOpen ? (
          <ChevronUp className="w-4 h-4 text-white" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white" />
        )}
      </button>
    </Flex>

    {/* Color List Container */}
    <Box 
      className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isColorsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <Box className="rounded-xl overflow-hidden border border-white/10 mt-1">
        {[
          { name: "Conquelicot", hex: "#FF3A02" },
          { name: "Arlequin", hex: "#70E22B" },
          { name: "Violet", hex: "#9C04ED" },
          { name: "Purple", hex: "#6B1BFF" },
          { name: "Chrome", hex: "#FBAF00" },
          { name: "Blaze", hex: "#FF6E01" },
          { name: "Turquoise", hex: "#00BED5" },
          { name: "Chestnut", hex: "#9A614D" },
        ].map((color, idx) => (
          <Flex 
            key={idx} 
            onClick={() => setSelectedColor({ id: color.name, name: color.name, value: color.hex })}
            className="px-3 py-1.5 justify-between items-center cursor-pointer hover:brightness-125 transition-all"
            style={{ backgroundColor: color.hex }}
          >
            <span className="text-white text-[10px] font-bold uppercase tracking-wider">{color.name}</span>
            <span className="text-white text-[10px] font-mono font-bold">{color.hex}</span>
          </Flex>
        ))}
      </Box>
    </Box>
  </Box>

  {/* 2. SCALE SECTION */}
  <Box 
    className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
    style={{ backgroundImage: "url('/general/bgofbg.png')" }}
  >
    <Flex className="items-center gap-3 mb-4">
       <Box className="p-3 bg-[#4A0E64] rounded-lg border border-white/10">
          <Search className="w-6 h-6 text-white" />
       </Box>
       <span className="text-white/80 text-lg font-normal">Scale</span>
    </Flex>

    <Flex className="items-center mt-10 justify-between px-2">
      <button 
        onClick={handleZoomOut}
        className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
      >
        <Minus className="w-6 h-6 text-white" />
      </button>
      
      <span className="text-white text-xl font-semibold min-w-[60px] text-center">
        {zoomScale}%
      </span>
      
      <button 
        onClick={handleZoomIn}
        className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </Flex>
  </Box>

  {/* 3. DESIGN ROTATION SECTION */}
  {/* <Box 
    className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
    style={{ backgroundImage: "url('/general/bgofbg.png')" }}
  >
    <Flex className="items-center gap-3 mb-4">
       <Box className="p-3 bg-[#401F45] rounded-lg border border-white/10">
          <RotateCcw className="w-6 h-6 text-[#F70353]" />
       </Box>
       <span className="text-white/80 text-lg font-normal">Design Rotation</span>
    </Flex>

    <Flex className="items-center mt-10 justify-between px-2">
      <button 
        onClick={() => setRotation((prev) => prev - 15)}
        className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
      >
        <Undo2 className="w-6 h-6 text-white" />
      </button>
      
      <span className="text-white text-xl font-semibold min-w-[60px] text-center">
        {rotation}°
      </span>
      
      <button 
        onClick={() => setRotation((prev) => prev + 15)}
        className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
      >
        <Redo2 className="w-6 h-6 text-white" />
      </button>
    </Flex>
  </Box> */}

  {/* 4. OBJECT ROTATION SECTION - NEW */}
  <Box 
    className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
    style={{ backgroundImage: "url('/general/bgofbg.png')" }}
  >
    <Flex className="items-center gap-3 mb-4">
       <Box className="p-3 bg-[#2D1B45] rounded-lg border border-white/10">
          <RotateCw className="w-6 h-6 text-[#00BED5]" />
       </Box>
       <span className="text-white/80 text-lg font-normal">Object Rotation</span>
    </Flex>

    <Flex className="items-center mt-10 justify-between px-2">
      <button 
        onClick={rotateObjectLeft}
        className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
      >
        <Undo2 className="w-6 h-6 text-white" />
      </button>
      
      <span className="text-white text-xl font-semibold min-w-[60px] text-center">
        {objectRotation}°
      </span>
      
      <button 
        onClick={rotateObjectRight}
        className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
      >
        <Redo2 className="w-6 h-6 text-white" />
      </button>
    </Flex>
  </Box>

</Box>

       
      </Box>

      {isApplied && (
  
     <div className="absolute lg:top-[140px] top-[110px] left-[45%] z-50"> 
  <CustomBlackButton
    // wrapperClassName: 'rounded-full' makes the outer border glow pill-shaped
    wrapperClassName="w-fit px-[2px] h-[48px] rounded-full" 
    
    // className: 'rounded-full' makes the inner button pill-shaped
    className="rounded-full px-4 text-[14px] sm:text-[16px] md:text-[18px]"
    
    title="Reset"
      onClick={() => {
  setIsApplied(false);
  setRotation(0); 
  setObjectRotation(0); // Also reset object rotation
  setZoomScale(100); 
  setImagePosition({ x: 0, y: 0 }); 
}}
    
    // Adding the Reset Icon (SVG)
    icon={
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    }
  />
</div>
  )}
    
    </Box>
  );
};

export default ApplyMokupDesignPage;