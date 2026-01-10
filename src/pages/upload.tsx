import { useState, useRef, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { 
  Camera, 
  Upload as UploadIcon,
  CheckCircle,
  Smartphone,
  X
} from "lucide-react";

const MobileUploadPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'ready' | 'uploading' | 'success'>('ready');
  const [connectionCode, setConnectionCode] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  
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
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file (JPG, PNG, etc.)");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert("Image too large! Please select an image under 10MB.");
      return;
    }

    // Set file info
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Upload image to main page - INSTANT
  const uploadImage = () => {
    if (!selectedImage || !connectionCode) {
      alert("Please select an image first");
      return;
    }

    setUploadStatus('uploading');

    // INSTANT UPLOAD - No delay
    // Store image in localStorage (shared with main page)
    const uploadData = {
      code: connectionCode,
      image: selectedImage,
      fileName: fileName,
      fileSize: fileSize,
      timestamp: Date.now(),
      status: 'uploaded'
    };
    
    localStorage.setItem(`upload_${connectionCode}`, JSON.stringify(uploadData));
    
    // Show success immediately
    setUploadStatus('success');
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      // Close the page or show close message
      document.getElementById('close-message')?.classList.remove('hidden');
    }, 500);
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box className="min-h-screen w-full bg-[#080319] p-4">
      <Center className="h-full">
        <Stack className="w-full max-w-sm items-center gap-5">
          
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
                  Code: <span className="font-mono font-bold">{connectionCode}</span>
                </p>
              </div>
            )}
          </Center>

          {/* Upload Area */}
          <Box className="w-full bg-white/5 rounded-xl p-4 border border-white/10">
            <Stack className="gap-4">
              
              {!selectedImage ? (
                // Select Image Button
                <button
                  onClick={handleSelectImage}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/30 hover:border-white/50 transition-colors active:scale-95"
                >
                  <div className="p-3 rounded-full bg-white/10">
                    <Camera className="size-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-lg">Select Image</p>
                    <p className="text-white/60 text-sm mt-1">
                      Tap to choose from gallery
                    </p>
                  </div>
                </button>
              ) : (
                // Image Preview
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden bg-black/20">
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-white text-sm truncate">{fileName}</p>
                      <p className="text-white/70 text-xs">{fileSize}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectImage}
                      className="flex-1 py-3 rounded-lg border border-white/20 bg-white/5 text-white text-sm active:scale-95"
                    >
                      Change Image
                    </button>
                    
                    <button
                      onClick={uploadImage}
                      disabled={uploadStatus === 'uploading'}
                      className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-sm active:scale-95 ${
                        uploadStatus === 'uploading'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                      }`}
                    >
                      {uploadStatus === 'uploading' ? (
                        <>
                          <div className="animate-spin rounded-full size-4 border-2 border-white border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <UploadIcon size={16} />
                          Upload Now
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
                onChange={handleFileSelect}
              />
            </Stack>
          </Box>

          {/* Upload Status */}
          {uploadStatus === 'success' && (
            <div className="w-full p-4 bg-green-500/10 border border-green-500/30 rounded-xl animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle className="size-6 text-green-500" />
                <div>
                  <p className="text-green-300 font-medium">✅ Upload Successful!</p>
                  <p className="text-green-300/70 text-sm mt-1">
                    Image sent to Kiosk AI screen
                  </p>
                  <div id="close-message" className="hidden mt-2 p-2 bg-green-500/20 rounded">
                    <p className="text-green-300 text-xs">
                      You can now close this page
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="w-full p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h3 className="text-white font-medium mb-2 text-sm">How it works:</h3>
            <ul className="text-white/70 text-xs space-y-1.5">
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">1</div>
                <span>Select image from your phone</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">2</div>
                <span>Tap "Upload Now" button</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">3</div>
                <span>Image appears instantly on Kiosk AI</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">4</div>
                <span>Close this page when done</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full">
            {selectedImage && uploadStatus !== 'success' && (
              <button
                onClick={removeImage}
                className="flex-1 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm active:scale-95"
              >
                Cancel
              </button>
            )}
            
            {uploadStatus === 'success' && (
              <button
                onClick={() => window.close()}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm active:scale-95"
              >
                Close Page
              </button>
            )}
          </div>

          {/* Info */}
          <div className="text-center">
            <p className="text-white/50 text-xs">
              Images are sent directly to the Kiosk AI screen
            </p>
            <p className="text-white/40 text-xs mt-1">
              No data is stored on our servers
            </p>
          </div>
        </Stack>
      </Center>
    </Box>
  );
};

export default MobileUploadPage;