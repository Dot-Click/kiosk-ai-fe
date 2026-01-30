// import { useState,useEffect } from "react";
// import { Box } from "@/components/ui/box";
import { Center } from "../components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { Flex } from "@/components/ui/flex";
// import { useImageStore } from "@/store/image.store";
// import { cn } from "@/utils/cn.util";
// import CustomButton from "../components/common/customButton"
// import CustomBlackButton from "../components/common/customBlackButton"
// // import { toast } from "sonner";
// import { useNavigate } from "react-router";
// import {
//   ChevronDown,
//   ChevronUp,
//   ChevronRight,
//   Minus,
//   Redo2,
//   Undo2,
//   Search,
//   Plus,
//   RotateCw,
// } from "lucide-react";

// const productOptions = [
//   { id: "cup", label: "Cup", image: "/general/cups.png" },
//   { id: "tshirt", label: "Shirt", image: "/general/tshirt.png" }, // Add tshirt.png when available
//   { id: "lamp", label: "Lamp", image: "/general/lamp.svg" }, // Add lamp.png when available
// ];

// const colorOptions = [
//   { id: "no-color", name: "No Color", value: "none" },
//   { id: "red", name: "Red", value: "#F70353" },
//   { id: "blue", name: "Blue", value: "#3B82F6" },
//   { id: "green", name: "Green", value: "#10B981" },
//   { id: "yellow", name: "Yellow", value: "#EAB308" },
//   { id: "purple", name: "Purple", value: "#A855F7" },
//   { id: "pink", name: "Pink", value: "#EC4899" },
//   { id: "orange", name: "Orange", value: "#F97316" },
//   { id: "black", name: "Black", value: "#000000" },
//   { id: "white", name: "White", value: "#FFFFFF" },
// ];

// // Helper function to convert hex to RGB
// const hexToRgb = (hex: string) => {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result
//     ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16),
//       }
//     : null;
// };

// // Helper function to get hue rotation for color filter
// const getHueRotation = (colorHex: string): number => {
//   const rgb = hexToRgb(colorHex);
//   if (!rgb) return 0;

//   const r = rgb.r / 255;
//   const g = rgb.g / 255;
//   const b = rgb.b / 255;

//   const max = Math.max(r, g, b);
//   const min = Math.min(r, g, b);
//   let h = 0;

//   if (max === min) {
//     h = 0;
//   } else if (max === r) {
//     h = ((g - b) / (max - min)) % 6;
//   } else if (max === g) {
//     h = (b - r) / (max - min) + 2;
//   } else {
//     h = (r - g) / (max - min) + 4;
//   }

//   h = Math.round(h * 60);
//   if (h < 0) h += 360;

//   return h;
// };

// const ApplyMokupDesignPage = () => {
//   const selectedImage = useImageStore((state) => state.selectedImage);
//   const [selectedProduct, setSelectedProduct] = useState<string>("cup");
//   const [cupFlip,] = useState<"left" | "right">("left"); 
//   const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
//   const [zoomScale, setZoomScale] = useState(100);
//   const [rotation, setRotation] = useState(0); // Design rotation
//   const [objectRotation, setObjectRotation] = useState(0); // New: Object rotation
//   const [isColorsOpen, setIsColorsOpen] = useState(true);
//   const [isApplied, setIsApplied] = useState(false);

//   const handleZoomIn = () => {
//     setZoomScale((prev) => Math.min(prev + 10, 200));
//   };

//   const handleZoomOut = () => {
//     setZoomScale((prev) => Math.max(prev - 10, 50));
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (!selectedImage) return;
//     setIsDragging(true);
//     setDragStart({
//       x: e.clientX - imagePosition.x,
//       y: e.clientY - imagePosition.y,
//     });
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging || !selectedImage) return;
//     setImagePosition({
//       x: e.clientX - dragStart.x,
//       y: e.clientY - dragStart.y,
//     });
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   // New: Rotate object functions
//   const rotateObjectLeft = () => {
//     setObjectRotation((prev) => {
//       const newRotation = prev - 15;
//       return newRotation < 0 ? 360 + newRotation : newRotation;
//     });
//   };

//   const rotateObjectRight = () => {
//     setObjectRotation((prev) => {
//       const newRotation = prev + 15;
//       return newRotation >= 360 ? newRotation - 360 : newRotation;
//     });
//   };

//   const navigate = useNavigate();

//   useEffect(() => {
//   return () => {
//     // Optional: Clear selected image when leaving page
//     // useImageStore.getState().clearSelectedImage();
//   };
// }, []);

//   return (
//     <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-cover 3xl:bg-center bg-no-repeat overflow-y-auto p-2 xl:p-2 2xl:p-8">
     
//       <Box  className="w-full min-h-screen flex flex-row gap-4 sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12 p-2 xl:p-2 2xl:p-8 max-lg:flex-col max-lg:items-center items-start max-md:justify-start max-md:py-6 max-sm:mt-30 mt-30">
   
//    {/* Left Side - Product Options Sidebar */}
// <Box className="flex flex-col items-center ml-18 justify-start gap-1 flex-shrink-0"> 
//  <Box
//     className="relative mb-2 w-[310.9px] xl:w-[380px] 2xl:w-[450px] h-[410px] xl:h-[490px] 2xl:h-[590px] overflow-hidden rounded-[10px] xl:rounded-[12px] 2xl:rounded-[14px]"
//     style={{ fontFamily: "Outfit, sans-serif" }}
//   >
//     {/* Background Frame - Set to 100% to ensure it scales perfectly */}
//     <Box
//       className="absolute inset-0 xl:bg-[length:81%_81%] bg-[length:90%_90%] rounded-[10px]"
//       style={{
//         backgroundImage: "url('/general/productphotos.svg')",
//         // backgroundSize: "81% 81%",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     />

//     {/* 1. Product Photos Header - Positioned by % for perfect gap from Top/Left */}
//     <Box className="absolute z-10 xl:left-[12%] left-[10%] top-[8.5%] xl:top-[11.5%] 2xl:top-[12.5%]">
//       <Flex className="items-center gap-2 xl:gap-3">
//         <img
//           src="/general/cup.svg"
//           alt="icon"
//           className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 object-cover rounded shadow-sm"
//         />
//         <Stack className="gap-0">
//           <span className="text-[10px] xl:text-[12px] 2xl:text-sm text-[#C1C1C5] leading-none  tracking-wider">
//             Product
//           </span>
//           <span className="text-[10px] xl:text-[12px] 2xl:text-sm  text-[#C1C1C5] font-medium leading-tight">
//             Photos
//           </span>
//         </Stack>
//         <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 text-[#C1C1C5]" />
//       </Flex>
//     </Box>

//     {/* 2. Customize Heading - Responsive vertical spacing */}
//     <Box className="absolute left-[13%] top-[24%] xl:top-[25%] 2xl:top-[27%]">
//       <Flex className="items-center gap-3">
//         <Box className="w-7 h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 flex-shrink-0">
//           <img src="/general/squre.svg" alt="square" className="w-full h-full" />
//         </Box>
//         <span className="text-sm xl:text-base 2xl:text-lg text-white font-light">
//           Customize Your Designs:
//         </span>
//       </Flex>
//     </Box>

   
//             {/* Product Options */}
//             <Box
//               className="absolute
//     left-[35px]  top-[130px]
//     xl:left-[50px]  xl:top-[160px]
//     2xl:left-[60px]  2xl:top-[212px]
//     3xl:top-[160px] 2xl:w-[330px] xl:w-[279.16px] w-[240.16px]"
//               style={{
//                 // width: ".16px",
//               }}
//             >
//               <Flex className="flex-col">
//                 {productOptions.map((product) => (
//                   <Box
//                     key={product.id}
//                     onClick={() => setSelectedProduct(product.id)}
//                     className={cn(
//                       "cursor-pointer rounded-lg p-3 transition-all duration-200 xl:rounded-xl 2xl:rounded-2xl flex items-center gap-3 xl:gap-4 2xl:gap-5",
//                       selectedProduct === product.id
//                         ? "border border-[#F70353] xl:border-2 2xl:border-2"
//                         : "border border-transparent hover:bg-[#29292D]/70"
//                     )}
//                     style={
//                       selectedProduct === product.id
//                         ? {
//                             background: `linear-gradient(to bottom, rgba(247, 3, 83, 0.06) 0%, rgba(247, 3, 83, 0.06) 73%, rgba(23, 7, 38, 1) 100%)`,
//                             borderColor: "#F70353",
//                             borderWidth: "1px",
//                           }
//                         : {
//                             background: `linear-gradient(to top, rgba(23, 7, 38, 1) 0%, rgba(23, 7, 38, 1) 73%, rgba(23, 7, 38, 1) 100%)`,
//                             borderColor: "#170726",
//                             borderWidth: "1px",
//                           }
//                     }
//                   >
//                     {/* Product Image */}
//                     <Box className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 flex-shrink-0 rounded-lg xl:rounded-xl 2xl:rounded-2xl overflow-hidden bg-[#29292D]/50">
//                       <img
//                         src={product.image}
//                         alt={product.label}
//                         className="w-full h-full object-cover"
//                       />
//                     </Box>

//                     {/* Product Text */}
//                     <Flex className="flex-col flex-1 min-w-0">
//                       <span
//                         className="text-sm xl:text-base 2xl:text-lg"
//                         style={{
//                           fontFamily: "Outfit",
//                           fontStyle: "normal",
//                           fontWeight:
//                             selectedProduct === product.id ? 500 : 300,
//                           fontSize: "14px",
//                           lineHeight: "20px",
//                           color:
//                             selectedProduct === product.id
//                               ? "#FFFFFF"
//                               : "#C1C1C5",
//                         }}
//                       >
//                         Apply your design on {product.label}
//                       </span>
//                     </Flex>

//                     {/* Chevron Right Icon */}
//                     <ChevronRight className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-[#C1C1C5] flex-shrink-0" />
//                   </Box>
//                 ))}
//               </Flex>
//             </Box>
            
//   </Box>

//   {/* 2. BOTTOM SECTION: Design Card & Checkout (Reduced gaps) */}
//   {selectedImage && (
//     <Box className="flex flex-col gap-1 items-center w-full max-w-[350px] mx-auto">
      
//       {/* Design "Tray" Card */}
//       <div 
//         className="relative w-[330px] h-[210px] bg-no-repeat bg-contain" 
//         style={{ backgroundImage: "url('/general/applybg.png')" }}
//       >
//         <div className="absolute bg-[#130E29]/50 backdrop-blur-xl border border-white/10 rounded-[30px] p-4 top-[33.7%] left-[10px] right-[10px] flex items-center justify-between">
//           <div className="w-[85px] h-[85px] rounded-2xl overflow-hidden border border-white/10">
//             <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
//           </div>
//           <CustomButton
//             title={isApplied ? "Applied" : "Apply"}
//             onClick={() => setIsApplied(true)}
//             wrapperClassName={cn("w-[140px] h-[52px] rounded-[18px]", isApplied && "bg-none shadow-none")}
//           />
//         </div>
//       </div>

//       {/* Checkout Button (Almost no gap from tray card) */}
//       <Box className="w-full items-center text-center px-2">
//         <CustomButton
//           title="Continue to Checkout"
//           onClick={() => navigate("/checkout")}
//           icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>}
//           wrapperClassName="w-[96%] h-[60px] rounded-[25px]"
//           className="text-[18px]"
//         />
//       </Box>

//       {/* {isApplied && (
//         <button onClick={() => setIsApplied(false)} className="mt-2 text-white/40 text-xs underline">
//           Remove design from object
//         </button>
//       )} */}
//     </Box>
//   )}
// </Box>        {/* Center - Product Mockup with Image Overlay */}
//         <Box className="flex-1 flex items-center justify-center min-w-0 max-md:w-full max-md:flex-1 max-md:mt-4">
//           <Stack className="w-full max-w-[650px] xl:max-w-[800px] 2xl:max-w-[950px] items-center justify-center">
//             <Center
//               className="w-full bg-transparent p-2 xl:p-3 2xl:p-4 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[550px] 2xl:h-[650px] rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-visible relative"
//               style={{ userSelect: "none" }}
//             >
//               {(() => {
//                 const currentProduct = productOptions.find(
//                   (p) => p.id === selectedProduct
//                 );
//                 if (!currentProduct) return null;

//                 return (
//                   <Box
//                     className="relative w-full h-full flex items-center justify-center"
//                     onMouseMove={handleMouseMove}
//                     onMouseUp={handleMouseUp}
//                     onMouseLeave={handleMouseUp}
//                   >
//                     {/* Product Base Image with Color Overlay - Flippable and Rotatable */}
//                     <Box
//                       className="relative w-full h-full flex items-center justify-center"
//                       style={{
//                         transform: `
//                           scaleX(${cupFlip === "right" ? -1 : 1})
//                           rotate(${objectRotation}deg)
//                         `,
//                         transformStyle: "preserve-3d",
//                         transition: "transform 0.3s ease",
//                       }}
//                     >
//                       <img
//                         src={currentProduct.image}
//                         alt={currentProduct.label}
//                         className="w-full h-full object-contain"
//                         style={{
//                           filter:
//                             selectedColor.value === "#FFFFFF"
//                               ? "brightness(1.1)"
//                               : selectedColor.value === "#000000"
//                               ? "brightness(0.7)"
//                               : `hue-rotate(${getHueRotation(
//                                   selectedColor.value
//                                 )}) saturate(1.2)`,
//                         }}
//                       />
//                       {/* Color Overlay - using mask like before */}
//                       {selectedColor.value !== "none" && (
//                         <Box
//                           className="absolute inset-0"
//                           style={{
//                             backgroundColor: selectedColor.value,
//                             mixBlendMode: "multiply",
//                             opacity: 0.7,
//                             pointerEvents: "none",
//                             // Mask to cup shape - only tints the product, not background
//                             maskImage: `url(${currentProduct.image})`,
//                             maskSize: "contain",
//                             maskRepeat: "no-repeat",
//                             maskPosition: "center",
//                             WebkitMaskImage: `url(${currentProduct.image})`,
//                             WebkitMaskSize: "contain",
//                             WebkitMaskRepeat: "no-repeat",
//                             WebkitMaskPosition: "center",
//                           }}
//                         />
//                       )}
//                     </Box>

//                     {/* User's Image Overlay - ONLY SHOWS IF APPLIED */}
//                     {selectedImage && isApplied && (
//                       <Box
//                         className="absolute inset-0 flex items-center justify-center"
//                         style={{
//                           // Mask to cup shape - only show on cup
//                           maskSize: "contain",
//                           maskRepeat: "no-repeat",
//                           maskPosition: "center", 
//                           maskImage: `url(${currentProduct.image})`,
//                           WebkitMaskImage: `url(${currentProduct.image})`,
//                           WebkitMaskSize: "contain",
//                           WebkitMaskRepeat: "no-repeat",
//                           WebkitMaskPosition: "center",
//                           // Clip to exclude rim/inside area - allow full wrap
//                           clipPath:
//                             selectedProduct === "cup"
//                               ? "inset(13% 0% 6% 0%)"
//                               : "none",
//                           overflow: "hidden",
//                           // 3D perspective for cylindrical effect
//                           perspective:
//                             selectedProduct === "cup" ? "600px" : "none",
//                           perspectiveOrigin: "50% 50%",
//                           // Sync with cup flip
//                           transform: `
//                             scaleX(${cupFlip === "right" ? -1 : 1})
//                             rotate(${objectRotation}deg)
//                           `,
//                           transformStyle: "preserve-3d",
//                           transition: "transform 0.3s ease",
//                         }}
//                       >
//                         {/* Container - Full width for wrapping around cup */}
//                         <Box
//                           className={cn(
//                             "relative",
//                             isDragging ? "cursor-grabbing" : "cursor-grab"
//                           )}
//                           style={{
//                             width: selectedProduct === "cup" ? "100%" : "100%",
//                             height: selectedProduct === "cup" ? "82%" : "100%",
//                             position: "absolute",
//                             top: selectedProduct === "cup" ? "13%" : "0%",
//                             left: selectedProduct === "cup" ? "0%" : "0%",
                            
//                             // Transform includes design rotation and object rotation
//                             transform: `
//                               translate(${imagePosition.x}px, ${imagePosition.y}px) 
//                               scale(${zoomScale / 100})
//                               rotate(${rotation}deg)
//                             `,
                            
