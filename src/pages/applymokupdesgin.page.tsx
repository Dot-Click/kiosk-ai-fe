 








import { useState, useEffect } from "react";
import { Box } from "../components/ui/box";
import { useImageStore } from "@/store/image.store";
import { useNavigate } from "react-router";
import ProductOptions from "@/components/common/ProductOptions";
import DesignCard from "@/components/common/DesignCard";
import ThreeMugViewer from "@/components/3dView/ThreeMugViewer";
import TShirtMockupCanvas from "@/components/3dView/TShirtMockupCanvas";
import ColorSelector, { ColorOption } from "@/components/common/ColorSelector";
import ScaleControl from "@/components/common/ScaleControl";
import RotationControl from "@/components/common/RotationControl";
import ImagePositionControl from "@/components/common/ImagePositionControl";

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
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isApplied, setIsApplied] = useState(false);
  const [decalPosition, setDecalPosition] = useState<[number, number, number]>([0, 0.04, 0.15]);
  const [decalScale, setDecalScale] = useState(0.18);
  const [decalRotation, setDecalRotation] = useState(0);

  const navigate = useNavigate();

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - 10, 50));
  };

  const handleRotateLeft = () => {
    setRotationAngle((prev) => prev - 15);
  };

  const handleRotateRight = () => {
    setRotationAngle((prev) => prev + 15);
  };

  // Image position handlers
  const handleDecalPositionXChange = (delta: number) => {
    setDecalPosition((prev) => [prev[0] + delta, prev[1], prev[2]]);
  };

  const handleDecalPositionYChange = (delta: number) => {
    setDecalPosition((prev) => [prev[0], prev[1] + delta, prev[2]]);
  };

  const handleDecalPositionZChange = (delta: number) => {
    setDecalPosition((prev) => [prev[0], prev[1], prev[2] + delta]);
  };

  const handleSetDecalPosition = (position: [number, number, number]) => {
    setDecalPosition(position);
  };

  const handleSetDecalPositionAndScale = (position: [number, number, number], scale: number) => {
    setDecalPosition(position);
    setDecalScale(scale);
  };

  const handleDecalScaleChange = (delta: number) => {
    setDecalScale((prev) => {
      const newScale = prev + delta;
      // Max scale is 0.23 for back, 0.8 for others
      const maxScale = decalPosition[2] < 0 ? 0.23 : 0.8;
      return Math.max(0.05, Math.min(maxScale, newScale));
    });
  };

  const handleDecalRotationChange = (delta: number) => {
    setDecalRotation((prev) => prev + delta);
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
              zoomScale={zoomScale}
              rotationAngle={rotationAngle}
            />
          ) : (
            <TShirtMockupCanvas
              imageUrl={selectedImage ?? undefined}
              color={selectedColor.hex}
              isApplied={isApplied}
              zoomScale={zoomScale}
              rotationAngle={rotationAngle}
              decalPosition={decalPosition}
              decalScale={decalScale}
              decalRotation={decalRotation}
            />
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

          {/* Image Position Control - only show for t-shirt when image is applied */}
          {selectedProduct === "tshirt" && isApplied && selectedImage && (
            <ImagePositionControl
              positionY={decalPosition[1]}
              scale={decalScale}
              onPositionYChange={handleDecalPositionYChange}
              onScaleChange={handleDecalScaleChange}
              onSetPositionAndScale={handleSetDecalPositionAndScale}
              onCurrentPositionChange={handleSetDecalPosition}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ApplyMokupDesignPage;