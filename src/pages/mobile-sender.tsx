import { useState, useRef } from "react";
import CustomButton from "@/components/common/customButton";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { QrCode, Upload, Image as ImageIcon, ArrowRight, Copy } from "lucide-react";

const ImageUploadPage = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [connectionCode, setConnectionCode] = useState<string>("");
  const [receivedImage, setReceivedImage] = useState<string | null>(null);
  const [showNext, setShowNext] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate QR code
  const generateQRCode = () => {
    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setConnectionCode(code);
    
    // Create mobile upload URL with your domain
    const uploadUrl = `https://kiosk-ai.vercel.app/upload?code=${code}`;
    
    // Generate QR code image
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uploadUrl)}`;
    setQrCodeUrl(qrImageUrl);
  };

  // Handle image received (simulated - in real app this would come from backend)
  const handleImageReceived = () => {
    // For demo, use a file input. In production, images come from mobile upload
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection (demo only)
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setReceivedImage(imageUrl);
      setShowNext(true); // Show next button when image is received
    };
    reader.readAsDataURL(file);
  };

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(connectionCode);
    alert("Code copied to clipboard!");
  };

  // Proceed to next step
  const handleNext = () => {
    // Your next workflow starts here
    alert("Proceeding to next step...");
    // window.location.href = "/next-step"; // Or your next page
  };

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat p-4">
      <Center className="h-full">
        <Stack className="w-full max-w-md items-center gap-6">
          
          {/* Logo/Icon */}
          <Center className="relative mb-4">
            <Box
              className="absolute rounded-full"
              style={{
                width: "150px",
                height: "150px",
                background: "rgba(226, 2, 255, 0.15)",
                filter: "blur(40px)",
              }}
            />
            <img
              src="/general/onlybluetooth.svg"
              alt="QR Upload"
              className="size-24 relative z-10"
            />
          </Center>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center">
            Upload Image from Phone
          </h1>
          <p className="text-white/70 text-sm text-center">
            Scan QR code with your phone to upload images
          </p>

          {/* QR Code Section */}
          {!qrCodeUrl ? (
            // Initial state - Show generate button
            <Box className="w-full mt-4">
              <CustomButton
                wrapperClassName="w-full h-12"
                title="Show QR Code"
                icon={<QrCode size={20} />}
                onClick={generateQRCode}
              />
            </Box>
          ) : (
            // QR Code generated state
            <Box className="w-full space-y-4">
              {/* QR Code Display */}
              <Center className="p-4 bg-white/10 rounded-xl border border-white/20">
                <img 
                  src={qrCodeUrl} 
                  alt="Scan this QR code" 
                  className="w-48 h-48"
                />
              </Center>

              {/* Connection Code */}
              <Box className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-white/60 text-xs mb-1">Connection Code:</p>
                <div className="flex items-center justify-between">
                  <code className="text-white text-lg font-mono">{connectionCode}</code>
                  <button
                    onClick={copyCode}
                    className="text-white/60 hover:text-white p-1"
                    title="Copy code"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </Box>

              {/* Instructions */}
              <Box className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-white text-sm font-medium mb-2">How to upload:</h3>
                <ol className="text-white/70 text-xs space-y-1 pl-4">
                  <li>1. Open camera on your phone</li>
                  <li>2. Scan the QR code above</li>
                  <li>3. Follow the link that appears</li>
                  <li>4. Select image from your gallery</li>
                  <li>5. Image will appear here automatically</li>
                </ol>
              </Box>

              {/* Demo Upload Button (for testing without phone) */}
              <Box className="pt-4 border-t border-white/10">
                <p className="text-white/60 text-xs mb-2">Testing without phone?</p>
                <button
                  onClick={handleImageReceived}
                  className="w-full py-3 rounded-lg border border-white/20 bg-white/5 text-white text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={18} />
                  Upload Test Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </Box>
            </Box>
          )}

          {/* Received Image Display */}
          {receivedImage && (
            <Box className="w-full space-y-4 animate-in fade-in">
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-300 text-sm text-center">
                  ✅ Image received successfully!
                </p>
              </div>
              
              <Box className="bg-white/5 rounded-xl border border-white/20 overflow-hidden">
                <img 
                  src={receivedImage} 
                  alt="Uploaded" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 bg-black/30">
                  <p className="text-white text-sm">Image ready for processing</p>
                </div>
              </Box>

              {/* Next Button */}
              {showNext && (
                <CustomButton
                  wrapperClassName="w-full h-12"
                  title="Next Step"
                  icon={<ArrowRight size={20} />}
                  onClick={handleNext}
                />
              )}
            </Box>
          )}

          {/* Back/Reset Button */}
          {qrCodeUrl && !receivedImage && (
            <button
              onClick={() => {
                setQrCodeUrl("");
                setConnectionCode("");
              }}
              className="text-white/60 hover:text-white text-sm mt-2"
            >
              ← Generate new code
            </button>
          )}
        </Stack>
      </Center>
    </Box>
  );
};

export default ImageUploadPage;