//                             transformOrigin: "center center",
//                             transformStyle: "preserve-3d",
//                             pointerEvents: "auto",
//                             userSelect: "none",
//                             transition: isDragging ? "none" : "transform 0.1s ease",
//                           }}
//                           onMouseDown={handleMouseDown}
//                         >
//                           {/* Image with cylindrical wrap */}
//                           <img
//                             src={selectedImage}
//                             alt="design-overlay"
//                             className="w-full h-full"
//                             style={{
//                               objectFit: "cover",
//                               filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.4))",
//                               transform: selectedProduct === "cup"
//                                   ? `perspective(400px) rotateY(0deg) scaleX(1) scaleY(1.05)`
//                                   : "none",
//                               willChange: "transform",
//                             }}
//                             draggable={false}
//                           />
//                         </Box>
//                       </Box>
//                     )}
//                   </Box>
//                 );
//               })()}
//             </Center>
//           </Stack>
//         </Box>  

//         {/* Right Side - Functional Controls */}
// <Box className="flex flex-col items-center justify-center gap-4 mr-18 xl:gap-8 flex-shrink-0 bg-transparent">
  
//   {/* 1. SELECT COLORS SECTION */}
//   <Box 
//     className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 rounded-[20px] border border-white/10 overflow-hidden bg-cover bg-center shadow-2xl transition-all duration-300"
//     style={{ backgroundImage: "url('/general/specialbg.png')" }}
//   >
//     {/* Header - Toggles Dropdown */}
//     <Flex 
//       className="items-center justify-between mb-3 cursor-pointer select-none"
//       onClick={() => setIsColorsOpen(!isColorsOpen)}
//     >
//       <Flex className="items-center gap-2">
//         <Box className="w-5 h-5 flex items-center justify-center">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                 <circle cx="12" cy="8" r="5" fill="#00BED5" fillOpacity="0.8"/>
//                 <circle cx="8" cy="15" r="5" fill="#FF3A02" fillOpacity="0.8"/>
//                 <circle cx="16" cy="15" r="5" fill="#FBAF00" fillOpacity="0.8"/>
//             </svg>
//         </Box>
//         <span className="text-white text-base font-medium">Select Colors</span>
//       </Flex>
      
//       <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/20">
//         {isColorsOpen ? (
//           <ChevronUp className="w-4 h-4 text-white" />
//         ) : (
//           <ChevronDown className="w-4 h-4 text-white" />
//         )}
//       </button>
//     </Flex>

//     {/* Color List Container */}
//     <Box 
//       className={`transition-all duration-500 ease-in-out overflow-hidden ${
//         isColorsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//       }`}
//     >
//       <Box className="rounded-xl overflow-hidden border border-white/10 mt-1">
//         {[
//           { name: "Conquelicot", hex: "#FF3A02" },
//           { name: "Arlequin", hex: "#70E22B" },
//           { name: "Violet", hex: "#9C04ED" },
//           { name: "Purple", hex: "#6B1BFF" },
//           { name: "Chrome", hex: "#FBAF00" },
//           { name: "Blaze", hex: "#FF6E01" },
//           { name: "Turquoise", hex: "#00BED5" },
//           { name: "Chestnut", hex: "#9A614D" },
//         ].map((color, idx) => (
//           <Flex 
//             key={idx} 
//             onClick={() => setSelectedColor({ id: color.name, name: color.name, value: color.hex })}
//             className="px-3 py-1.5 justify-between items-center cursor-pointer hover:brightness-125 transition-all"
//             style={{ backgroundColor: color.hex }}
//           >
//             <span className="text-white text-[10px] font-bold uppercase tracking-wider">{color.name}</span>
//             <span className="text-white text-[10px] font-mono font-bold">{color.hex}</span>
//           </Flex>
//         ))}
//       </Box>
//     </Box>
//   </Box>

//   {/* 2. SCALE SECTION */}
//   <Box 
//     className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//     style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//   >
//     <Flex className="items-center gap-3 mb-4">
//        <Box className="p-3 bg-[#4A0E64] rounded-lg border border-white/10">
//           <Search className="w-6 h-6 text-white" />
//        </Box>
//        <span className="text-white/80 text-lg font-normal">Scale</span>
//     </Flex>

//     <Flex className="items-center mt-10 justify-between px-2">
//       <button 
//         onClick={handleZoomOut}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Minus className="w-6 h-6 text-white" />
//       </button>
      
//       <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//         {zoomScale}%
//       </span>
      
//       <button 
//         onClick={handleZoomIn}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Plus className="w-6 h-6 text-white" />
//       </button>
//     </Flex>
//   </Box>

//   {/* 3. DESIGN ROTATION SECTION */}
//   {/* <Box 
//     className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//     style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//   >
//     <Flex className="items-center gap-3 mb-4">
//        <Box className="p-3 bg-[#401F45] rounded-lg border border-white/10">
//           <RotateCcw className="w-6 h-6 text-[#F70353]" />
//        </Box>
//        <span className="text-white/80 text-lg font-normal">Design Rotation</span>
//     </Flex>

//     <Flex className="items-center mt-10 justify-between px-2">
//       <button 
//         onClick={() => setRotation((prev) => prev - 15)}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Undo2 className="w-6 h-6 text-white" />
//       </button>
      
//       <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//         {rotation}°
//       </span>
      
//       <button 
//         onClick={() => setRotation((prev) => prev + 15)}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Redo2 className="w-6 h-6 text-white" />
//       </button>
//     </Flex>
//   </Box> */}

//   {/* 4. OBJECT ROTATION SECTION - NEW */}
//   <Box 
//     className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//     style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//   >
//     <Flex className="items-center gap-3 mb-4">
//        <Box className="p-3 bg-[#2D1B45] rounded-lg border border-white/10">
//           <RotateCw className="w-6 h-6 text-[#00BED5]" />
//        </Box>
//        <span className="text-white/80 text-lg font-normal">Object Rotation</span>
//     </Flex>

//     <Flex className="items-center mt-10 justify-between px-2">
//       <button 
//         onClick={rotateObjectLeft}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Undo2 className="w-6 h-6 text-white" />
//       </button>
      
//       <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//         {objectRotation}°
//       </span>
      
//       <button 
//         onClick={rotateObjectRight}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Redo2 className="w-6 h-6 text-white" />
//       </button>
//     </Flex>
//   </Box>

// </Box>

       
//       </Box>

//       {isApplied && (
  
//      <div className="absolute lg:top-[140px] top-[110px] left-[45%] z-50"> 
//   <CustomBlackButton
//     // wrapperClassName: 'rounded-full' makes the outer border glow pill-shaped
//     wrapperClassName="w-fit px-[2px] h-[48px] rounded-full" 
    
//     // className: 'rounded-full' makes the inner button pill-shaped
//     className="rounded-full px-4 text-[14px] sm:text-[16px] md:text-[18px]"
    
//     title="Reset"
//       onClick={() => {
//   setIsApplied(false);
//   setRotation(0); 
//   setObjectRotation(0); // Also reset object rotation
//   setZoomScale(100); 
//   setImagePosition({ x: 0, y: 0 }); 
// }}
    
//     // Adding the Reset Icon (SVG)
//     icon={
//       <svg 
//         width="20" 
//         height="20" 
//         viewBox="0 0 24 24" 
//         fill="none" 
//         stroke="currentColor" 
//         strokeWidth="2.5" 
//         strokeLinecap="round" 
//         strokeLinejoin="round"
//       >
//         <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
//         <path d="M3 3v5h5" />
//       </svg>
//     }
//   />
// </div>
//   )}
    
//     </Box>
//   );
// };

// export default ApplyMokupDesignPage;





// import { useState,useEffect } from "react";
// import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { Flex } from "@/components/ui/flex";
// import { useImageStore } from "@/store/image.store";
// import { cn } from "@/utils/cn.util";
// import CustomButton from "../components/common/customButton"
// import CustomBlackButton from "../components/common/customBlackButton"
// // import { toast } from "sonner";
// import { useNavigate } from "react-router";
// import {
//   ChevronDown,
//   ChevronUp,
//   ChevronRight,
//   Minus,
//   Redo2,
//   Undo2,
//   Search,
//   Plus,
//   RotateCw,
// } from "lucide-react";

// const productOptions = [
//   { id: "cup", label: "Cup", image: "/general/cup.png" },
//   { id: "tshirt", label: "Shirt", image: "/general/tshirt.png" }, // Add tshirt.png when available
//   { id: "lamp", label: "Lamp", image: "/general/lamp.png" }, // Add lamp.png when available
// ];

// const colorOptions = [
//   { id: "no-color", name: "No Color", value: "none" },
//   { id: "red", name: "Red", value: "#F70353" },
//   { id: "blue", name: "Blue", value: "#3B82F6" },
//   { id: "green", name: "Green", value: "#10B981" },
//   { id: "yellow", name: "Yellow", value: "#EAB308" },
//   { id: "purple", name: "Purple", value: "#A855F7" },
//   { id: "pink", name: "Pink", value: "#EC4899" },
//   { id: "orange", name: "Orange", value: "#F97316" },
//   { id: "black", name: "Black", value: "#000000" },
//   { id: "white", name: "White", value: "#FFFFFF" },
// ];

// // Helper function to convert hex to RGB
// const hexToRgb = (hex: string) => {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result
//     ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16),
//       }
//     : null;
// };

// // Helper function to get hue rotation for color filter
// const getHueRotation = (colorHex: string): number => {
//   const rgb = hexToRgb(colorHex);
//   if (!rgb) return 0;

//   const r = rgb.r / 255;
//   const g = rgb.g / 255;
//   const b = rgb.b / 255;

//   const max = Math.max(r, g, b);
//   const min = Math.min(r, g, b);
//   let h = 0;

//   if (max === min) {
//     h = 0;
//   } else if (max === r) {
//     h = ((g - b) / (max - min)) % 6;
//   } else if (max === g) {
//     h = (b - r) / (max - min) + 2;
//   } else {
//     h = (r - g) / (max - min) + 4;
//   }

//   h = Math.round(h * 60);
//   if (h < 0) h += 360;

//   return h;
// };

// const ApplyMokupDesignPage = () => {
// const selectedImage = useImageStore((state) => state.selectedImage);
//   const [selectedProduct, setSelectedProduct] = useState<string>("cup");
//   const [cupFlip, setCupFlip] = useState<"left" | "right">("left"); // Changed from const to state
//   const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
//   const [zoomScale, setZoomScale] = useState(100);
//   const [rotation, setRotation] = useState(0); // Design rotation
//   const [objectRotation, setObjectRotation] = useState(0); // New: Object rotation
//   const [isColorsOpen, setIsColorsOpen] = useState(true);
//   const [isApplied, setIsApplied] = useState(false);

//   const handleZoomIn = () => {
//     setZoomScale((prev) => Math.min(prev + 10, 200));
//   };

//   const handleZoomOut = () => {
//     setZoomScale((prev) => Math.max(prev - 10, 50));
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (!selectedImage) return;
//     setIsDragging(true);
//     setDragStart({
//       x: e.clientX - imagePosition.x,
//       y: e.clientY - imagePosition.y,
//     });
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging || !selectedImage) return;
//     setImagePosition({
//       x: e.clientX - dragStart.x,
//       y: e.clientY - dragStart.y,
//     });
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

// const rotateObjectToLeftSide = () => {
//     setCupFlip("left"); // Show left side (normal view)
//     setObjectRotation(0); // Reset any rotation
//   };


//  const rotateObjectToRightSide = () => {
//     setCupFlip("right"); // Show right side (flipped view)
//     setObjectRotation(0); // Reset any rotation
//   };

//   const navigate = useNavigate();

//   useEffect(() => {
//   return () => {
//     // Optional: Clear selected image when leaving page
//     // useImageStore.getState().clearSelectedImage();
//   };
// }, []);

//   return (
//     <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-cover 3xl:bg-center bg-no-repeat overflow-y-auto p-2 xl:p-2 2xl:p-8">
     
//       <Box  className="w-full min-h-screen flex flex-row gap-4 sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12 p-2 xl:p-2 2xl:p-8 max-lg:flex-col max-lg:items-center items-start max-md:justify-start max-md:py-6 max-sm:mt-30 mt-30">
   
//    {/* Left Side - Product Options Sidebar */}
// <Box className="flex flex-col items-center ml-18 justify-start gap-1 flex-shrink-0"> 
//  <Box
//     className="relative mb-2 w-[310.9px] xl:w-[380px] 2xl:w-[450px] h-[410px] xl:h-[490px] 2xl:h-[590px] overflow-hidden rounded-[10px] xl:rounded-[12px] 2xl:rounded-[14px]"
//     style={{ fontFamily: "Outfit, sans-serif" }}
//   >
//     {/* Background Frame - Set to 100% to ensure it scales perfectly */}
//     <Box
//       className="absolute inset-0 xl:bg-[length:81%_81%] bg-[length:90%_90%] rounded-[10px]"
//       style={{
//         backgroundImage: "url('/general/productphotos.png')",
//         // backgroundSize: "81% 81%",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     />

//     {/* 1. Product Photos Header - Positioned by % for perfect gap from Top/Left */}
//     <Box className="absolute z-10 xl:left-[12%] left-[10%] top-[8.5%] xl:top-[11.5%] 2xl:top-[12.5%]">
//       <Flex className="items-center gap-2 xl:gap-3">
//         <img
//           src="/general/cups.png"
//           alt="icon"
//           className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 object-cover rounded shadow-sm"
//         />
//         <Stack className="gap-0">
//           <span className="text-[10px] xl:text-[12px] 2xl:text-sm text-[#C1C1C5] leading-none  tracking-wider">
//             Product
//           </span>
//           <span className="text-[10px] xl:text-[12px] 2xl:text-sm  text-[#C1C1C5] font-medium leading-tight">
//             Photos
//           </span>
//         </Stack>
//         <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 text-[#C1C1C5]" />
//       </Flex>
//     </Box>

//     {/* 2. Customize Heading - Responsive vertical spacing */}
//     <Box className="absolute left-[13%] top-[24%] xl:top-[25%] 2xl:top-[27%]">
//       <Flex className="items-center gap-3">
//         <Box className="w-7 h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 flex-shrink-0">
//           <img src="/general/squre.png" alt="square" className="w-full h-full" />
//         </Box>
//         <span className="text-sm xl:text-base 2xl:text-lg text-white font-light">
//           Customize Your Designs:
//         </span>
//       </Flex>
//     </Box>

   
//             {/* Product Options */}
//             <Box
//               className="absolute
//     left-[35px]  top-[130px]
//     xl:left-[50px]  xl:top-[160px]
//     2xl:left-[60px]  2xl:top-[212px]
//     3xl:top-[160px] 2xl:w-[330px] xl:w-[279.16px] w-[240.16px]"
//               style={{
//                 // width: ".16px",
//               }}
//             >
//               <Flex className="flex-col">
//                 {productOptions.map((product) => (
//                   <Box
//                     key={product.id}
//                     onClick={() => setSelectedProduct(product.id)}
//                     className={cn(
//                       "cursor-pointer rounded-lg p-3 transition-all duration-200 xl:rounded-xl 2xl:rounded-2xl flex items-center gap-3 xl:gap-4 2xl:gap-5",
//                       selectedProduct === product.id
//                         ? "border border-[#F70353] xl:border-2 2xl:border-2"
//                         : "border border-transparent hover:bg-[#29292D]/70"
//                     )}
//                     style={
//                       selectedProduct === product.id
//                         ? {
//                             background: `linear-gradient(to bottom, rgba(247, 3, 83, 0.06) 0%, rgba(247, 3, 83, 0.06) 73%, rgba(23, 7, 38, 1) 100%)`,
//                             borderColor: "#F70353",
//                             borderWidth: "1px",
//                           }
//                         : {
//                             background: `linear-gradient(to top, rgba(23, 7, 38, 1) 0%, rgba(23, 7, 38, 1) 73%, rgba(23, 7, 38, 1) 100%)`,
//                             borderColor: "#170726",
//                             borderWidth: "1px",
//                           }
//                     }
//                   >
//                     {/* Product Image */}
//                     <Box className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 flex-shrink-0 rounded-lg xl:rounded-xl 2xl:rounded-2xl overflow-hidden bg-[#29292D]/50">
//                       <img
//                         src={product.image}
//                         alt={product.label}
//                         className="w-full h-full object-cover"
//                       />
//                     </Box>

