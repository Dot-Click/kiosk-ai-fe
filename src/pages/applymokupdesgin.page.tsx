







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
import CupPositionControl from "@/components/common/CupPositionControl";
import { axios } from "@/config/axios";
import { Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
// import Price from "@/components/common/Price";

const productOptions = [
  { id: "cup", label: "Cup", image: "/general/cup.png", price: 300.00 },
  { id: "tshirt", label: "Shirt", image: "/general/tshirt.png", price: 500.00 },
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
  const selectedProduct = useImageStore((state) => state.selectedProduct);
  const setSelectedProduct = useImageStore((state) => state.setSelectedProduct);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(customColorOptions[0]);
  const [zoomScale, setZoomScale] = useState(100);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isApplied, setIsApplied] = useState(false);
  const [decalPosition, setDecalPosition] = useState<[number, number, number]>([0, 0.04, 0.15]);
  const [decalScale, setDecalScale] = useState(0.18);
  const [decalRotation,] = useState(0);
  // for cup viewer: how far around the circumference the print should sit
  // value is in radians, 0 = default orientation
  const [cupOffset, setCupOffset] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs for capturing 3D view
  const cupRef = useRef<ThreeMugViewerRef>(null);
  const tshirtCaptureRef = useRef<any>(null);

  const navigate = useNavigate();
  const { products } = useProducts();

  // ref for the control panel so we can bring the position control into view
  const controlsPanelRef = useRef<HTMLDivElement>(null);



  // Update productOptions labels to include prices if products are loaded
  const dynamicProductOptions = products.length > 0 ? productOptions.map(opt => {
    const p = products.find(dbProd => {
      const searchCode = opt.id === "tshirt" ? "price-tshirt" : "price-mug";
      const searchName = opt.id === "tshirt" ? "t-shirt" : "mug";
      return dbProd.code === searchCode || dbProd.productCategory.toLowerCase().includes(searchName);
    });
    return p ? { ...opt, price: p.price } : opt;
  }) : productOptions;

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

  // adjust cup offset (horizontal position) when printing to mug
  const handleCupOffsetChange = (delta: number) => {
    setCupOffset((prev) => prev + delta);
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
      let finalOriginalImage = selectedImage;

      // 1. If original image is a blob, upload it first
      if (selectedImage && selectedImage.startsWith("blob:")) {
        try {
          const res = await fetch(selectedImage);
          const blob = await res.blob();
          const formData = new FormData();
          const code = `ORIGINAL-${Date.now()}`;
          formData.append("code", code);
          formData.append("image", blob, "original.png");

          const response = await axios.post("/upload/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            finalOriginalImage = response.data.data.imageUrl;
            // Update store so checkout page uses the real URL
            useImageStore.getState().setSelectedImage(finalOriginalImage);
          }
        } catch (error) {
          console.error("Error uploading original design:", error);
        }
      }

      // 2. Save customization details
      useImageStore.getState().setCustomizationDetails({
        color: selectedColor.hex,
        colorName: selectedColor.name,
        position: decalPosition,
        scale: decalScale,
        // if cup is selected include horizontal offset so backend/order can reflect it
        ...(selectedProduct === "cup" ? { cupOffset } : {}),
      });

      let dataUrl: string | null = null;

      // 3. Capture the current view (Mockup)
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

  // whenever the tshirt position control becomes active, scroll the panel top
  useEffect(() => {
    if (selectedProduct === "tshirt" && isApplied && selectedImage) {
      controlsPanelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedProduct, isApplied, selectedImage]);

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
            options={dynamicProductOptions}
          />

          {/* Dynamic Price Display */}
          {/* <div className="bg-[#130E29]/50 backdrop-blur-xl border border-white/10 rounded-2xl py-3 px-6 flex flex-col items-center gap-1 mb-2 w-full max-w-[330px]">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-[2px]">Special Price</span>
            {productsLoading ? (
              <div className="h-10 w-24 bg-white/5 animate-pulse rounded-lg" />
            ) : (
              <Price amount={productPrice} className="text-3xl text-[#F70353]" showStrikethrough strikethroughAmount={productPrice + 10} />
            )}
          </div> */}

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
              // only half the mug surface should be printable by default
              coverage={0.5}
              wrapOffset={cupOffset}
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
        <Box ref={controlsPanelRef} className="flex flex-col items-center justify-center gap-4 mr-18 xl:gap-8 flex-shrink-0 bg-transparent overflow-y-auto max-h-[calc(100vh-6rem)]">
          <ColorSelector
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
            colors={customColorOptions}
          />

          {/* Image position -- show first for tshirt so users don't have to scroll */}
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

          {/* Cup horizontal offset control (coverage hard‑coded to 50%) */}
          {selectedProduct === "cup" && isApplied && selectedImage && (
            <CupPositionControl
              offset={cupOffset}
              onOffsetChange={handleCupOffsetChange}
            />
          )}

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