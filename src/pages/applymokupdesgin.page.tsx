 








import { useState, useEffect } from "react";
import { Center } from "../components/ui/center";
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