//                     {/* Product Text */}
//                     <Flex className="flex-col flex-1 min-w-0">
//                       <span
//                         className="text-sm xl:text-base 2xl:text-lg"
//                         style={{
//                           fontFamily: "Outfit",
//                           fontStyle: "normal",
//                           fontWeight:
//                             selectedProduct === product.id ? 500 : 300,
//                           fontSize: "14px",
//                           lineHeight: "20px",
//                           color:
//                             selectedProduct === product.id
//                               ? "#FFFFFF"
//                               : "#C1C1C5",
//                         }}
//                       >
//                         Apply your design on {product.label}
//                       </span>
//                     </Flex>

//                     {/* Chevron Right Icon */}
//                     <ChevronRight className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-[#C1C1C5] flex-shrink-0" />
//                   </Box>
//                 ))}
//               </Flex>
//             </Box>
            
//   </Box>

//   {/* 2. BOTTOM SECTION: Design Card & Checkout (Reduced gaps) */}
//   {selectedImage && (
//     <Box className="flex flex-col gap-1 items-center w-full max-w-[350px] mx-auto">
      
//       {/* Design "Tray" Card */}
//       <div 
//         className="relative w-[330px] h-[210px] bg-no-repeat bg-contain" 
//         style={{ backgroundImage: "url('/general/applybg.png')" }}
//       >
//         <div className="absolute bg-[#130E29]/50 backdrop-blur-xl border border-white/10 rounded-[30px] p-4 top-[33.7%] left-[10px] right-[10px] flex items-center justify-between">
//           <div className="w-[85px] h-[85px] rounded-2xl overflow-hidden border border-white/10">
//             <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
//           </div>
//           <CustomButton
//             title={isApplied ? "Applied" : "Apply"}
//             onClick={() => setIsApplied(true)}
//             wrapperClassName={cn("w-[140px] h-[52px] rounded-[18px]", isApplied && "bg-none shadow-none")}
//           />
//         </div>
//       </div>

//       {/* Checkout Button (Almost no gap from tray card) */}
//       <Box className="w-full items-center text-center px-2">
//         <CustomButton
//           title="Continue to Checkout"
//           onClick={() => navigate("/checkout")}
//           icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>}
//           wrapperClassName="w-[96%] h-[60px] rounded-[25px]"
//           className="text-[18px]"
//         />
//       </Box>

//       {/* {isApplied && (
//         <button onClick={() => setIsApplied(false)} className="mt-2 text-white/40 text-xs underline">
//           Remove design from object
//         </button>
//       )} */}
//     </Box>
//   )}
// </Box>        {/* Center - Product Mockup with Image Overlay */}
//         <Box className="flex-1 flex items-center justify-center min-w-0 max-md:w-full max-md:flex-1 max-md:mt-4">
//           <Stack className="w-full max-w-[650px] xl:max-w-[800px] 2xl:max-w-[950px] items-center justify-center">
//             <Center
//               className="w-full bg-transparent p-2 xl:p-3 2xl:p-4 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[550px] 2xl:h-[650px] rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-visible relative"
//               style={{ userSelect: "none" }}
//             >
//               {(() => {
//                 const currentProduct = productOptions.find(
//                   (p) => p.id === selectedProduct
//                 );
//                 if (!currentProduct) return null;

//                 return (
//                   <Box
//                     className="relative w-full h-full flex items-center justify-center"
//                     onMouseMove={handleMouseMove}
//                     onMouseUp={handleMouseUp}
//                     onMouseLeave={handleMouseUp}
//                   >
//                     {/* Product Base Image with Color Overlay - Flippable and Rotatable */}
//                    <Box
//   className="relative w-full h-full flex items-center justify-center"
//   style={{
//     transform: `
//       scaleX(${cupFlip === "right" ? -1 : 1})
//       rotate(${objectRotation}deg)
//     `,
//     transformStyle: "preserve-3d",
//     transition: "transform 0.3s ease",
//   }}

//                     >
//                       <img
//                         src={currentProduct.image}
//                         alt={currentProduct.label}
//                         className="w-full h-full object-contain"
//                         style={{
//                           filter:
//                             selectedColor.value === "#FFFFFF"
//                               ? "brightness(1.1)"
//                               : selectedColor.value === "#000000"
//                               ? "brightness(0.7)"
//                               : `hue-rotate(${getHueRotation(
//                                   selectedColor.value
//                                 )}) saturate(1.2)`,
//                         }}
//                       />
//                       {/* Color Overlay - using mask like before */}
//                       {selectedColor.value !== "none" && (
//                         <Box
//                           className="absolute inset-0"
//                           style={{
//                             backgroundColor: selectedColor.value,
//                             mixBlendMode: "multiply",
//                             opacity: 0.7,
//                             pointerEvents: "none",
//                             // Mask to cup shape - only tints the product, not background
//                             maskImage: `url(${currentProduct.image})`,
//                             maskSize: "contain",
//                             maskRepeat: "no-repeat",
//                             maskPosition: "center",
//                             WebkitMaskImage: `url(${currentProduct.image})`,
//                             WebkitMaskSize: "contain",
//                             WebkitMaskRepeat: "no-repeat",
//                             WebkitMaskPosition: "center",
//                           }}
//                         />
//                       )}
//                     </Box>

//                     {/* User's Image Overlay - ONLY SHOWS IF APPLIED */}
//                     {selectedImage && isApplied && (
//   <Box
//     className="absolute inset-0 flex items-center justify-center"
//     style={{
//                           // Mask to cup shape - only show on cup
//                           maskSize: "contain",
//                           maskRepeat: "no-repeat",
//                           maskPosition: "center", 
//                           maskImage: `url(${currentProduct.image})`,
//                           WebkitMaskImage: `url(${currentProduct.image})`,
//                           WebkitMaskSize: "contain",
//                           WebkitMaskRepeat: "no-repeat",
//                           WebkitMaskPosition: "center",
//                           // Clip to exclude rim/inside area - allow full wrap
//                           clipPath:
//                             selectedProduct === "cup"
//                               ? "inset(13% 0% 6% 0%)"
//                               : "none",
//                           overflow: "hidden",
//                           // 3D perspective for cylindrical effect
//                           perspective:
//                             selectedProduct === "cup" ? "600px" : "none",
//                           perspectiveOrigin: "50% 50%",
//                           // Sync with cup flip
//                           transform: `
//         scaleX(${cupFlip === "right" ? -1 : 1})
//         rotate(${objectRotation}deg)
//       `,
//                           transformStyle: "preserve-3d",
//                           transition: "transform 0.3s ease",
//                         }}
//                       >
//                         {/* Container - Full width for wrapping around cup */}
//                         <Box
//                           className={cn(
//                             "relative",
//                             isDragging ? "cursor-grabbing" : "cursor-grab"
//                           )}
//                           style={{
//                             width: selectedProduct === "cup" ? "100%" : "100%",
//                             height: selectedProduct === "cup" ? "82%" : "100%",
//                             position: "absolute",
//                             top: selectedProduct === "cup" ? "13%" : "0%",
//                             left: selectedProduct === "cup" ? "0%" : "0%",
                            
//                             // Transform includes design rotation and object rotation
//                             transform: `
//                               translate(${imagePosition.x}px, ${imagePosition.y}px) 
//                               scale(${zoomScale / 100})
//                               rotate(${rotation}deg)
//                             `,
                            
//                             transformOrigin: "center center",
//                             transformStyle: "preserve-3d",
//                             pointerEvents: "auto",
//                             userSelect: "none",
//                             transition: isDragging ? "none" : "transform 0.1s ease",
//                           }}
//                           onMouseDown={handleMouseDown}
//                         >
//                           {/* Image with cylindrical wrap */}
//                           <img
//                             src={selectedImage}
//                             alt="design-overlay"
//                             className="w-full h-full"
//                             style={{
//                               objectFit: "cover",
//                               filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.4))",
//                               transform: selectedProduct === "cup"
//                                   ? `perspective(400px) rotateY(0deg) scaleX(1) scaleY(1.05)`
//                                   : "none",
//                               willChange: "transform",
//                             }}
//                             draggable={false}
//                           />
//                         </Box>
//                       </Box>
//                     )}
//                   </Box>
//                 );
//               })()}
//             </Center>
//           </Stack>
//         </Box>  

//         {/* Right Side - Functional Controls */}
// <Box className="flex flex-col items-center justify-center gap-4 mr-18 xl:gap-8 flex-shrink-0 bg-transparent">
  
//   {/* 1. SELECT COLORS SECTION */}
//   <Box 
//     className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 rounded-[20px] border border-white/10 overflow-hidden bg-cover bg-center shadow-2xl transition-all duration-300"
//     style={{ backgroundImage: "url('/general/specialbg.png')" }}
//   >
//     {/* Header - Toggles Dropdown */}
//     <Flex 
//       className="items-center justify-between mb-3 cursor-pointer select-none"
//       onClick={() => setIsColorsOpen(!isColorsOpen)}
//     >
//       <Flex className="items-center gap-2">
//         <Box className="w-5 h-5 flex items-center justify-center">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                 <circle cx="12" cy="8" r="5" fill="#00BED5" fillOpacity="0.8"/>
//                 <circle cx="8" cy="15" r="5" fill="#FF3A02" fillOpacity="0.8"/>
//                 <circle cx="16" cy="15" r="5" fill="#FBAF00" fillOpacity="0.8"/>
//             </svg>
//         </Box>
//         <span className="text-white text-base font-medium">Select Colors</span>
//       </Flex>
      
//       <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/20">
//         {isColorsOpen ? (
//           <ChevronUp className="w-4 h-4 text-white" />
//         ) : (
//           <ChevronDown className="w-4 h-4 text-white" />
//         )}
//       </button>
//     </Flex>

//     {/* Color List Container */}
//     <Box 
//       className={`transition-all duration-500 ease-in-out overflow-hidden ${
//         isColorsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//       }`}
//     >
//       <Box className="rounded-xl overflow-hidden border border-white/10 mt-1">
//         {[
//           { name: "Conquelicot", hex: "#FF3A02" },
//           { name: "Arlequin", hex: "#70E22B" },
//           { name: "Violet", hex: "#9C04ED" },
//           { name: "Purple", hex: "#6B1BFF" },
//           { name: "Chrome", hex: "#FBAF00" },
//           { name: "Blaze", hex: "#FF6E01" },
//           { name: "Turquoise", hex: "#00BED5" },
//           { name: "Chestnut", hex: "#9A614D" },
//         ].map((color, idx) => (
//           <Flex 
//             key={idx} 
//             onClick={() => setSelectedColor({ id: color.name, name: color.name, value: color.hex })}
//             className="px-3 py-1.5 justify-between items-center cursor-pointer hover:brightness-125 transition-all"
//             style={{ backgroundColor: color.hex }}
//           >
//             <span className="text-white text-[10px] font-bold uppercase tracking-wider">{color.name}</span>
//             <span className="text-white text-[10px] font-mono font-bold">{color.hex}</span>
//           </Flex>
//         ))}
//       </Box>
//     </Box>
//   </Box>

//   {/* 2. SCALE SECTION */}
//   <Box 
//     className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//     style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//   >
//     <Flex className="items-center gap-3 mb-4">
//        <Box className="p-3 bg-[#4A0E64] rounded-lg border border-white/10">
//           <Search className="w-6 h-6 text-white" />
//        </Box>
//        <span className="text-white/80 text-lg font-normal">Scale</span>
//     </Flex>

//     <Flex className="items-center mt-10 justify-between px-2">
//       <button 
//         onClick={handleZoomOut}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Minus className="w-6 h-6 text-white" />
//       </button>
      
//       <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//         {zoomScale}%
//       </span>
      
//       <button 
//         onClick={handleZoomIn}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Plus className="w-6 h-6 text-white" />
//       </button>
//     </Flex>
//   </Box>

//   {/* 3. DESIGN ROTATION SECTION */}
//   {/* <Box 
//     className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//     style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//   >
//     <Flex className="items-center gap-3 mb-4">
//        <Box className="p-3 bg-[#401F45] rounded-lg border border-white/10">
//           <RotateCcw className="w-6 h-6 text-[#F70353]" />
//        </Box>
//        <span className="text-white/80 text-lg font-normal">Design Rotation</span>
//     </Flex>

//     <Flex className="items-center mt-10 justify-between px-2">
//       <button 
//         onClick={() => setRotation((prev) => prev - 15)}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Undo2 className="w-6 h-6 text-white" />
//       </button>
      
//       <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//         {rotation}°
//       </span>
      
//       <button 
//         onClick={() => setRotation((prev) => prev + 15)}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Redo2 className="w-6 h-6 text-white" />
//       </button>
//     </Flex>
//   </Box> */}

//  {/* 4. OBJECT ROTATION SECTION - UPDATED FOR LEFT/RIGHT FLIP */}
// <Box 
//   className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//   style={{ backgroundImage: "url('/general/bgofbg.png')" }}
// >
//   <Flex className="items-center gap-3 mb-4">
//     <Box className="p-3 bg-[#2D1B45] rounded-lg border border-white/10">
//       <RotateCw className="w-6 h-6 text-[#00BED5]" />
//     </Box>
//     <span className="text-white/80 text-lg font-normal">Object Rotation</span>
//   </Flex>

//   <Flex className="items-center mt-10 justify-between px-2">
//     <button 
//       onClick={rotateObjectToLeftSide}
//       className="w-14 h-12 flex flex-col items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all group"
//       title="Show Left Side"
//     >
//       {/* <span className="text-white/70 text-xs mb-1 group-hover:text-white">Left</span> */}
//       <Undo2 className="w-5 h-5 text-white" />
//     </button>
    
//     <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//       {cupFlip === "left" ? "Left" : "Right"}
//     </span>
    
//     <button 
//       onClick={rotateObjectToRightSide}
//       className="w-14 h-12 flex flex-col items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all group"
//       title="Show Right Side"
//     >
//       {/* <span className="text-white/70 text-xs mb-1 group-hover:text-white">Right</span> */}
//       <Redo2 className="w-5 h-5 text-white" />
//     </button>
//   </Flex>
// </Box>
// </Box>

       
//       </Box>

//       {isApplied && (
  
//      <div className="absolute lg:top-[140px] top-[110px] left-[45%] z-50"> 
//   <CustomBlackButton
//     // wrapperClassName: 'rounded-full' makes the outer border glow pill-shaped
//     wrapperClassName="w-fit px-[2px] h-[48px] rounded-full" 
    
//     // className: 'rounded-full' makes the inner button pill-shaped
//     className="rounded-full px-4 text-[14px] sm:text-[16px] md:text-[18px]"
    
//    title="Reset"
//   onClick={() => {
//     setIsApplied(false);
//     setRotation(0); 
//     setObjectRotation(0);
//     setCupFlip("left"); // Reset to left side
//     setZoomScale(100); 
//     setImagePosition({ x: 0, y: 0 }); 
//   }}
    
//     // Adding the Reset Icon (SVG)
//     icon={
//       <svg 
//         width="20" 
//         height="20" 
//         viewBox="0 0 24 24" 
//         fill="none" 
//         stroke="currentColor" 
//         strokeWidth="2.5" 
//         strokeLinecap="round" 
//         strokeLinejoin="round"
//       >
//         <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
//         <path d="M3 3v5h5" />
//       </svg>
//     }
//   />
// </div>
//   )}
    
//     </Box>
//   );
// };

// export default ApplyMokupDesignPage;




// import { useState, useEffect, Suspense, useRef } from "react";
// import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { Flex } from "@/components/ui/flex";
// import { useImageStore } from "@/store/image.store";
// import { cn } from "@/utils/cn.util";
// import CustomButton from "../components/common/customButton"
// import CustomBlackButton from "../components/common/customBlackButton"
// import { useNavigate } from "react-router";
// import {
//   ChevronDown,
//   ChevronUp,
//   ChevronRight,
//   Minus,
//   Redo2,
//   Undo2,
//   Search,
//   Plus,
//   RotateCw,
// } from "lucide-react";

// // Three.js imports
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { OrbitControls, PerspectiveCamera, Environment, Text } from "@react-three/drei";
// import * as THREE from "three";

// const productOptions = [
//   { id: "cup", label: "Cup", image: "/general/cup.png" },
//   { id: "tshirt", label: "Shirt", image: "/general/tshirt.png" },
//   { id: "lamp", label: "Lamp", image: "/general/lamp.png" },
// ];

// const colorOptions = [
//   { id: "no-color", name: "No Color", value: "none" },
//   { id: "red", name: "Red", value: "#F70353" },
//   { id: "blue", name: "Blue", value: "#3B82F6" },
//   { id: "green", name: "Green", value: "#10B981" },
//   { id: "yellow", name: "Yellow", value: "#EAB308" },
//   { id: "purple", name: "Purple", value: "#A855F7" },
//   { id: "pink", name: "Pink", value: "#EC4899" },
//   { id: "orange", name: "Orange", value: "#F97316" },
//   { id: "black", name: "Black", value: "#000000" },
//   { id: "white", name: "White", value: "#FFFFFF" },
// ];

