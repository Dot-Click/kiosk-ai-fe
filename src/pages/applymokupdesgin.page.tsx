







import { useState, useEffect, useRef } from "react";
import { Box } from "../components/ui/box";
import { useImageStore } from "@/store/image.store";
import { useNavigate } from "react-router";
import ProductOptions from "@/components/common/ProductOptions";
import DesignCard from "@/components/common/DesignCard";
import ThreeMugViewer, { ThreeMugViewerRef } from "@/components/3dView/ThreeMugViewer";
import TShirtMockupCanvas from "@/components/3dView/TShirtMockupCanvas";
import ColorSelector, { ColorOption } from "@/components/common/ColorSelector";
import ScaleControl from "@/components/common/ScaleControl";
import RotationControl from "@/components/common/RotationControl";
import ImagePositionControl from "@/components/common/ImagePositionControl";
import { axios } from "@/config/axios";
import { Loader2 } from "lucide-react";

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
  const setMockupImageUrl = useImageStore((state) => state.setMockupImageUrl);
  const [selectedProduct, setSelectedProduct] = useState<string>("cup");
  const [selectedColor, setSelectedColor] = useState<ColorOption>(customColorOptions[0]);
  const [zoomScale, setZoomScale] = useState(100);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isApplied, setIsApplied] = useState(false);
  const [decalPosition, setDecalPosition] = useState<[number, number, number]>([0, 0.04, 0.15]);
  const [decalScale, setDecalScale] = useState(0.18);
  const [decalRotation,] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs for capturing 3D view
  const cupRef = useRef<ThreeMugViewerRef>(null);
  const tshirtCaptureRef = useRef<any>(null);

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

  const handleDecalPositionYChange = (delta: number) => {
    setDecalPosition((prev) => [prev[0], prev[1] + delta, prev[2]]);
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

  // Toggle design application
  const handleApplyDesign = () => {
    setIsApplied(!isApplied);
  };

  // Helper to convert dataURL to Blob
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = match ? match[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  // Navigate to checkout
  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      let dataUrl: string | null = null;

      // Capture the current view
      if (selectedProduct === "cup" && cupRef.current) {
        dataUrl = cupRef.current.capture();
      } else if (selectedProduct === "tshirt" && tshirtCaptureRef.current) {
        // tshirtCaptureRef.current is the function assigned by CaptureHandler
        dataUrl = tshirtCaptureRef.current();
      }

      if (dataUrl) {
        // Upload the captured image
        const blob = dataURLtoBlob(dataUrl);
        const formData = new FormData();
        const code = `MOCKUP-${Date.now()}`;
        formData.append("code", code);
        formData.append("image", blob, "mockup.png");

        const response = await axios.post("/upload/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          setMockupImageUrl(response.data.data.imageUrl);
        } else {
          console.error("Upload failed:", response.data);
          // Fallback: don't set mockup URL, just proceed
        }
      }
    } catch (error) {
      console.error("Error capturing/uploading mockup:", error);
    } finally {
      setIsProcessing(false);
      navigate("/checkout");
    }
  };

  useEffect(() => {
    return () => {
      // Optional cleanup
    };
  }, []);

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-cover 3xl:bg-center bg-no-repeat overflow-y-auto p-2 xl:p-2 2xl:p-8">
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#F70353] animate-spin mb-4" />
          <p className="text-white text-xl font-bold">Preparing your design...</p>
        </div>
      )}
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
              ref={cupRef}
              imageUrl={selectedImage ?? undefined}
              color={selectedColor.hex}
              isApplied={isApplied}
              zoomScale={zoomScale}
              rotationAngle={rotationAngle}
            />
          ) : (
            <TShirtMockupCanvas
              captureRef={tshirtCaptureRef}
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