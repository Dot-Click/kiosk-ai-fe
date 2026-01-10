import { useState, useRef } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { 
  Camera, 
  Image as ImageIcon, 
  Send,
  Smartphone,
  Key,
  AlertCircle
} from "lucide-react";

const LOCAL_IP = "192.168.18.19"; // Your computer's IP
const PORT = 3000; // Your port

const MobileUploadPage = () => {
  const [status, setStatus] = useState<'ready' | 'connected' | 'uploading' | 'complete'>('ready');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [connectionCode, setConnectionCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get parameters from URL or input
  const initializeFromUrl = () => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session') || '';
    const code = urlParams.get('code') || '';
    
    if (session && code) {
      setSessionId(session);
      setConnectionCode(code);
      setStatus('connected');
      setMessage(`Connected to website with code: ${code}`);
    }
  };

  // Initialize
  useState(() => {
    initializeFromUrl();
  });

  // Select image
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
      setMessage("Please select an image file");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setMessage("Image too large (max 10MB)");
      return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      setMessage(`Selected: ${file.name} (${Math.round(file.size / 1024)}KB)`);
    };
    reader.readAsDataURL(file);
  };

  // Send image to website
  const sendImageToWebsite = async () => {
    if (!selectedImage || !connectionCode) {
      setMessage("Please select image and enter connection code");
      return;
    }
    
    setStatus('uploading');
    setProgress(0);
    setMessage("Uploading image to website...");
    
    // Get the image file
    const input = fileInputRef.current;
    if (!input || !input.files?.[0]) return;
    
    const file = input.files[0];
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      // Convert to base64
      const base64 = await fileToBase64(file);
      
      // Store in localStorage (simulating server upload)
      const uploadData = {
        sessionId,
        connectionCode,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        imageData: base64,
        timestamp: Date.now(),
        status: 'uploaded'
      };
      
      const key = `image_upload_${sessionId}_${connectionCode}`;
      localStorage.setItem(key, JSON.stringify(uploadData));
      
      // Complete upload
      clearInterval(interval);
      setProgress(100);
      setStatus('complete');
      setMessage(`✅ Image uploaded successfully!`);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('connected');
        setSelectedImage(null);
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
      
    } catch (error) {
      setMessage(`Upload failed: ${error}`);
      setStatus('connected');
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Manual code entry
  const handleCodeSubmit = () => {
    if (connectionCode.length !== 6) {
      setMessage("Please enter a 6-digit code");
      return;
    }
    
    // Generate session if not from URL
    if (!sessionId) {
      setSessionId(`mobile-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`);
    }
    
    setStatus('connected');
    setMessage(`Connected with code: ${connectionCode}`);
  };

  return (
    <Box className="min-h-screen w-full bg-[#080319] p-4">
      <Stack className="max-w-md mx-auto gap-6 py-8">
        
        {/* Header */}
        <Center className="flex-col gap-4">
          <div className="p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <Smartphone className="size-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white text-center">Send Image to Website</h1>
          <p className="text-white/60 text-center text-sm">
            Upload images from your phone to the website
          </p>
        </Center>

        {/* Connection Status */}
        <Box className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              status === 'ready' ? 'bg-gray-500' :
              status === 'connected' ? 'bg-green-500 animate-pulse' :
              status === 'uploading' ? 'bg-blue-500 animate-pulse' :
              'bg-purple-500'
            }`} />
            <div>
              <p className="text-white font-medium">
                {status === 'ready' && 'Enter Connection Code'}
                {status === 'connected' && '✅ Ready to Upload'}
                {status === 'uploading' && '📤 Uploading...'}
                {status === 'complete' && '✅ Upload Complete!'}
              </p>
              <p className="text-white/60 text-sm">
                {status === 'connected' && `Code: ${connectionCode}`}
              </p>
            </div>
          </div>
          
          {message && (
            <p className="text-white/80 text-sm mt-3 p-3 bg-white/5 rounded-lg">
              {message}
            </p>
          )}
        </Box>

        {/* Progress Bar */}
        {progress > 0 && (
          <Box className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white text-sm">{progress}%</span>
                <span className="text-white/60 text-sm">
                  {status === 'uploading' ? 'Uploading...' : 'Complete!'}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Box>
        )}

        {/* Connection Code Input (if not from QR) */}
        {!sessionId && (
          <Box className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <Stack className="gap-4">
              <div className="flex items-center gap-2">
                <Key className="size-5 text-yellow-500" />
                <h3 className="text-white font-medium">Enter Connection Code</h3>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={connectionCode}
                  onChange={(e) => setConnectionCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code from website"
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40"
                />
                <button
                  onClick={handleCodeSubmit}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium"
                >
                  Connect to Website
                </button>
              </div>
              
              <p className="text-white/60 text-xs">
                Get this code from the QR code on the website
              </p>
            </Stack>
          </Box>
        )}

        {/* Image Selection */}
        <Box className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl p-6 border border-white/10">
          <Stack className="gap-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Select Image</h2>
              <p className="text-white/60">Choose image from your phone</p>
            </div>
            
            {selectedImage ? (
              <div className="space-y-6">
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Selected" 
                    className="w-full h-64 object-cover rounded-xl border-2 border-white/20"
                  />
                  <div className="absolute top-4 right-4 bg-white/20 rounded-full p-2">
                    <ImageIcon className="size-5 text-white" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSelectImage}
                    className="py-3 rounded-xl border border-white/20 bg-white/5 text-white flex items-center justify-center gap-2"
                  >
                    <Camera className="size-5" />
                    Change
                  </button>
                  
                  <button
                    onClick={sendImageToWebsite}
                    disabled={status !== 'connected'}
                    className={`py-3 rounded-xl flex items-center justify-center gap-2 ${
                      status === 'connected'
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    <Send className="size-5" />
                    {status === 'uploading' ? 'Uploading...' : 'Upload to Website'}
                  </button>
                </div>
              </div>
            ) : (
              <Center>
                <button
                  onClick={handleSelectImage}
                  className="flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed border-white/30 hover:border-white/50 transition-colors w-full"
                >
                  <div className="p-4 rounded-full bg-white/10">
                    <Camera className="size-12 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">Tap to Select Image</p>
                    <p className="text-white/60 text-sm mt-1">
                      Choose from gallery
                    </p>
                  </div>
                </button>
              </Center>
            )}
          </Stack>
        </Box>

        {/* Instructions */}
        <Box className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <AlertCircle className="size-5" />
            Testing Instructions:
          </h3>
          <ol className="space-y-2 text-sm text-white/80 pl-5">
            <li>Make sure your phone is connected to same WiFi</li>
            <li>Website should be running on computer</li>
            <li>Enter connection code from website</li>
            <li>Select image and upload</li>
            <li>Image will appear on website automatically</li>
          </ol>
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-white/60 text-xs">Website URL:</p>
            <p className="text-white text-sm">http://{LOCAL_IP}:{PORT}</p>
          </div>
        </Box>

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
  );
};

export default MobileUploadPage;