// // Helper function to convert hex to RGB
// const hexToRgb = (hex: string) => {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result
//     ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16),
//       }
//     : null;
// };

// // Helper function to get hue rotation for color filter
// const getHueRotation = (colorHex: string): number => {
//   const rgb = hexToRgb(colorHex);
//   if (!rgb) return 0;

//   const r = rgb.r / 255;
//   const g = rgb.g / 255;
//   const b = rgb.b / 255;

//   const max = Math.max(r, g, b);
//   const min = Math.min(r, g, b);
//   let h = 0;

//   if (max === min) {
//     h = 0;
//   } else if (max === r) {
//     h = ((g - b) / (max - min)) % 6;
//   } else if (max === g) {
//     h = (b - r) / (max - min) + 2;
//   } else {
//     h = (r - g) / (max - min) + 4;
//   }

//   h = Math.round(h * 60);
//   if (h < 0) h += 360;

//   return h;
// };

// // Three.js Cup Component
// function CupModel({ 
//   texture, 
//   color, 
//   position = { x: 0, y: 0, z: 0 }, 
//   rotation = { x: 0, y: 0, z: 0 },
//   scale = 1,
//   zoomScale = 1,
//   designRotation = 0,
//   isApplied = false
// }: { 
//   texture: THREE.Texture | null; 
//   color: THREE.Color; 
//   position?: { x: number; y: number; z: number };
//   rotation?: { x: number; y: number; z: number };
//   scale?: number;
//   zoomScale?: number;
//   designRotation?: number;
//   isApplied?: boolean;
// }) {
//   const cupRef = useRef<THREE.Mesh>(null);
//   const textureRef = useRef<THREE.Mesh>(null);
  
//   // Create optimized geometry
//   const geometry = useRef<THREE.CylinderGeometry | null>(null);
  
//   useEffect(() => {
//     // Create cup geometry with proper UV mapping
//     if (!geometry.current) {
//       const cupGeometry = new THREE.CylinderGeometry(0.8, 0.7, 1.8, 64, 32, true);
      
//       // Apply custom UV mapping for cylindrical wrapping
//       const uvs = cupGeometry.attributes.uv;
//       const positions = cupGeometry.attributes.position;
      
//       for (let i = 0; i < positions.count; i++) {
//         const x = positions.getX(i);
//         const y = positions.getY(i);
//         const z = positions.getZ(i);
        
//         // Calculate cylindrical coordinates
//         const radius = Math.sqrt(x * x + z * z);
//         const angle = Math.atan2(z, x);
        
//         // Map U (0-1) around circumference
//         let u = (angle + Math.PI) / (2 * Math.PI);
        
//         // Map V (0-1) along height, adjust to avoid rim and bottom
//         let v = (y + 0.9) / 1.8; // y goes from -0.9 to 0.9
//         v = THREE.MathUtils.clamp(v * 0.85 + 0.15, 0.15, 1);
        
//         // Apply position offset
//         u = (u + position.x * 0.01) % 1;
//         v = (v + position.y * 0.01) % 1;
        
//         uvs.setXY(i, u, v);
//       }
      
//       geometry.current = cupGeometry;
//     }
//   }, [position.x, position.y]);

//   useFrame(() => {
//     if (cupRef.current) {
//       // Apply rotations
//       cupRef.current.rotation.x = rotation.x;
//       cupRef.current.rotation.y = rotation.y;
//       cupRef.current.rotation.z = rotation.z;
      
//       // Apply scale
//       cupRef.current.scale.setScalar(scale * (zoomScale / 100));
//     }
    
//     if (textureRef.current && texture) {
//       // Apply design rotation to texture mesh
//       textureRef.current.rotation.z = designRotation * (Math.PI / 180);
//     }
//   });

//   if (!geometry.current) return null;

//   return (
//     <>
//       {/* Base Cup Material */}
//       <mesh ref={cupRef} geometry={geometry.current}>
//         <meshPhysicalMaterial
//           color={color}
//           roughness={0.3}
//           metalness={0.2}
//           clearcoat={0.1}
//           clearcoatRoughness={0.1}
//           side={THREE.DoubleSide}
//         />
//       </mesh>

//       {/* Texture Overlay */}
//       {isApplied && texture && (
//         <mesh ref={textureRef} geometry={geometry.current}>
//           <meshBasicMaterial
//             map={texture}
//             transparent={true}
//             opacity={0.95}
//             side={THREE.DoubleSide}
//             depthWrite={false}
//           />
//         </mesh>
//       )}
//     </>
//   );
// }

// // Three.js Scene Component
// function ThreeScene({
//   selectedImage,
//   imagePosition,
//   zoomScale,
//   rotation,
//   cupFlip,
//   objectRotation,
//   isApplied,
//   selectedColor,
//   selectedProduct
// }: {
//   selectedImage: string;
//   imagePosition: { x: number; y: number };
//   zoomScale: number;
//   rotation: number;
//   cupFlip: 'left' | 'right';
//   objectRotation: number;
//   isApplied: boolean;
//   selectedColor: string;
//   selectedProduct: string;
// }) {
//   const [texture, setTexture] = useState<THREE.Texture | null>(null);
//   const { scene, gl } = useThree();
  
//   // Load texture
//   useEffect(() => {
//     if (!selectedImage || !isApplied) return;
    
//     const loader = new THREE.TextureLoader();
//     loader.load(
//       selectedImage,
//       (loadedTexture) => {
//         loadedTexture.wrapS = THREE.RepeatWrapping;
//         loadedTexture.wrapT = THREE.RepeatWrapping;
//         loadedTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
//         loadedTexture.needsUpdate = true;
//         setTexture(loadedTexture);
//       },
//       undefined,
//       (error) => {
//         console.error('Error loading texture:', error);
//       }
//     );
    
//     return () => {
//       if (texture) {
//         texture.dispose();
//       }
//     };
//   }, [selectedImage, isApplied]);

//   // Convert hex to THREE.Color
//   const getColor = (hex: string) => {
//     if (hex === 'none') return new THREE.Color('#ffffff');
//     return new THREE.Color(hex);
//   };

//   // Calculate rotation based on flip state
//   const flipRotation = cupFlip === 'right' ? Math.PI : 0;
//   const totalRotation = flipRotation + (objectRotation * Math.PI / 180);

//   return (
//     <>
//       <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
//       <OrbitControls
//         enableZoom={false}
//         enablePan={false}
//         enableRotate={true}
//         minPolarAngle={Math.PI / 3}
//         maxPolarAngle={Math.PI / 1.5}
//         minAzimuthAngle={-Math.PI / 2}
//         maxAzimuthAngle={Math.PI / 2}
//         rotateSpeed={0.5}
//       />
//       <ambientLight intensity={0.6} />
//       <directionalLight position={[5, 5, 5]} intensity={1} />
//       <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      
//       <CupModel
//         texture={texture}
//         color={getColor(selectedColor)}
//         position={imagePosition}
//         rotation={{ x: 0, y: totalRotation, z: 0 }}
//         scale={1}
//         zoomScale={zoomScale}
//         designRotation={rotation}
//         isApplied={isApplied}
//       />
//     </>
//   );
// }

// // Three.js Loading Fallback
// function ThreeLoadingFallback() {
//   return (
//     <Box className="w-full h-full flex items-center justify-center">
//       <span className="text-white text-lg">Loading 3D Preview...</span>
//     </Box>
//   );
// }

// const ApplyMokupDesignPage = () => {
//   const selectedImage = useImageStore((state) => state.selectedImage);
//   const [selectedProduct, setSelectedProduct] = useState<string>("cup");
//   const [cupFlip, setCupFlip] = useState<"left" | "right">("left");
//   const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
//   const [zoomScale, setZoomScale] = useState(100);
//   const [rotation, setRotation] = useState(0);
//   const [objectRotation, setObjectRotation] = useState(0);
//   const [isColorsOpen, setIsColorsOpen] = useState(true);
//   const [isApplied, setIsApplied] = useState(false);
//   const [is3DMode, setIs3DMode] = useState(true);

//   const handleZoomIn = () => {
//     setZoomScale((prev) => Math.min(prev + 10, 200));
//   };

//   const handleZoomOut = () => {
//     setZoomScale((prev) => Math.max(prev - 10, 50));
//   };

//   // Three.js specific handlers
//   const handleThreeMouseDown = (e: React.MouseEvent) => {
//     if (!selectedImage) return;
//     setIsDragging(true);
//     setDragStart({
//       x: e.clientX,
//       y: e.clientY,
//     });
//   };

//   const handleThreeMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging || !selectedImage) return;
    
//     const deltaX = e.clientX - dragStart.x;
//     const deltaY = e.clientY - dragStart.y;
    
//     setImagePosition(prev => ({
//       x: prev.x + deltaX * 0.01,
//       y: prev.y - deltaY * 0.01,
//     }));
    
//     setDragStart({ x: e.clientX, y: e.clientY });
//   };

//   const handleThreeMouseUp = () => {
//     setIsDragging(false);
//   };

//   const rotateObjectToLeftSide = () => {
//     setCupFlip("left");
//     setObjectRotation(0);
//   };

//   const rotateObjectToRightSide = () => {
//     setCupFlip("right");
//     setObjectRotation(0);
//   };

//   const navigate = useNavigate();

//   useEffect(() => {
//     return () => {
//       // Cleanup if needed
//     };
//   }, []);

//   return (
//     <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-cover 3xl:bg-center bg-no-repeat overflow-y-auto p-2 xl:p-2 2xl:p-8">
//       <Box className="w-full min-h-screen flex flex-row gap-4 sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12 p-2 xl:p-2 2xl:p-8 max-lg:flex-col max-lg:items-center items-start max-md:justify-start max-md:py-6 max-sm:mt-30 mt-30">
//         {/* Left Side - Product Options Sidebar */}
//         <Box className="flex flex-col items-center ml-18 justify-start gap-1 flex-shrink-0"> 
//           <Box
//             className="relative mb-2 w-[310.9px] xl:w-[380px] 2xl:w-[450px] h-[410px] xl:h-[490px] 2xl:h-[590px] overflow-hidden rounded-[10px] xl:rounded-[12px] 2xl:rounded-[14px]"
//             style={{ fontFamily: "Outfit, sans-serif" }}
//           >
//             {/* Background Frame */}
//             <Box
//               className="absolute inset-0 xl:bg-[length:81%_81%] bg-[length:90%_90%] rounded-[10px]"
//               style={{
//                 backgroundImage: "url('/general/productphotos.png')",
//                 backgroundPosition: "center",
//                 backgroundRepeat: "no-repeat",
//               }}
//             />

//             {/* Product Photos Header */}
//             <Box className="absolute z-10 xl:left-[12%] left-[10%] top-[8.5%] xl:top-[11.5%] 2xl:top-[12.5%]">
//               <Flex className="items-center gap-2 xl:gap-3">
//                 <img
//                   src="/general/cups.png"
//                   alt="icon"
//                   className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 object-cover rounded shadow-sm"
//                 />
//                 <Stack className="gap-0">
//                   <span className="text-[10px] xl:text-[12px] 2xl:text-sm text-[#C1C1C5] leading-none tracking-wider">
//                     Product
//                   </span>
//                   <span className="text-[10px] xl:text-[12px] 2xl:text-sm text-[#C1C1C5] font-medium leading-tight">
//                     Photos
//                   </span>
//                 </Stack>
//                 <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 text-[#C1C1C5]" />
//               </Flex>
//             </Box>

//             {/* Customize Heading */}
//             <Box className="absolute left-[13%] top-[24%] xl:top-[25%] 2xl:top-[27%]">
//               <Flex className="items-center gap-3">
//                 <Box className="w-7 h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 flex-shrink-0">
//                   <img src="/general/squre.png" alt="square" className="w-full h-full" />
//                 </Box>
//                 <span className="text-sm xl:text-base 2xl:text-lg text-white font-light">
//                   Customize Your Designs:
//                 </span>
//               </Flex>
//             </Box>

//             {/* Product Options */}
//             <Box
//               className="absolute
//                 left-[35px] top-[130px]
//                 xl:left-[50px] xl:top-[160px]
//                 2xl:left-[60px] 2xl:top-[212px]
//                 3xl:top-[160px] 2xl:w-[330px] xl:w-[279.16px] w-[240.16px]"
//             >
//               <Flex className="flex-col">
//                 {productOptions.map((product) => (
//                   <Box
//                     key={product.id}
//                     onClick={() => {
//                       setSelectedProduct(product.id);
//                       // Switch to 2D mode for non-cup products
//                       if (product.id !== 'cup') {
//                         setIs3DMode(false);
//                       }
//                     }}
//                     className={cn(
//                       "cursor-pointer rounded-lg p-3 transition-all duration-200 xl:rounded-xl 2xl:rounded-2xl flex items-center gap-3 xl:gap-4 2xl:gap-5",
//                       selectedProduct === product.id
//                         ? "border border-[#F70353] xl:border-2 2xl:border-2"
//                         : "border border-transparent hover:bg-[#29292D]/70"
//                     )}
//                     style={
//                       selectedProduct === product.id
//                         ? {
//                             background: `linear-gradient(to bottom, rgba(247, 3, 83, 0.06) 0%, rgba(247, 3, 83, 0.06) 73%, rgba(23, 7, 38, 1) 100%)`,
//                             borderColor: "#F70353",
//                             borderWidth: "1px",
//                           }
//                         : {
//                             background: `linear-gradient(to top, rgba(23, 7, 38, 1) 0%, rgba(23, 7, 38, 1) 73%, rgba(23, 7, 38, 1) 100%)`,
//                             borderColor: "#170726",
//                             borderWidth: "1px",
//                           }
//                     }
//                   >
//                     {/* Product Image */}
//                     <Box className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 flex-shrink-0 rounded-lg xl:rounded-xl 2xl:rounded-2xl overflow-hidden bg-[#29292D]/50">
//                       <img
//                         src={product.image}
//                         alt={product.label}
//                         className="w-full h-full object-cover"
//                       />
//                     </Box>

//                     {/* Product Text */}
//                     <Flex className="flex-col flex-1 min-w-0">
//                       <span
//                         className="text-sm xl:text-base 2xl:text-lg"
//                         style={{
//                           fontFamily: "Outfit",
//                           fontStyle: "normal",
//                           fontWeight: selectedProduct === product.id ? 500 : 300,
//                           fontSize: "14px",
//                           lineHeight: "20px",
//                           color: selectedProduct === product.id ? "#FFFFFF" : "#C1C1C5",
//                         }}
//                       >
//                         Apply your design on {product.label}
//                       </span>
//                     </Flex>

//                     {/* Chevron Right Icon */}
//                     <ChevronRight className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-[#C1C1C5] flex-shrink-0" />
//                   </Box>
//                 ))}
//               </Flex>
//             </Box>
//           </Box>

//           {/* Design Card & Checkout */}
//           {selectedImage && (
//             <Box className="flex flex-col gap-1 items-center w-full max-w-[350px] mx-auto">
//               {/* Design "Tray" Card */}
//               <div 
//                 className="relative w-[330px] h-[210px] bg-no-repeat bg-contain" 
//                 style={{ backgroundImage: "url('/general/applybg.png')" }}
//               >
//                 <div className="absolute bg-[#130E29]/50 backdrop-blur-xl border border-white/10 rounded-[30px] p-4 top-[33.7%] left-[10px] right-[10px] flex items-center justify-between">
//                   <div className="w-[85px] h-[85px] rounded-2xl overflow-hidden border border-white/10">
//                     <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
//                   </div>
//                   <CustomButton
//                     title={isApplied ? "Applied" : "Apply"}
//                     onClick={() => setIsApplied(true)}
//                     wrapperClassName={cn("w-[140px] h-[52px] rounded-[18px]", isApplied && "bg-none shadow-none")}
//                   />
//                 </div>
//               </div>

//               {/* Checkout Button */}
//               <Box className="w-full items-center text-center px-2">
//                 <CustomButton
//                   title="Continue to Checkout"
//                   onClick={() => navigate("/checkout")}
//                   icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>}
//                   wrapperClassName="w-[96%] h-[60px] rounded-[25px]"
//                   className="text-[18px]"
//                 />
//               </Box>
//             </Box>
//           )}
//         </Box>

