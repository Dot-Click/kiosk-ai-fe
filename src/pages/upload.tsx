import { useState, useRef, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { 
  Camera, 
  Upload as UploadIcon,
  CheckCircle,
  Smartphone,
  X,
  Loader2
} from "lucide-react";

const MobileUploadPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'ready' | 'uploading' | 'success'>('ready');
  const [connectionCode, setConnectionCode] = useState<string>('');
  const [uploadId, setUploadId] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get parameters from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const id = urlParams.get('id');
      
      if (code) setConnectionCode(code);
      if (id) setUploadId(id);
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
    
    if (file.size > 10 * 1024 * 1024) {
      alert("Image too large! Please select an image under 10MB.");
      return;
    }

    // Set file info
    setFileName(file.name);

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  // Upload image via API
  const uploadImage = async () => {
    if (!selectedImage || !connectionCode || !uploadId) {
      alert("Please select an image first");
      return;
    }

    setUploadStatus('uploading');

    try {
      // Send to API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uploadId: uploadId,
          image: selectedImage,
          code: connectionCode,
          fileName: fileName,
          timestamp: Date.now()
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus('success');
        
        // Also store in localStorage as fallback
        localStorage.setItem(`upload_${uploadId}`, JSON.stringify({
          code: connectionCode,
          image: selectedImage,
          fileName: fileName,
          timestamp: Date.now()
        }));
        
        // Show success
        setTimeout(() => {
          document.getElementById('success-message')?.classList.remove('hidden');
        }, 500);
        
      } else {
        throw new Error('Upload failed');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      setUploadStatus('ready');
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setFileName('');
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
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectImage}
                      className="flex-1 py-3 rounded-lg border border-white/20 bg-white/5 text-white text-sm active:scale-95"
                    >
                      Change
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
                          <Loader2 className="size-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <UploadIcon size={16} />
                          Upload
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
                    Image sent to Kiosk AI
                  </p>
                  <div id="success-message" className="hidden mt-2 p-2 bg-green-500/20 rounded">
                    <p className="text-green-300 text-xs">
                      You can now close this page. Image will appear on the main screen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={() => window.close()}
            className="text-white/60 hover:text-white text-sm py-2"
          >
            Close Page
          </button>
        </Stack>
      </Center>
    </Box>
  );
};

export default MobileUploadPage;