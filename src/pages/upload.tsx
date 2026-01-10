import { useState, useRef, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { 
  Camera, 
  Image as ImageIcon, 
  Upload as UploadIcon,
  CheckCircle,
  ArrowUp,
  Smartphone
} from "lucide-react";

const MobileUploadPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'ready' | 'uploading' | 'success'>('ready');
  const [connectionCode, setConnectionCode] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get connection code from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        setConnectionCode(code);
      }
    }
  }, []);

  // Handle image selection
  const handleSelectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  // Upload image to main page
  const uploadImage = async () => {
    if (!selectedImage || !connectionCode) {
      alert("Please select an image first");
      return;
    }

    setUploadStatus('uploading');

    // Simulate upload delay
    setTimeout(() => {
      // Store image in localStorage (shared with main page)
      const uploadData = {
        code: connectionCode,
        image: selectedImage,
        fileName: "uploaded-image.jpg",
        timestamp: Date.now(),
        status: 'uploaded'
      };
      
      localStorage.setItem(`upload_${connectionCode}`, JSON.stringify(uploadData));
      
      setUploadStatus('success');
      
      // Show success message
      setTimeout(() => {
        alert("✅ Image uploaded successfully! You can close this page.");
        // Optionally redirect or show close instructions
      }, 500);
    }, 1500);
  };

  return (
    <Box className="min-h-screen w-full bg-[#080319] p-4">
      <Center className="h-full">
        <Stack className="w-full max-w-sm items-center gap-6">
          
          {/* Header */}
          <Center className="flex-col gap-3">
            <div className="p-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full">
              <Smartphone className="size-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">
              Upload to Kiosk AI
            </h1>
            {connectionCode && (
              <div className="px-4 py-2 bg-white/10 rounded-full">
                <p className="text-white/80 text-sm">
                  Connection Code: <span className="font-mono font-bold">{connectionCode}</span>
                </p>
              </div>
            )}
          </Center>

          {/* Upload Area */}
          <Box className="w-full bg-white/5 rounded-xl p-6 border border-white/10">
            <Stack className="gap-6">
              
              {!selectedImage ? (
                // Select Image Button
                <button
                  onClick={handleSelectImage}
                  className="flex flex-col items-center gap-4 p-8 rounded-xl border-2 border-dashed border-white/30 hover:border-white/50 transition-colors"
                >
                  <div className="p-4 rounded-full bg-white/10">
                    <Camera className="size-10 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-lg">Select Image</p>
                    <p className="text-white/60 text-sm mt-1">
                      Choose from gallery or take a photo
                    </p>
                  </div>
                </button>
              ) : (
                // Image Preview
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                      <ImageIcon className="size-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleSelectImage}
                      className="flex-1 py-3 rounded-lg border border-white/20 bg-white/5 text-white text-sm"
                    >
                      Change Image
                    </button>
                    
                    <button
                      onClick={uploadImage}
                      disabled={uploadStatus === 'uploading'}
                      className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-sm ${
                        uploadStatus === 'uploading'
                          ? 'bg-blue-500/50 text-white'
                          : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                      }`}
                    >
                      {uploadStatus === 'uploading' ? (
                        <>
                          <div className="animate-spin rounded-full size-4 border-2 border-white border-t-transparent"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadIcon size={16} />
                          Upload Image
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
              />
            </Stack>
          </Box>

          {/* Upload Status */}
          {uploadStatus === 'success' && (
            <div className="w-full p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="size-6 text-green-500" />
                <div>
                  <p className="text-green-300 font-medium">Upload Successful!</p>
                  <p className="text-green-300/70 text-sm">
                    Image sent to Kiosk AI. You can close this page.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="w-full p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h3 className="text-white font-medium mb-2 text-sm">How it works:</h3>
            <ul className="text-white/70 text-xs space-y-1.5">
              <li className="flex items-start gap-2">
                <ArrowUp className="size-3 mt-0.5 text-blue-300" />
                <span>Select image from your phone</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowUp className="size-3 mt-0.5 text-blue-300" />
                <span>Click "Upload Image"</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowUp className="size-3 mt-0.5 text-blue-300" />
                <span>Image appears on the Kiosk AI screen</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowUp className="size-3 mt-0.5 text-blue-300" />
                <span>Close this page when done</span>
              </li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            onClick={() => window.close()}
            className="text-white/60 hover:text-white text-sm"
          >
            Close this page
          </button>
        </Stack>
      </Center>
    </Box>
  );
};

export default MobileUploadPage;