//         {/* Center - Product Mockup with Three.js */}
//         <Box className="flex-1 flex items-center justify-center min-w-0 max-md:w-full max-md:flex-1 max-md:mt-4">
//           <Stack className="w-full max-w-[650px] xl:max-w-[800px] 2xl:max-w-[950px] items-center justify-center">
//             <Center
//               className="w-full bg-transparent p-2 xl:p-3 2xl:p-4 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[550px] 2xl:h-[650px] rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-hidden relative"
//               style={{ userSelect: "none" }}
//             >
//               {selectedProduct === "cup" && is3DMode ? (
//                 // Three.js Canvas for cup
//                 <div 
//                   className="w-full h-full"
//                   onMouseDown={handleThreeMouseDown}
//                   onMouseMove={handleThreeMouseMove}
//                   onMouseUp={handleThreeMouseUp}
//                   onMouseLeave={handleThreeMouseUp}
//                 >
//                   <Canvas
//                     shadows
//                     dpr={[1, 2]}
//                     className={cn(
//                       "w-full h-full",
//                       isDragging ? "cursor-grabbing" : "cursor-grab"
//                     )}
//                   >
//                     <Suspense fallback={null}>
//                       <ThreeScene
//                         selectedImage={selectedImage || ""}
//                         imagePosition={imagePosition}
//                         zoomScale={zoomScale}
//                         rotation={rotation}
//                         cupFlip={cupFlip}
//                         objectRotation={objectRotation}
//                         isApplied={isApplied}
//                         selectedColor={selectedColor.value}
//                         selectedProduct={selectedProduct}
//                       />
//                     </Suspense>
//                   </Canvas>
//                   {!selectedImage && (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <span className="text-white/60 text-lg">Upload an image to see preview</span>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 // Fallback to 2D for other products or when 3D is disabled
//                 <Box className="relative w-full h-full flex items-center justify-center">
//                   {(() => {
//                     const currentProduct = productOptions.find(
//                       (p) => p.id === selectedProduct
//                     );
//                     if (!currentProduct) return null;

//                     return (
//                       <Box
//                         className="relative w-full h-full flex items-center justify-center"
//                         onMouseMove={handleThreeMouseMove}
//                         onMouseUp={handleThreeMouseUp}
//                         onMouseLeave={handleThreeMouseUp}
//                       >
//                         {/* Product Base Image with Color Overlay */}
//                         <Box
//                           className="relative w-full h-full flex items-center justify-center"
//                           style={{
//                             transform: `
//                               scaleX(${cupFlip === "right" ? -1 : 1})
//                               rotate(${objectRotation}deg)
//                             `,
//                             transformStyle: "preserve-3d",
//                             transition: "transform 0.3s ease",
//                           }}
//                         >
//                           <img
//                             src={currentProduct.image}
//                             alt={currentProduct.label}
//                             className="w-full h-full object-contain"
//                             style={{
//                               filter:
//                                 selectedColor.value === "#FFFFFF"
//                                   ? "brightness(1.1)"
//                                   : selectedColor.value === "#000000"
//                                   ? "brightness(0.7)"
//                                   : `hue-rotate(${getHueRotation(
//                                       selectedColor.value
//                                     )}) saturate(1.2)`,
//                             }}
//                           />
//                           {/* Color Overlay */}
//                           {selectedColor.value !== "none" && (
//                             <Box
//                               className="absolute inset-0"
//                               style={{
//                                 backgroundColor: selectedColor.value,
//                                 mixBlendMode: "multiply",
//                                 opacity: 0.7,
//                                 pointerEvents: "none",
//                                 maskImage: `url(${currentProduct.image})`,
//                                 maskSize: "contain",
//                                 maskRepeat: "no-repeat",
//                                 maskPosition: "center",
//                                 WebkitMaskImage: `url(${currentProduct.image})`,
//                                 WebkitMaskSize: "contain",
//                                 WebkitMaskRepeat: "no-repeat",
//                                 WebkitMaskPosition: "center",
//                               }}
//                             />
//                           )}
//                         </Box>

//                         {/* User's Image Overlay - ONLY SHOWS IF APPLIED */}
//                         {selectedImage && isApplied && (
//                           <Box
//                             className="absolute inset-0 flex items-center justify-center"
//                             style={{
//                               maskSize: "contain",
//                               maskRepeat: "no-repeat",
//                               maskPosition: "center", 
//                               maskImage: `url(${currentProduct.image})`,
//                               WebkitMaskImage: `url(${currentProduct.image})`,
//                               WebkitMaskSize: "contain",
//                               WebkitMaskRepeat: "no-repeat",
//                               WebkitMaskPosition: "center",
//                               clipPath: selectedProduct === "cup" ? "inset(13% 0% 6% 0%)" : "none",
//                               overflow: "hidden",
//                               perspective: selectedProduct === "cup" ? "600px" : "none",
//                               perspectiveOrigin: "50% 50%",
//                               transform: `
//                                 scaleX(${cupFlip === "right" ? -1 : 1})
//                                 rotate(${objectRotation}deg)
//                               `,
//                               transformStyle: "preserve-3d",
//                               transition: "transform 0.3s ease",
//                             }}
//                           >
//                             <Box
//                               className={cn(
//                                 "relative",
//                                 isDragging ? "cursor-grabbing" : "cursor-grab"
//                               )}
//                               style={{
//                                 width: "100%",
//                                 height: "82%",
//                                 position: "absolute",
//                                 top: "13%",
//                                 left: "0%",
//                                 transform: `
//                                   translate(${imagePosition.x}px, ${imagePosition.y}px) 
//                                   scale(${zoomScale / 100})
//                                   rotate(${rotation}deg)
//                                 `,
//                                 transformOrigin: "center center",
//                                 transformStyle: "preserve-3d",
//                                 pointerEvents: "auto",
//                                 userSelect: "none",
//                                 transition: isDragging ? "none" : "transform 0.1s ease",
//                               }}
//                               onMouseDown={handleThreeMouseDown}
//                             >
//                               <img
//                                 src={selectedImage}
//                                 alt="design-overlay"
//                                 className="w-full h-full"
//                                 style={{
//                                   objectFit: "cover",
//                                   filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.4))",
//                                   transform: selectedProduct === "cup"
//                                     ? `perspective(400px) rotateY(0deg) scaleX(1) scaleY(1.05)`
//                                     : "none",
//                                 }}
//                                 draggable={false}
//                               />
//                             </Box>
//                           </Box>
//                         )}
//                       </Box>
//                     );
//                   })()}
//                 </Box>
//               )}
              
//               {/* 3D/2D Toggle Button (only for cup) */}
//               {selectedProduct === "cup" && (
//                 <button
//                   onClick={() => setIs3DMode(!is3DMode)}
//                   className="absolute top-4 right-4 px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white text-sm rounded-lg backdrop-blur-sm border border-white/10 z-10"
//                 >
//                   {is3DMode ? "Switch to 2D" : "Switch to 3D"}
//                 </button>
//               )}
//             </Center>
//           </Stack>
//         </Box>

//         {/* Right Side - Functional Controls */}
//         <Box className="flex flex-col items-center justify-center gap-4 mr-18 xl:gap-8 flex-shrink-0 bg-transparent">
//           {/* SELECT COLORS SECTION */}
//           <Box 
//             className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 rounded-[20px] border border-white/10 overflow-hidden bg-cover bg-center shadow-2xl transition-all duration-300"
//             style={{ backgroundImage: "url('/general/specialbg.png')" }}
//           >
//             <Flex 
//               className="items-center justify-between mb-3 cursor-pointer select-none"
//               onClick={() => setIsColorsOpen(!isColorsOpen)}
//             >
//               <Flex className="items-center gap-2">
//                 <Box className="w-5 h-5 flex items-center justify-center">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                     <circle cx="12" cy="8" r="5" fill="#00BED5" fillOpacity="0.8"/>
//                     <circle cx="8" cy="15" r="5" fill="#FF3A02" fillOpacity="0.8"/>
//                     <circle cx="16" cy="15" r="5" fill="#FBAF00" fillOpacity="0.8"/>
//                   </svg>
//                 </Box>
//                 <span className="text-white text-base font-medium">Select Colors</span>
//               </Flex>
              
//               <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/20">
//                 {isColorsOpen ? (
//                   <ChevronUp className="w-4 h-4 text-white" />
//                 ) : (
//                   <ChevronDown className="w-4 h-4 text-white" />
//                 )}
//               </button>
//             </Flex>

//             {/* Color List Container */}
//             <Box 
//               className={`transition-all duration-500 ease-in-out overflow-hidden ${
//                 isColorsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//               }`}
//             >
//               <Box className="rounded-xl overflow-hidden border border-white/10 mt-1">
//                 {[
//                   { name: "Conquelicot", hex: "#FF3A02" },
//                   { name: "Arlequin", hex: "#70E22B" },
//                   { name: "Violet", hex: "#9C04ED" },
//                   { name: "Purple", hex: "#6B1BFF" },
//                   { name: "Chrome", hex: "#FBAF00" },
//                   { name: "Blaze", hex: "#FF6E01" },
//                   { name: "Turquoise", hex: "#00BED5" },
//                   { name: "Chestnut", hex: "#9A614D" },
//                 ].map((color, idx) => (
//                   <Flex 
//                     key={idx} 
//                     onClick={() => setSelectedColor({ id: color.name, name: color.name, value: color.hex })}
//                     className="px-3 py-1.5 justify-between items-center cursor-pointer hover:brightness-125 transition-all"
//                     style={{ backgroundColor: color.hex }}
//                   >
//                     <span className="text-white text-[10px] font-bold uppercase tracking-wider">{color.name}</span>
//                     <span className="text-white text-[10px] font-mono font-bold">{color.hex}</span>
//                   </Flex>
//                 ))}
//               </Box>
//             </Box>
//           </Box>

//           {/* SCALE SECTION */}
//           <Box 
//             className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//             style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//           >
//             <Flex className="items-center gap-3 mb-4">
//               <Box className="p-3 bg-[#4A0E64] rounded-lg border border-white/10">
//                 <Search className="w-6 h-6 text-white" />
//               </Box>
//               <span className="text-white/80 text-lg font-normal">Scale</span>
//             </Flex>

//             <Flex className="items-center mt-10 justify-between px-2">
//               <button 
//                 onClick={handleZoomOut}
//                 className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//               >
//                 <Minus className="w-6 h-6 text-white" />
//               </button>
              
//               <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//                 {zoomScale}%
//               </span>
              
//               <button 
//                 onClick={handleZoomIn}
//                 className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//               >
//                 <Plus className="w-6 h-6 text-white" />
//               </button>
//             </Flex>
//           </Box>

//           {/* DESIGN ROTATION SECTION */}
//           <Box 
//             className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//             style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//           >
//             <Flex className="items-center gap-3 mb-4">
//               <Box className="p-3 bg-[#401F45] rounded-lg border border-white/10">
//                 <RotateCw className="w-6 h-6 text-[#F70353]" />
//               </Box>
//               <span className="text-white/80 text-lg font-normal">Design Rotation</span>
//             </Flex>

//             <Flex className="items-center mt-10 justify-between px-2">
//               <button 
//                 onClick={() => setRotation((prev) => prev - 15)}
//                 className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//               >
//                 <Undo2 className="w-6 h-6 text-white" />
//               </button>
              
//               <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//                 {rotation}°
//               </span>
              
//               <button 
//                 onClick={() => setRotation((prev) => prev + 15)}
//                 className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//               >
//                 <Redo2 className="w-6 h-6 text-white" />
//               </button>
//             </Flex>
//           </Box>

//           {/* OBJECT ROTATION SECTION */}
//           <Box 
//             className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//             style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//           >
//             <Flex className="items-center gap-3 mb-4">
//               <Box className="p-3 bg-[#2D1B45] rounded-lg border border-white/10">
//                 <RotateCw className="w-6 h-6 text-[#00BED5]" />
//               </Box>
//               <span className="text-white/80 text-lg font-normal">Object Rotation</span>
//             </Flex>

//             <Flex className="items-center mt-10 justify-between px-2">
//               <button 
//                 onClick={rotateObjectToLeftSide}
//                 className="w-14 h-12 flex flex-col items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all group"
//                 title="Show Left Side"
//               >
//                 <Undo2 className="w-5 h-5 text-white" />
//               </button>
              
//               <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//                 {cupFlip === "left" ? "Left" : "Right"}
//               </span>
              
//               <button 
//                 onClick={rotateObjectToRightSide}
//                 className="w-14 h-12 flex flex-col items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all group"
//                 title="Show Right Side"
//               >
//                 <Redo2 className="w-5 h-5 text-white" />
//               </button>
//             </Flex>
//           </Box>
//         </Box>
//       </Box>

//       {isApplied && (
//         <div className="absolute lg:top-[140px] top-[110px] left-[45%] z-50"> 
//           <CustomBlackButton
//             wrapperClassName="w-fit px-[2px] h-[48px] rounded-full" 
//             className="rounded-full px-4 text-[14px] sm:text-[16px] md:text-[18px]"
//             title="Reset"
//             onClick={() => {
//               setIsApplied(false);
//               setRotation(0); 
//               setObjectRotation(0);
//               setCupFlip("left");
//               setZoomScale(100); 
//               setImagePosition({ x: 0, y: 0 });
//               setIs3DMode(true);
//             }}
//             icon={
//               <svg 
//                 width="20" 
//                 height="20" 
//                 viewBox="0 0 24 24" 
//                 fill="none" 
//                 stroke="currentColor" 
//                 strokeWidth="2.5" 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round"
//               >
//                 <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
//                 <path d="M3 3v5h5" />
//               </svg>
//             }
//           />
//         </div>
//       )}
//     </Box>
//   );
// };

// export default ApplyMokupDesignPage;



// import { useState,useEffect } from "react";
// import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { Flex } from "@/components/ui/flex";
// import { useImageStore } from "@/store/image.store";
// import { cn } from "@/utils/cn.util";
// import CustomButton from "../components/common/customButton"
// import CustomBlackButton from "../components/common/customBlackButton"
// // import { toast } from "sonner";
// import { useNavigate } from "react-router";
// import {
//   ChevronDown,
//   ChevronUp,
//   ChevronRight,
//   Minus,
//   Redo2,
//   Undo2,
//   Search,
//   Plus,
//   RotateCw,
// } from "lucide-react";

// const productOptions = [
//   { id: "cup", label: "Cup", image: "/general/cup.png" },
//   { id: "tshirt", label: "Shirt", image: "/general/tshirt.png" }, // Add tshirt.png when available
//   // { id: "lamp", label: "Lamp", image: "/general/lamp.png" }, // Add lamp.png when available
// ];

// const colorOptions = [
//   { id: "no-color", name: "No Color", value: "none" },
//   { id: "red", name: "Red", value: "#F70353" },
//   { id: "blue", name: "Blue", value: "#3B82F6" },
//   { id: "green", name: "Green", value: "#10B981" },
//   { id: "yellow", name: "Yellow", value: "#EAB308" },
//   { id: "purple", name: "Purple", value: "#A855F7" },
//   { id: "pink", name: "Pink", value: "#EC4899" },
//   { id: "orange", name: "Orange", value: "#F97316" },
//   { id: "black", name: "Black", value: "#000000" },
//   { id: "white", name: "White", value: "#FFFFFF" },
// ];

// // Helper function to convert hex to RGB
// const hexToRgb = (hex: string) => {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result
//     ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16),
//       }
//     : null;
// };

// // Helper function to get hue rotation for color filter
// const getHueRotation = (colorHex: string): number => {
//   const rgb = hexToRgb(colorHex);
//   if (!rgb) return 0;

//   const r = rgb.r / 255;
//   const g = rgb.g / 255;
//   const b = rgb.b / 255;

//   const max = Math.max(r, g, b);
//   const min = Math.min(r, g, b);
//   let h = 0;

//   if (max === min) {
//     h = 0;
//   } else if (max === r) {
//     h = ((g - b) / (max - min)) % 6;
//   } else if (max === g) {
//     h = (b - r) / (max - min) + 2;
//   } else {
//     h = (r - g) / (max - min) + 4;
//   }

//   h = Math.round(h * 60);
//   if (h < 0) h += 360;

//   return h;
// };

// const ApplyMokupDesignPage = () => {
// const selectedImage = useImageStore((state) => state.selectedImage);
//   const [selectedProduct, setSelectedProduct] = useState<string>("cup");
//   const [cupFlip, setCupFlip] = useState<"left" | "right">("left"); // Changed from const to state
//   const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
//   const [zoomScale, setZoomScale] = useState(100);
//   const [rotation, setRotation] = useState(0); // Design rotation
//   const [objectRotation, setObjectRotation] = useState(0); // New: Object rotation
//   const [isColorsOpen, setIsColorsOpen] = useState(true);
//   const [isApplied, setIsApplied] = useState(false);

//   const handleZoomIn = () => {
//     setZoomScale((prev) => Math.min(prev + 10, 200));
//   };

//   const handleZoomOut = () => {
//     setZoomScale((prev) => Math.max(prev - 10, 50));
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (!selectedImage) return;
//     setIsDragging(true);
//     setDragStart({
//       x: e.clientX - imagePosition.x,
//       y: e.clientY - imagePosition.y,
//     });
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging || !selectedImage) return;
//     setImagePosition({
//       x: e.clientX - dragStart.x,
//       y: e.clientY - dragStart.y,
//     });
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

// const rotateObjectToLeftSide = () => {
//     setCupFlip("left"); // Show left side (normal view)
//     setObjectRotation(0); // Reset any rotation
//   };


//  const rotateObjectToRightSide = () => {
//     setCupFlip("right"); // Show right side (flipped view)
//     setObjectRotation(0); // Reset any rotation
//   };

//   const navigate = useNavigate();

//   useEffect(() => {
//   return () => {
//     // Optional: Clear selected image when leaving page
//     // useImageStore.getState().clearSelectedImage();
//   };
// }, []);

//   return (
//     <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-cover 3xl:bg-center bg-no-repeat overflow-y-auto p-2 xl:p-2 2xl:p-8">
     
//       <Box  className="w-full min-h-screen flex flex-row gap-4 sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12 p-2 xl:p-2 2xl:p-8 max-lg:flex-col max-lg:items-center items-start max-md:justify-start max-md:py-6 max-sm:mt-30 mt-30">
   
//    {/* Left Side - Product Options Sidebar */}
// <Box className="flex flex-col items-center ml-18 justify-start gap-1 flex-shrink-0"> 
//  <Box
//     className="relative mb-2 w-[310.9px] xl:w-[380px] 2xl:w-[450px] h-[410px] xl:h-[490px] 2xl:h-[590px] overflow-hidden rounded-[10px] xl:rounded-[12px] 2xl:rounded-[14px]"
//     style={{ fontFamily: "Outfit, sans-serif" }}
//   >
//     {/* Background Frame - Set to 100% to ensure it scales perfectly */}
//     <Box
//       className="absolute inset-0 xl:bg-[length:81%_81%] bg-[length:90%_90%] rounded-[10px]"
//       style={{
//         backgroundImage: "url('/general/productphotosss.svg')",
//         // backgroundSize: "81% 81%",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     />

//     {/* 1. Product Photos Header - Positioned by % for perfect gap from Top/Left */}
//     <Box className="absolute z-10 xl:left-[12%] left-[7%] top-[17%] xl:top-[20%] 2xl:top-[20.3%]">
//       <Flex className="items-center gap-2 xl:gap-3">
//         <img
//           src="/general/cups.png"
//           alt="icon"
//           className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 object-cover rounded shadow-sm"
//         />
//         <Stack className="gap-0">
//           <span className="text-[10px] xl:text-[12px] 2xl:text-sm text-[#C1C1C5] leading-none  tracking-wider">
//             Product
//           </span>
//           <span className="text-[10px] xl:text-[12px] 2xl:text-sm  text-[#C1C1C5] font-medium leading-tight">
//             Photos
//           </span>
//         </Stack>
//         <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 text-[#C1C1C5]" />
//       </Flex>
//     </Box>

//     {/* 2. Customize Heading - Responsive vertical spacing */}
//     <Box className="absolute left-[13%] top-[32%] xl:top-[32%] 2xl:top-[33%]">
//       <Flex className="items-center gap-3">
//         <Box className="w-7 h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 flex-shrink-0">
//           <img src="/general/squre.png" alt="square" className="w-full h-full" />
//         </Box>
//         <span className="text-sm xl:text-base 2xl:text-lg text-white font-light">
//           Customize Your Designs:
//         </span>
//       </Flex>
//     </Box>

   
//             {/* Product Options */}
//             <Box
//               className="absolute
//     left-[35px]  top-[166px]
//     xl:left-[50px]  xl:top-[200px]
//     2xl:left-[60px]  2xl:top-[252px]
//     3xl:top-[160px] 2xl:w-[330px] xl:w-[279.16px] w-[240.16px]"
//               style={{
//                 // width: ".16px",
//               }}
//             >
//               <Flex className="flex-col">
//                 {productOptions.map((product) => (
//                   <Box
//                     key={product.id}
//                     onClick={() => setSelectedProduct(product.id)}
//                     className={cn(
//                       "cursor-pointer rounded-lg p-3 transition-all duration-200 xl:rounded-xl 2xl:rounded-2xl flex items-center gap-3 xl:gap-4 2xl:gap-5",
//                       selectedProduct === product.id
//                         ? "border border-[#F70353] xl:border-2 2xl:border-2"
//                         : "border border-transparent hover:bg-[#29292D]/70"
//                     )}
//                     style={
//                       selectedProduct === product.id
//                         ? {
//                             background: `linear-gradient(to bottom, rgba(247, 3, 83, 0.06) 0%, rgba(247, 3, 83, 0.06) 73%, rgba(23, 7, 38, 1) 100%)`,
//                             borderColor: "#F70353",
//                             borderWidth: "1px",
//                           }
//                         : {
//                             background: `linear-gradient(to top, rgba(23, 7, 38, 1) 0%, rgba(23, 7, 38, 1) 73%, rgba(23, 7, 38, 1) 100%)`,
//                             borderColor: "#170726",
//                             borderWidth: "1px",
//                           }
//                     }
//                   >
//                     {/* Product Image */}
//                     <Box className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 flex-shrink-0 rounded-lg xl:rounded-xl 2xl:rounded-2xl overflow-hidden bg-[#29292D]/50">
//                       <img
//                         src={product.image}
//                         alt={product.label}
//                         className="w-full h-full object-cover"
//                       />
//                     </Box>

//                     {/* Product Text */}
//                     <Flex className="flex-col flex-1 min-w-0">
//                       <span
//                         className="text-sm xl:text-base 2xl:text-lg"
//                         style={{
//                           fontFamily: "Outfit",
//                           fontStyle: "normal",
//                           fontWeight:
//                             selectedProduct === product.id ? 500 : 300,
//                           fontSize: "14px",
//                           lineHeight: "20px",
//                           color:
//                             selectedProduct === product.id
//                               ? "#FFFFFF"
//                               : "#C1C1C5",
//                         }}
//                       >
//                         Apply your design on {product.label}
//                       </span>
//                     </Flex>

//                     {/* Chevron Right Icon */}
//                     <ChevronRight className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-[#C1C1C5] flex-shrink-0" />
//                   </Box>
//                 ))}
//               </Flex>
//             </Box>
            
//   </Box>

//   {/* 2. BOTTOM SECTION: Design Card & Checkout (Reduced gaps) */}
//   {selectedImage && (
//     <Box className="flex flex-col gap-1 items-center w-full max-w-[350px] mx-auto">
      
//       {/* Design "Tray" Card */}
//       <div 
//         className="relative w-[330px] h-[210px] bg-no-repeat bg-contain" 
//         style={{ backgroundImage: "url('/general/applybg.png')" }}
//       >
//         <div className="absolute bg-[#130E29]/50 backdrop-blur-xl border border-white/10 rounded-[30px] p-4 top-[33.7%] left-[10px] right-[10px] flex items-center justify-between">
//           <div className="w-[85px] h-[85px] rounded-2xl overflow-hidden border border-white/10">
//             <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
//           </div>
//           <CustomButton
//             title={isApplied ? "Applied" : "Apply"}
//             onClick={() => setIsApplied(true)}
//             wrapperClassName={cn("w-[140px] h-[52px] rounded-[18px]", isApplied && "bg-none shadow-none")}
//           />
//         </div>
//       </div>

//       {/* Checkout Button (Almost no gap from tray card) */}
//       <Box className="w-full items-center text-center px-2">
//         <CustomButton
//           title="Continue to Checkout"
//           onClick={() => navigate("/checkout")}
//           icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>}
//           wrapperClassName="w-[96%] h-[60px] rounded-[25px]"
//           className="text-[18px]"
//         />
//       </Box>

//       {/* {isApplied && (
//         <button onClick={() => setIsApplied(false)} className="mt-2 text-white/40 text-xs underline">
//           Remove design from object
//         </button>
//       )} */}
//     </Box>
//   )}
// </Box>        {/* Center - Product Mockup with Image Overlay */}
//         <Box className="flex-1 flex items-center justify-center min-w-0 max-md:w-full max-md:flex-1 max-md:mt-4">
//           <Stack className="w-full max-w-[650px] xl:max-w-[800px] 2xl:max-w-[950px] items-center justify-center">
//             <Center
//               className="w-full bg-transparent p-2 xl:p-3 2xl:p-4 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[550px] 2xl:h-[650px] rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-visible relative"
//               style={{ userSelect: "none" }}
//             >
//               {(() => {
//                 const currentProduct = productOptions.find(
//                   (p) => p.id === selectedProduct
//                 );
//                 if (!currentProduct) return null;

//                 return (
//                   <Box
//                     className="relative w-full h-full flex items-center justify-center"
//                     onMouseMove={handleMouseMove}
//                     onMouseUp={handleMouseUp}
//                     onMouseLeave={handleMouseUp}
//                   >
//                     {/* Product Base Image with Color Overlay - Flippable and Rotatable */}
//                    <Box
//   className="relative w-full h-full flex items-center justify-center"
//   style={{
//     transform: `
//       scaleX(${cupFlip === "right" ? -1 : 1})
//       rotate(${objectRotation}deg)
//     `,
//     transformStyle: "preserve-3d",
//     transition: "transform 0.3s ease",
//   }}

//                     >
//                       <img
//                         src={currentProduct.image}
//                         alt={currentProduct.label}
//                         className="w-full h-full object-contain"
//                         style={{
//                           filter:
//                             selectedColor.value === "#FFFFFF"
//                               ? "brightness(1.1)"
//                               : selectedColor.value === "#000000"
//                               ? "brightness(0.7)"
//                               : `hue-rotate(${getHueRotation(
//                                   selectedColor.value
//                                 )}) saturate(1.2)`,
//                         }}
//                       />
//                       {/* Color Overlay - using mask like before */}
//                       {selectedColor.value !== "none" && (
//                         <Box
//                           className="absolute inset-0"
//                           style={{
//                             backgroundColor: selectedColor.value,
//                             mixBlendMode: "multiply",
//                             opacity: 0.7,
//                             pointerEvents: "none",
//                             // Mask to cup shape - only tints the product, not background
//                             maskImage: `url(${currentProduct.image})`,
//                             maskSize: "contain",
//                             maskRepeat: "no-repeat",
//                             maskPosition: "center",
//                             WebkitMaskImage: `url(${currentProduct.image})`,
//                             WebkitMaskSize: "contain",
//                             WebkitMaskRepeat: "no-repeat",
//                             WebkitMaskPosition: "center",
//                           }}
//                         />
//                       )}
//                     </Box>

//                     {/* User's Image Overlay - ONLY SHOWS IF APPLIED */}
//                     {selectedImage && isApplied && (
//   <Box
//     className="absolute inset-0 flex items-center justify-center"
//     style={{
//                           // Mask to cup shape - only show on cup
//                           maskSize: "contain",
//                           maskRepeat: "no-repeat",
//                           maskPosition: "center", 
//                           maskImage: `url(${currentProduct.image})`,
//                           WebkitMaskImage: `url(${currentProduct.image})`,
//                           WebkitMaskSize: "contain",
//                           WebkitMaskRepeat: "no-repeat",
//                           WebkitMaskPosition: "center",
//                           // Clip to exclude rim/inside area - allow full wrap
//                           clipPath:
//                             selectedProduct === "cup"
//                               ? "inset(13% 0% 6% 0%)"
//                               : "none",
//                           overflow: "hidden",
//                           // 3D perspective for cylindrical effect
//                           perspective:
//                             selectedProduct === "cup" ? "600px" : "none",
//                           perspectiveOrigin: "50% 50%",
//                           // Sync with cup flip
//                           transform: `
//         scaleX(${cupFlip === "right" ? -1 : 1})
//         rotate(${objectRotation}deg)
//       `,
//                           transformStyle: "preserve-3d",
//                           transition: "transform 0.3s ease",
//                         }}
//                       >
//                         {/* Container - Full width for wrapping around cup */}
//                         <Box
//                           className={cn(
//                             "relative",
//                             isDragging ? "cursor-grabbing" : "cursor-grab"
//                           )}
//                           style={{
//                             width: selectedProduct === "cup" ? "100%" : "100%",
//                             height: selectedProduct === "cup" ? "82%" : "100%",
//                             position: "absolute",
//                             top: selectedProduct === "cup" ? "13%" : "0%",
//                             left: selectedProduct === "cup" ? "0%" : "0%",
                            
//                             // Transform includes design rotation and object rotation
//                             transform: `
//                               translate(${imagePosition.x}px, ${imagePosition.y}px) 
//                               scale(${zoomScale / 100})
//                               rotate(${rotation}deg)
//                             `,
                            
//                             transformOrigin: "center center",
//                             transformStyle: "preserve-3d",
//                             pointerEvents: "auto",
//                             userSelect: "none",
//                             transition: isDragging ? "none" : "transform 0.1s ease",
//                           }}
//                           onMouseDown={handleMouseDown}
//                         >
//                           {/* Image with cylindrical wrap */}
//                           <img
//                             src={selectedImage}
//                             alt="design-overlay"
//                             className="w-full h-full"
//                             style={{
//                               objectFit: "cover",
//                               filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.4))",
//                               transform: selectedProduct === "cup"
//                                   ? `perspective(400px) rotateY(0deg) scaleX(1) scaleY(1.05)`
//                                   : "none",
//                               willChange: "transform",
//                             }}
//                             draggable={false}
//                           />
//                         </Box>
//                       </Box>
//                     )}
//                   </Box>
//                 );
//               })()}
//             </Center>
//           </Stack>
//         </Box>  

//         {/* Right Side - Functional Controls */}
// <Box className="flex flex-col items-center justify-center gap-4 mr-18 xl:gap-8 flex-shrink-0 bg-transparent">
  
// {/* 1. SELECT COLORS SECTION */}
// <Box 
//   className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 rounded-[20px] border border-white/10 overflow-hidden bg-cover bg-center shadow-2xl transition-all duration-300"
//   style={{ backgroundImage: "url('/general/specialbg.png')" }}
// >
//   {/* Header - Toggles Dropdown */}
//   <Flex 
//     className="items-center justify-between mb-3 cursor-pointer select-none"
//     onClick={() => setIsColorsOpen(!isColorsOpen)}
//   >
//     <Flex className="items-center gap-2">
//       <Box className="w-5 h-5 flex items-center justify-center">
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <circle cx="12" cy="8" r="5" fill="#00BED5" fillOpacity="0.8"/>
//               <circle cx="8" cy="15" r="5" fill="#FF3A02" fillOpacity="0.8"/>
//               <circle cx="16" cy="15" r="5" fill="#FBAF00" fillOpacity="0.8"/>
//           </svg>
//       </Box>
//       <span className="text-white text-base font-medium">Select Color</span>
//     </Flex>
    
//     <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/20">
//       {isColorsOpen ? (
//         <ChevronUp className="w-4 h-4 text-white" />
//       ) : (
//         <ChevronDown className="w-4 h-4 text-white" />
//       )}
//     </button>
//   </Flex>

//   {/* Color List Container */}
//   <Box 
//     className={`transition-all duration-500 ease-in-out overflow-hidden ${
//       isColorsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//     }`}
//   >
//     {/* Display Selected Color Name Highlighted */}
//     <div className="px-1 mb-2">
//        <span className="text-[#C1C1C5] text-[11px] uppercase tracking-[2px]">Current: </span>
//        <span className="text-white text-[11px] font-bold uppercase tracking-[2px]">{selectedColor.name}</span>
//     </div>

//     <Box className="grid grid-cols-1 gap-1 mt-1">
//       {[
//         { name: "Conquelicot", hex: "#FF3A02" },
//         { name: "Arlequin", hex: "#70E22B" },
//         { name: "Violet", hex: "#9C04ED" },
//         { name: "Purple", hex: "#6B1BFF" },
//         { name: "Chrome", hex: "#FBAF00" },
//         { name: "Blaze", hex: "#FF6E01" },
//         { name: "Turquoise", hex: "#00BED5" },
//         { name: "Chestnut", hex: "#9A614D" },
//       ].map((color, idx) => (
//         <Flex 
//           key={idx} 
//           onClick={() => setSelectedColor({ id: color.name, name: color.name, value: color.hex })}
//           className={cn(
//             "px-3 py-2 justify-between items-center cursor-pointer rounded-lg transition-all duration-200 group",
//             selectedColor.id === color.name ? "bg-white/10 border border-white/20" : "hover:bg-white/5 border border-transparent"
//           )}
//         >
//           {/* Color Name */}
//           <span className={cn(
//             "text-[12px] font-medium tracking-wide transition-colors",
//             selectedColor.id === color.name ? "text-white" : "text-[#C1C1C5] group-hover:text-white"
//           )}>
//             {color.name}
//           </span>

//           {/* Clickable Circular Color Dot */}
//           <Box 
//             className={cn(
//               "w-6 h-6 rounded-full border-2 transition-transform duration-200 group-hover:scale-110",
//               selectedColor.id === color.name ? "border-white scale-110 shadow-lg" : "border-white/10"
//             )}
//             style={{ backgroundColor: color.hex }}
//           />
//         </Flex>
//       ))}
//     </Box>
//   </Box>
// </Box>
//   {/* 2. SCALE SECTION */}
//   <Box 
//     className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//     style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//   >
//     <Flex className="items-center gap-3 mb-4">
//        <Box className="p-3 bg-[#4A0E64] rounded-lg border border-white/10">
//           <Search className="w-6 h-6 text-white" />
//        </Box>
//        <span className="text-white/80 text-lg font-normal">Scale</span>
//     </Flex>

//     <Flex className="items-center mt-10 justify-between px-2">
//       <button 
//         onClick={handleZoomOut}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Minus className="w-6 h-6 text-white" />
//       </button>
      
//       <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//         {zoomScale}%
//       </span>
      
//       <button 
//         onClick={handleZoomIn}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Plus className="w-6 h-6 text-white" />
//       </button>
//     </Flex>
//   </Box>

//   {/* 3. DESIGN ROTATION SECTION */}
//   {/* <Box 
//     className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//     style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//   >
//     <Flex className="items-center gap-3 mb-4">
//        <Box className="p-3 bg-[#401F45] rounded-lg border border-white/10">
//           <RotateCcw className="w-6 h-6 text-[#F70353]" />
//        </Box>
//        <span className="text-white/80 text-lg font-normal">Design Rotation</span>
//     </Flex>

//     <Flex className="items-center mt-10 justify-between px-2">
//       <button 
//         onClick={() => setRotation((prev) => prev - 15)}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Undo2 className="w-6 h-6 text-white" />
//       </button>
      
//       <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//         {rotation}°
//       </span>
      
//       <button 
//         onClick={() => setRotation((prev) => prev + 15)}
//         className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//       >
//         <Redo2 className="w-6 h-6 text-white" />
//       </button>
//     </Flex>
//   </Box> */}

//  {/* 4. OBJECT ROTATION SECTION - UPDATED FOR LEFT/RIGHT FLIP */}
// <Box 
//   className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//   style={{ backgroundImage: "url('/general/bgofbg.png')" }}
// >
//   <Flex className="items-center gap-3 mb-4">
//     <Box className="p-3 bg-[#2D1B45] rounded-lg border border-white/10">
//       <RotateCw className="w-6 h-6 text-[#00BED5]" />
//     </Box>
//     <span className="text-white/80 text-lg font-normal">Object Rotation</span>
//   </Flex>

//   <Flex className="items-center mt-10 justify-between px-2">
//     <button 
//       onClick={rotateObjectToLeftSide}
//       className="w-14 h-12 flex flex-col items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all group"
//       title="Show Left Side"
//     >
//       {/* <span className="text-white/70 text-xs mb-1 group-hover:text-white">Left</span> */}
//       <Undo2 className="w-5 h-5 text-white" />
//     </button>
    
//     <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//       {cupFlip === "left" ? "Left" : "Right"}
//     </span>
    
//     <button 
//       onClick={rotateObjectToRightSide}
//       className="w-14 h-12 flex flex-col items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all group"
//       title="Show Right Side"
//     >
//       {/* <span className="text-white/70 text-xs mb-1 group-hover:text-white">Right</span> */}
//       <Redo2 className="w-5 h-5 text-white" />
//     </button>
//   </Flex>
// </Box>
// </Box>

       
//       </Box>

//       {isApplied && (
  
//      <div className="absolute lg:top-[140px] top-[110px] left-[45%] z-50"> 
//   <CustomBlackButton
//     // wrapperClassName: 'rounded-full' makes the outer border glow pill-shaped
//     wrapperClassName="w-fit px-[2px] h-[48px] rounded-full" 
    
//     // className: 'rounded-full' makes the inner button pill-shaped
//     className="rounded-full px-4 text-[14px] sm:text-[16px] md:text-[18px]"
    
//    title="Reset"
//   onClick={() => {
//     setIsApplied(false);
//     setRotation(0); 
//     setObjectRotation(0);
//     setCupFlip("left"); // Reset to left side
//     setZoomScale(100); 
//     setImagePosition({ x: 0, y: 0 }); 
//   }}
    
//     // Adding the Reset Icon (SVG)
//     icon={
//       <svg 
//         width="20" 
//         height="20" 
//         viewBox="0 0 24 24" 
//         fill="none" 
//         stroke="currentColor" 
//         strokeWidth="2.5" 
//         strokeLinecap="round" 
//         strokeLinejoin="round"
//       >
//         <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
//         <path d="M3 3v5h5" />
//       </svg>
//     }
//   />
// </div>
//   )}
    
//     </Box>
//   );
// };




// export default ApplyMokupDesignPage;






// import { useState, useEffect, useRef } from "react";
// import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { Flex } from "@/components/ui/flex";
// import { useImageStore } from "@/store/image.store";
// import { cn } from "@/utils/cn.util";
// import CustomButton from "../components/common/customButton";
// import CustomBlackButton from "../components/common/customBlackButton";
// import { useNavigate } from "react-router";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import {
//   ChevronDown,
//   ChevronUp,
//   ChevronRight,
//   Minus,
//   Redo2,
//   Undo2,
//   Search,
//   Plus,
//   RotateCw,
// } from "lucide-react";

// const productOptions = [
//   { id: "cup", label: "Cup", image: "/general/cup.png" },
//   { id: "tshirt", label: "Shirt", image: "/general/tshirt.png" },
// ];

// const colorOptions = [
//   { id: "no-color", name: "No Color", value: "none" },
//   { id: "red", name: "Red", value: "#F70353" },
//   { id: "blue", name: "Blue", value: "#3B82F6" },
//   { id: "green", name: "Green", value: "#10B981" },
//   { id: "yellow", name: "Yellow", value: "#EAB308" },
//   { id: "purple", name: "Purple", value: "#A855F7" },
//   { id: "pink", name: "Pink", value: "#EC4899" },
//   { id: "orange", name: "Orange", value: "#F97316" },
//   { id: "black", name: "Black", value: "#000000" },
//   { id: "white", name: "White", value: "#FFFFFF" },
// ];

// // Custom color options for 3D model
// const customColorOptions = [
//   { name: "Conquelicot", hex: "#FF3A02" },
//   { name: "Arlequin", hex: "#70E22B" },
//   { name: "Violet", hex: "#9C04ED" },
//   { name: "Purple", hex: "#6B1BFF" },
//   { name: "Chrome", hex: "#FBAF00" },
//   { name: "Blaze", hex: "#FF6E01" },
//   { name: "Turquoise", hex: "#00BED5" },
//   { name: "Chestnut", hex: "#9A614D" },
// ];

// const ApplyMokupDesignPage = () => {
//   const selectedImage = useImageStore((state) => state.selectedImage);
//   const [selectedProduct, setSelectedProduct] = useState<string>("cup");
//   const [selectedColor, setSelectedColor] = useState(customColorOptions[0]);
//   const [zoomScale, setZoomScale] = useState(100);
//   const [rotation, setRotation] = useState(0);
//   const [isColorsOpen, setIsColorsOpen] = useState(true);
//   const [isApplied, setIsApplied] = useState(false);
  
//   // Refs for Three.js
//   const mountRef = useRef<HTMLDivElement>(null);
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const controlsRef = useRef<OrbitControls | null>(null);
//   const printMeshRef = useRef<THREE.Mesh | null>(null);
//   const cupGroupRef = useRef<THREE.Group | null>(null);

//   const navigate = useNavigate();

//   // Initialize Three.js scene
//   useEffect(() => {
//     if (!mountRef.current || selectedProduct !== "cup") return;

//     // Scene setup
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x080319);
//     sceneRef.current = scene;

//     // Camera
//     const camera = new THREE.PerspectiveCamera(
//       35,
//       mountRef.current.clientWidth / mountRef.current.clientHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(4, 3, 7);

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     renderer.shadowMap.enabled = true;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     rendererRef.current = renderer;

//     mountRef.current.appendChild(renderer.domElement);

//     // Controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.minDistance = 3;
//     controls.maxDistance = 10;
//     controlsRef.current = controls;

//     // Lighting
//     const ambient = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambient);

//     const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
//     mainLight.position.set(5, 8, 5);
//     mainLight.castShadow = true;
//     scene.add(mainLight);

//     const rimLight = new THREE.PointLight(0xffffff, 0.5);
//     rimLight.position.set(-5, 2, -5);
//     scene.add(rimLight);

//     // Mug materials
//     const ceramicMat = new THREE.MeshPhysicalMaterial({
//       color: new THREE.Color(selectedColor.hex),
//       roughness: 0.1,
//       metalness: 0.05,
//       clearcoat: 1.0,
//       clearcoatRoughness: 0.05,
//     });

//     const printMat = new THREE.MeshPhysicalMaterial({
//       color: 0xffffff,
//       roughness: 0.1,
//       clearcoat: 1.0,
//     });

//     // Mug group
//     const mugGroup = new THREE.Group();
//     cupGroupRef.current = mugGroup;

//     // 1. Main body (Lathe geometry)
//     const points = [];
//     points.push(new THREE.Vector2(0, 0));
//     points.push(new THREE.Vector2(0.7, 0.02));
//     points.push(new THREE.Vector2(0.98, 0.3));
//     points.push(new THREE.Vector2(1.0, 2.4));
//     points.push(new THREE.Vector2(0.94, 2.5));
//     points.push(new THREE.Vector2(0.88, 2.4));
//     points.push(new THREE.Vector2(0.88, 0.1));
//     points.push(new THREE.Vector2(0, 0.1));

//     const bodyGeom = new THREE.LatheGeometry(points, 64);
//     const bodyMesh = new THREE.Mesh(bodyGeom, ceramicMat);
//     bodyMesh.castShadow = true;
//     bodyMesh.receiveShadow = true;
//     mugGroup.add(bodyMesh);

//     // 2. Outer print shell (for texture)
//     const printGeom = new THREE.CylinderGeometry(
//       1.005,
//       1.005,
//       2.0,
//       64,
//       1,
//       true,
//       -Math.PI * 0.85,
//       Math.PI * 1.7
//     );
//     const printMesh = new THREE.Mesh(printGeom, printMat);
//     printMesh.position.y = 1.3;
//     printMesh.visible = false;
//     printMeshRef.current = printMesh;
//     mugGroup.add(printMesh);

//     // 3. Handle
//     const handlePath = new THREE.CatmullRomCurve3([
//       new THREE.Vector3(0.95, 2.1, 0),
//       new THREE.Vector3(1.7, 1.9, 0),
//       new THREE.Vector3(1.8, 1.0, 0),
//       new THREE.Vector3(1.6, 0.2, 0),
//       new THREE.Vector3(0.9, 0.4, 0),
//     ]);
//     const handleGeom = new THREE.TubeGeometry(handlePath, 40, 0.12, 20, false);
//     const handleMesh = new THREE.Mesh(handleGeom, ceramicMat);
//     mugGroup.add(handleMesh);

//     scene.add(mugGroup);

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Handle resize
//     const handleResize = () => {
//       if (!mountRef.current || !rendererRef.current || !camera) return;
//       camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//     };
//     window.addEventListener("resize", handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (mountRef.current && rendererRef.current) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//       controls.dispose();
//     };
//   }, [selectedProduct]);

//   // Apply image to 3D model
//   useEffect(() => {
//     if (selectedImage && selectedProduct === "cup" && printMeshRef.current) {
//       const textureLoader = new THREE.TextureLoader();
//       textureLoader.load(selectedImage, (texture) => {
//         texture.wrapS = THREE.ClampToEdgeWrapping;
//         texture.wrapT = THREE.ClampToEdgeWrapping;
        
//         if (printMeshRef.current) {
//           (printMeshRef.current.material as THREE.MeshPhysicalMaterial).map = texture;
//           (printMeshRef.current.material as THREE.MeshPhysicalMaterial).needsUpdate = true;
//           printMeshRef.current.visible = isApplied;
//         }
//       });
//     }
//   }, [selectedImage, selectedProduct, isApplied]);

//   // Update color of 3D model
//   useEffect(() => {
//     if (cupGroupRef.current && selectedProduct === "cup") {
//       cupGroupRef.current.traverse((child) => {
//         if (child instanceof THREE.Mesh && child !== printMeshRef.current) {
//           const material = child.material as THREE.MeshPhysicalMaterial;
//           if (material) {
//             material.color.set(new THREE.Color(selectedColor.hex));
//             material.needsUpdate = true;
//           }
//         }
//       });
//     }
//   }, [selectedColor, selectedProduct]);

//   // Handle zoom for 3D model
//   const handleZoomIn = () => {
//     setZoomScale((prev) => Math.min(prev + 10, 200));
//     if (controlsRef.current && cupGroupRef.current) {
//       cupGroupRef.current.scale.multiplyScalar(1.1);
//     }
//   };

//   const handleZoomOut = () => {
//     setZoomScale((prev) => Math.max(prev - 10, 50));
//     if (controlsRef.current && cupGroupRef.current) {
//       cupGroupRef.current.scale.multiplyScalar(0.9);
//     }
//   };

//   // Handle object rotation for 3D model
//   const rotateObjectToLeftSide = () => {
//     if (cupGroupRef.current) {
//       cupGroupRef.current.rotation.y = 0;
//     }
//   };

//   const rotateObjectToRightSide = () => {
//     if (cupGroupRef.current) {
//       cupGroupRef.current.rotation.y = Math.PI;
//     }
//   };

//   // Toggle design application
//   const handleApplyDesign = () => {
//     setIsApplied(!isApplied);
//     if (printMeshRef.current) {
//       printMeshRef.current.visible = !printMeshRef.current.visible;
//     }
//   };

//   // Reset everything
//   const handleReset = () => {
//     setIsApplied(false);
//     setRotation(0);
//     setZoomScale(100);
    
//     if (cupGroupRef.current) {
//       cupGroupRef.current.rotation.y = 0;
//       cupGroupRef.current.scale.set(1, 1, 1);
//     }
    
//     if (printMeshRef.current) {
//       printMeshRef.current.visible = false;
//     }
    
//     if (controlsRef.current) {
//       controlsRef.current.reset();
//     }
//   };

//   return (
//     <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-cover 3xl:bg-center bg-no-repeat overflow-y-auto p-2 xl:p-2 2xl:p-8">
//       <Box className="w-full min-h-screen flex flex-row gap-4 sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12 p-2 xl:p-2 2xl:p-8 max-lg:flex-col max-lg:items-center items-start max-md:justify-start max-md:py-6 max-sm:mt-30 mt-30">
//         {/* Left Side - Product Options Sidebar */}
//         <Box className="flex flex-col items-center ml-18 justify-start gap-1 flex-shrink-0">
//           <Box
//             className="relative mb-2 w-[310.9px] xl:w-[380px] 2xl:w-[450px] h-[410px] xl:h-[490px] 2xl:h-[590px] overflow-hidden rounded-[10px] xl:rounded-[12px] 2xl:rounded-[14px]"
//             style={{ fontFamily: "Outfit, sans-serif" }}
//           >
//             {/* Background Frame */}
//             <Box
//               className="absolute inset-0 xl:bg-[length:81%_81%] bg-[length:90%_90%] rounded-[10px]"
//               style={{
//                 backgroundImage: "url('/general/productphotosss.svg')",
//                 backgroundPosition: "center",
//                 backgroundRepeat: "no-repeat",
//               }}
//             />

//             {/* Product Photos Header */}
//             <Box className="absolute z-10 xl:left-[12%] left-[7%] top-[17%] xl:top-[20%] 2xl:top-[20.3%]">
//               <Flex className="items-center gap-2 xl:gap-3">
//                 <img
//                   src="/general/cups.png"
//                   alt="icon"
//                   className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 object-cover rounded shadow-sm"
//                 />
//                 <Stack className="gap-0">
//                   <span className="text-[10px] xl:text-[12px] 2xl:text-sm text-[#C1C1C5] leading-none tracking-wider">
//                     Product
//                   </span>
//                   <span className="text-[10px] xl:text-[12px] 2xl:text-sm text-[#C1C1C5] font-medium leading-tight">
//                     Photos
//                   </span>
//                 </Stack>
//                 <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 text-[#C1C1C5]" />
//               </Flex>
//             </Box>

//             {/* Customize Heading */}
//             <Box className="absolute left-[13%] top-[32%] xl:top-[32%] 2xl:top-[33%]">
//               <Flex className="items-center gap-3">
//                 <Box className="w-7 h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 flex-shrink-0">
//                   <img src="/general/squre.png" alt="square" className="w-full h-full" />
//                 </Box>
//                 <span className="text-sm xl:text-base 2xl:text-lg text-white font-light">
//                   Customize Your Designs:
//                 </span>
//               </Flex>
//             </Box>

//             {/* Product Options */}
//             <Box
//               className="absolute
//                 left-[35px] top-[166px]
//                 xl:left-[50px] xl:top-[200px]
//                 2xl:left-[60px] 2xl:top-[252px]
//                 3xl:top-[160px] 2xl:w-[330px] xl:w-[279.16px] w-[240.16px]"
//             >
//               <Flex className="flex-col">
//                 {productOptions.map((product) => (
//                   <Box
//                     key={product.id}
//                     onClick={() => setSelectedProduct(product.id)}
//                     className={cn(
//                       "cursor-pointer rounded-lg p-3 transition-all duration-200 xl:rounded-xl 2xl:rounded-2xl flex items-center gap-3 xl:gap-4 2xl:gap-5",
//                       selectedProduct === product.id
//                         ? "border border-[#F70353] xl:border-2 2xl:border-2"
//                         : "border border-transparent hover:bg-[#29292D]/70"
//                     )}
//                     style={
//                       selectedProduct === product.id
//                         ? {
//                             background: `linear-gradient(to bottom, rgba(247, 3, 83, 0.06) 0%, rgba(247, 3, 83, 0.06) 73%, rgba(23, 7, 38, 1) 100%)`,
//                             borderColor: "#F70353",
//                             borderWidth: "1px",
//                           }
//                         : {
//                             background: `linear-gradient(to top, rgba(23, 7, 38, 1) 0%, rgba(23, 7, 38, 1) 73%, rgba(23, 7, 38, 1) 100%)`,
//                             borderColor: "#170726",
//                             borderWidth: "1px",
//                           }
//                     }
//                   >
//                     <Box className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 flex-shrink-0 rounded-lg xl:rounded-xl 2xl:rounded-2xl overflow-hidden bg-[#29292D]/50">
//                       <img
//                         src={product.image}
//                         alt={product.label}
//                         className="w-full h-full object-cover"
//                       />
//                     </Box>

//                     <Flex className="flex-col flex-1 min-w-0">
//                       <span
//                         className="text-sm xl:text-base 2xl:text-lg"
//                         style={{
//                           fontFamily: "Outfit",
//                           fontStyle: "normal",
//                           fontWeight: selectedProduct === product.id ? 500 : 300,
//                           fontSize: "14px",
//                           lineHeight: "20px",
//                           color: selectedProduct === product.id ? "#FFFFFF" : "#C1C1C5",
//                         }}
//                       >
//                         Apply your design on {product.label}
//                       </span>
//                     </Flex>

//                     <ChevronRight className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-[#C1C1C5] flex-shrink-0" />
//                   </Box>
//                 ))}
//               </Flex>
//             </Box>
//           </Box>

//           {/* Bottom Section: Design Card & Checkout */}
//           {selectedImage && (
//             <Box className="flex flex-col gap-1 items-center w-full max-w-[350px] mx-auto">
//               <div
//                 className="relative w-[330px] h-[210px] bg-no-repeat bg-contain"
//                 style={{ backgroundImage: "url('/general/applybg.png')" }}
//               >
//                 <div className="absolute bg-[#130E29]/50 backdrop-blur-xl border border-white/10 rounded-[30px] p-4 top-[33.7%] left-[10px] right-[10px] flex items-center justify-between">
//                   <div className="w-[85px] h-[85px] rounded-2xl overflow-hidden border border-white/10">
//                     <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
//                   </div>
//                   <CustomButton
//                     title={isApplied ? "Applied" : "Apply"}
//                     onClick={handleApplyDesign}
//                     wrapperClassName={cn("w-[140px] h-[52px] rounded-[18px]", isApplied && "bg-none shadow-none")}
//                   />
//                 </div>
//               </div>

//               <Box className="w-full items-center text-center px-2">
//                 <CustomButton
//                   title="Continue to Checkout"
//                   onClick={() => navigate("/checkout")}
//                   icon={
//                     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
//                       <path d="M5 12h14m-7-7 7 7-7 7" />
//                     </svg>
//                   }
//                   wrapperClassName="w-[96%] h-[60px] rounded-[25px]"
//                   className="text-[18px]"
//                 />
//               </Box>
//             </Box>
//           )}
//         </Box>

//         {/* Center - 3D Model Container */}
//         <Box className="flex-1 flex items-center justify-center min-w-0 max-md:w-full max-md:flex-1 max-md:mt-4">
//           {selectedProduct === "cup" ? (
//             <div
//               ref={mountRef}
//               className="w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] xl:h-[700px] 2xl:h-[750px] rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-hidden"
//               style={{ background: "transparent" }}
//             />
//           ) : (
//             <Stack className="w-full max-w-[650px] xl:max-w-[800px] 2xl:max-w-[950px] items-center justify-center">
//               <Center
//                 className="w-full bg-transparent p-2 xl:p-3 2xl:p-4 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[550px] 2xl:h-[650px] rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-visible relative"
//                 style={{ userSelect: "none" }}
//               >
//                 {/* Default 2D rendering for non-cup products */}
//                 <img
//                   src="/general/tshirt.png"
//                   alt="Product"
//                   className="w-full h-full object-contain"
//                 />
//               </Center>
//             </Stack>
//           )}
//         </Box>

//         {/* Right Side - Functional Controls */}
//         <Box className="flex flex-col items-center justify-center gap-4 mr-18 xl:gap-8 flex-shrink-0 bg-transparent">
//           {/* 1. SELECT COLORS SECTION */}
//           <Box
//             className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 rounded-[20px] border border-white/10 overflow-hidden bg-cover bg-center shadow-2xl transition-all duration-300"
//             style={{ backgroundImage: "url('/general/specialbg.png')" }}
//           >
//             <Flex
//               className="items-center justify-between mb-3 cursor-pointer select-none"
//               onClick={() => setIsColorsOpen(!isColorsOpen)}
//             >
//               <Flex className="items-center gap-2">
//                 <Box className="w-5 h-5 flex items-center justify-center">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                     <circle cx="12" cy="8" r="5" fill="#00BED5" fillOpacity="0.8" />
//                     <circle cx="8" cy="15" r="5" fill="#FF3A02" fillOpacity="0.8" />
//                     <circle cx="16" cy="15" r="5" fill="#FBAF00" fillOpacity="0.8" />
//                   </svg>
//                 </Box>
//                 <span className="text-white text-base font-medium">Select Color</span>
//               </Flex>

//               <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/20">
//                 {isColorsOpen ? (
//                   <ChevronUp className="w-4 h-4 text-white" />
//                 ) : (
//                   <ChevronDown className="w-4 h-4 text-white" />
//                 )}
//               </button>
//             </Flex>

//             <Box
//               className={`transition-all duration-500 ease-in-out overflow-hidden ${
//                 isColorsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="px-1 mb-2">
//                 <span className="text-[#C1C1C5] text-[11px] uppercase tracking-[2px]">Current: </span>
//                 <span className="text-white text-[11px] font-bold uppercase tracking-[2px]">
//                   {selectedColor.name}
//                 </span>
//               </div>

//               <Box className="grid grid-cols-1 gap-1 mt-1">
//                 {customColorOptions.map((color, idx) => (
//                   <Flex
//                     key={idx}
//                     onClick={() => setSelectedColor(color)}
//                     className={cn(
//                       "px-3 py-2 justify-between items-center cursor-pointer rounded-lg transition-all duration-200 group",
//                       selectedColor.name === color.name
//                         ? "bg-white/10 border border-white/20"
//                         : "hover:bg-white/5 border border-transparent"
//                     )}
//                   >
//                     <span
//                       className={cn(
//                         "text-[12px] font-medium tracking-wide transition-colors",
//                         selectedColor.name === color.name
//                           ? "text-white"
//                           : "text-[#C1C1C5] group-hover:text-white"
//                       )}
//                     >
//                       {color.name}
//                     </span>

//                     <Box
//                       className={cn(
//                         "w-6 h-6 rounded-full border-2 transition-transform duration-200 group-hover:scale-110",
//                         selectedColor.name === color.name
//                           ? "border-white scale-110 shadow-lg"
//                           : "border-white/10"
//                       )}
//                       style={{ backgroundColor: color.hex }}
//                     />
//                   </Flex>
//                 ))}
//               </Box>
//             </Box>
//           </Box>

//           {/* 2. SCALE SECTION */}
//           <Box
//             className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//             style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//           >
//             <Flex className="items-center gap-3 mb-4">
//               <Box className="p-3 bg-[#4A0E64] rounded-lg border border-white/10">
//                 <Search className="w-6 h-6 text-white" />
//               </Box>
//               <span className="text-white/80 text-lg font-normal">Scale</span>
//             </Flex>

//             <Flex className="items-center mt-10 justify-between px-2">
//               <button
//                 onClick={handleZoomOut}
//                 className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//               >
//                 <Minus className="w-6 h-6 text-white" />
//               </button>

//               <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//                 {zoomScale}%
//               </span>

//               <button
//                 onClick={handleZoomIn}
//                 className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
//               >
//                 <Plus className="w-6 h-6 text-white" />
//               </button>
//             </Flex>
//           </Box>

//           {/* 3. OBJECT ROTATION SECTION */}
//           <Box
//             className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
//             style={{ backgroundImage: "url('/general/bgofbg.png')" }}
//           >
//             <Flex className="items-center gap-3 mb-4">
//               <Box className="p-3 bg-[#2D1B45] rounded-lg border border-white/10">
//                 <RotateCw className="w-6 h-6 text-[#00BED5]" />
//               </Box>
//               <span className="text-white/80 text-lg font-normal">Object Rotation</span>
//             </Flex>

//             <Flex className="items-center mt-10 justify-between px-2">
//               <button
//                 onClick={rotateObjectToLeftSide}
//                 className="w-14 h-12 flex flex-col items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all group"
//                 title="Show Left Side"
//               >
//                 <Undo2 className="w-5 h-5 text-white" />
//               </button>

//               <span className="text-white text-xl font-semibold min-w-[60px] text-center">
//                 Front
//               </span>

//               <button
//                 onClick={rotateObjectToRightSide}
//                 className="w-14 h-12 flex flex-col items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all group"
//                 title="Show Right Side"
//               >
//                 <Redo2 className="w-5 h-5 text-white" />
//               </button>
//             </Flex>
//           </Box>
//         </Box>
//       </Box>

//       {isApplied && (
//         <div className="absolute lg:top-[140px] top-[110px] left-[45%] z-50">
//           <CustomBlackButton
//             wrapperClassName="w-fit px-[2px] h-[48px] rounded-full"
//             className="rounded-full px-4 text-[14px] sm:text-[16px] md:text-[18px]"
//             title="Reset"
//             onClick={handleReset}
//             icon={
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
//                 <path d="M3 3v5h5" />
//               </svg>
//             }
//           />
//         </div>
//       )}
//     </Box>
//   );
// };

// export default ApplyMokupDesignPage;














import { useState, useEffect } from "react";
import { Box} from "../components/ui/box";
import { Stack} from "../components/ui/stack";
// import { Flex} from "../components/ui/flex";
import { useImageStore } from "@/store/image.store";
import { useNavigate } from "react-router";
import ProductOptions from "@/components/common/ProductOptions";
import DesignCard from "@/components/common/DesignCard";
import ThreeMugViewer from "@/components/3dView/ThreeMugViewer";
import ColorSelector, { ColorOption } from "@/components/common/ColorSelector";
import ScaleControl from "@/components/common/ScaleControl";
import RotationControl from "@/components/common/RotationControl";

const productOptions = [
  { id: "cup", label: "Cup", image: "/general/cup.png" },
  { id: "tshirt", label: "Shirt", image: "/general/tshirt.png" },
];

const customColorOptions: ColorOption[] = [
  { id: "conquelicot", name: "Conquelicot", hex: "#FF3A02" },
  { id: "arlequin", name: "Arlequin", hex: "#70E22B" },
  { id: "violet", name: "Violet", hex: "#9C04ED" },
  { id: "purple", name: "Purple", hex: "#6B1BFF" },
  { id: "chrome", name: "Chrome", hex: "#FBAF00" },
  { id: "blaze", name: "Blaze", hex: "#FF6E01" },
  { id: "turquoise", name: "Turquoise", hex: "#00BED5" },
  { id: "white", name: "White", hex: "#ffffff" },
  { id: "chestnut", name: "Chestnut", hex: "#9A614D" },
];

const ApplyMokupDesignPage = () => {
  const selectedImage = useImageStore((state) => state.selectedImage);
  const [selectedProduct, setSelectedProduct] = useState<string>("cup");
  const [selectedColor, setSelectedColor] = useState<ColorOption>(customColorOptions[0]);
  const [zoomScale, setZoomScale] = useState(100);
  const [isApplied, setIsApplied] = useState(false);
  
  const navigate = useNavigate();

  // Handle zoom
  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - 10, 50));
  };

  // Handle rotation (empty for now as they use Three.js internal controls)
  const handleRotateLeft = () => {
    // Implement via ThreeMugViewer if needed
  };

  const handleRotateRight = () => {
    // Implement via ThreeMugViewer if needed
  };

  // Toggle design application
  const handleApplyDesign = () => {
    setIsApplied(!isApplied);
  };

  // Navigate to checkout
  const handleCheckout = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    return () => {
      // Optional cleanup
    };
  }, []);

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-cover 3xl:bg-center bg-no-repeat overflow-y-auto p-2 xl:p-2 2xl:p-8">
      <Box className="w-full min-h-screen flex flex-row gap-4 sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12 p-2 xl:p-2 2xl:p-8 max-lg:flex-col max-lg:items-center items-start max-md:justify-start max-md:py-6 max-sm:mt-30 mt-30">
        {/* Left Side - Product Options & Design Card */}
        <Box className="flex flex-col items-center ml-18 justify-start gap-1 flex-shrink-0">
          <ProductOptions
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
            options={productOptions}
          />
          
          <DesignCard
            selectedImage={selectedImage ?? undefined}
            isApplied={isApplied}
            onApply={handleApplyDesign}
            onCheckout={handleCheckout}
          />
        </Box>

        {/* Center - 3D Model or 2D Image */}
        <Box className="flex-1 flex items-center justify-center min-w-0 max-md:w-full max-md:flex-1 max-md:mt-4">
          {selectedProduct === "cup" ? (
            <ThreeMugViewer
              imageUrl={selectedImage ?? undefined}
              color={selectedColor.hex}
              isApplied={isApplied}
            />
          ) : (
            <Stack className="w-full max-w-[650px] xl:max-w-[800px] 2xl:max-w-[950px] items-center justify-center">
              <Center
                className="w-full bg-transparent p-2 xl:p-3 2xl:p-4 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[550px] 2xl:h-[650px] rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-visible relative"
                style={{ userSelect: "none" }}
              >
                <img
                  src="/general/tshirt.png"
                  alt="Product"
                  className="w-full h-full object-contain"
                />
              </Center>
            </Stack>
          )}
        </Box>

        {/* Right Side - Functional Controls */}
        <Box className="flex flex-col items-center justify-center gap-4 mr-18 xl:gap-8 flex-shrink-0 bg-transparent">
          <ColorSelector
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
            colors={customColorOptions}
          />
          
          <ScaleControl
            zoomScale={zoomScale}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
          
          <RotationControl
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ApplyMokupDesignPage;