
// import { useState, useRef } from "react";
// import CustomButton from "@/components/common/customButton";
// import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { QrCode, Upload,  ArrowRight, Copy } from "lucide-react";

// const ImageUploadPage = () => {
//   const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
//   const [connectionCode, setConnectionCode] = useState<string>("");
//   const [receivedImage, setReceivedImage] = useState<string | null>(null);
//   const [showNext, setShowNext] = useState<boolean>(false);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Generate QR code
//   const generateQRCode = () => {
//     // Generate random 6-digit code
//     const code = Math.floor(100000 + Math.random() * 900000).toString();
//     setConnectionCode(code);
    
//     // Create mobile upload URL with your domain
//     const uploadUrl = `kiosk-ai.vercel.app/upload?code=${code}`;
    
//     // Generate QR code image
//     const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uploadUrl)}`;
//     setQrCodeUrl(qrImageUrl);
//   };

//   // Handle image received (simulated - in real app this would come from backend)
//   const handleImageReceived = () => {
//     // For demo, use a file input. In production, images come from mobile upload
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Handle file selection (demo only)
//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file || !file.type.startsWith('image/')) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const imageUrl = e.target?.result as string;
//       setReceivedImage(imageUrl);
//       setShowNext(true); // Show next button when image is received
//     };
//     reader.readAsDataURL(file);
//   };

//   // Copy code to clipboard
//   const copyCode = () => {
//     navigator.clipboard.writeText(connectionCode);
//     alert("Code copied to clipboard!");
//   };

//   // Proceed to next step
//   const handleNext = () => {
//     // Your next workflow starts here
//     alert("Proceeding to next step...");
//     // window.location.href = "/next-step"; // Or your next page
//   };

//   return (
//     <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat p-4">
//       <Center className="h-full">
//         <Stack className="w-full max-w-md items-center gap-6">
          
//           {/* Logo/Icon */}
//           <Center className="relative mb-4">
//             <Box
//               className="absolute rounded-full"
//               style={{
//                 width: "150px",
//                 height: "150px",
//                 background: "rgba(226, 2, 255, 0.15)",
//                 filter: "blur(40px)",
//               }}
//             />
//             <img
//               src="/general/onlybluetooth.svg"
//               alt="QR Upload"
//               className="size-24 relative z-10"
//             />
//           </Center>

//           {/* Title */}
//           <h1 className="text-2xl font-bold text-white text-center">
//             Upload Image from Phone
//           </h1>
//           <p className="text-white/70 text-sm text-center">
//             Scan QR code with your phone to upload images
//           </p>

//           {/* QR Code Section */}
//           {!qrCodeUrl ? (
//             // Initial state - Show generate button
//             <Box className="w-full mt-4">
//               <CustomButton
//                 wrapperClassName="w-full h-12"
//                 title="Show QR Code"
//                 icon={<QrCode size={20} />}
//                 onClick={generateQRCode}
//               />
//             </Box>
//           ) : (
//             // QR Code generated state
//             <Box className="w-full space-y-4">
//               {/* QR Code Display */}
//               <Center className="p-4 bg-white/10 rounded-xl border border-white/20">
//                 <img 
//                   src={qrCodeUrl} 
//                   alt="Scan this QR code" 
//                   className="w-48 h-48"
//                 />
//               </Center>

//               {/* Connection Code */}
//               <Box className="bg-white/5 rounded-lg p-3 border border-white/10">
//                 <p className="text-white/60 text-xs mb-1">Connection Code:</p>
//                 <div className="flex items-center justify-between">
//                   <code className="text-white text-lg font-mono">{connectionCode}</code>
//                   <button
//                     onClick={copyCode}
//                     className="text-white/60 hover:text-white p-1"
//                     title="Copy code"
//                   >
//                     <Copy size={18} />
//                   </button>
//                 </div>
//               </Box>

//               {/* Instructions */}
//               <Box className="bg-white/5 rounded-lg p-4 border border-white/10">
//                 <h3 className="text-white text-sm font-medium mb-2">How to upload:</h3>
//                 <ol className="text-white/70 text-xs space-y-1 pl-4">
//                   <li>1. Open camera on your phone</li>
//                   <li>2. Scan the QR code above</li>
//                   <li>3. Follow the link that appears</li>
//                   <li>4. Select image from your gallery</li>
//                   <li>5. Image will appear here automatically</li>
//                 </ol>
//               </Box>

//               {/* Demo Upload Button (for testing without phone) */}
//               <Box className="pt-4 border-t border-white/10">
//                 <p className="text-white/60 text-xs mb-2">Testing without phone?</p>
//                 <button
//                   onClick={handleImageReceived}
//                   className="w-full py-3 rounded-lg border border-white/20 bg-white/5 text-white text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <Upload size={18} />
//                   Upload Test Image
//                 </button>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleFileSelect}
//                 />
//               </Box>
//             </Box>
//           )}

//           {/* Received Image Display */}
//           {receivedImage && (
//             <Box className="w-full space-y-4 animate-in fade-in">
//               <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
//                 <p className="text-green-300 text-sm text-center">
//                   ✅ Image received successfully!
//                 </p>
//               </div>
              
//               <Box className="bg-white/5 rounded-xl border border-white/20 overflow-hidden">
//                 <img 
//                   src={receivedImage} 
//                   alt="Uploaded" 
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-3 bg-black/30">
//                   <p className="text-white text-sm">Image ready for processing</p>
//                 </div>
//               </Box>

//               {/* Next Button */}
//               {showNext && (
//                 <CustomButton
//                   wrapperClassName="w-full h-12"
//                   title="Next Step"
//                   icon={<ArrowRight size={20} />}
//                   onClick={handleNext}
//                 />
//               )}
//             </Box>
//           )}

//           {/* Back/Reset Button */}
//           {qrCodeUrl && !receivedImage && (
//             <button
//               onClick={() => {
//                 setQrCodeUrl("");
//                 setConnectionCode("");
//               }}
//               className="text-white/60 hover:text-white text-sm mt-2"
//             >
//               ← Generate new code
//             </button>
//           )}
//         </Stack>
//       </Center>
//     </Box>
//   );
// };

// export default ImageUploadPage;






// import { useState, useRef, useEffect } from "react";
// import CustomButton from "@/components/common/customButton";
// import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { useNavigate } from "react-router";
// import { Flex } from "@/components/ui/flex";
// import { Stack } from "@/components/ui/stack";
// import { QrCode, Image as ImageIcon, ArrowRight, Copy, Smartphone, RefreshCw } from "lucide-react";
// import GoBackButton from "../components/horizontalnavbar/horizontalnavbar.tsx"; // Assuming the path to your navbar components
// import { HorizontalNavbar } from "../components/horizontalnavbar/horizontalnavbar.tsx"; // Assuming this is where HorizontalNavbar is exported

// const QRUploadPage = () => {
//   const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
//   const [connectionCode, setConnectionCode] = useState<string>("");
//   const [receivedImage, setReceivedImage] = useState<string | null>(null);
//   const [showNext, setShowNext] = useState<boolean>(false);
//   const [isChecking, setIsChecking] = useState<boolean>(false);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   // Generate QR code
//   const generateQRCode = () => {
//     // Generate random 6-digit code
//     const code = Math.floor(100000 + Math.random() * 900000).toString();
//     setConnectionCode(code);
    
//     // Create mobile upload URL with your domain
//     const uploadUrl = `kiosk-ai.vercel.app/upload?code=${code}`;
    
//     // Generate QR code image
//     const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(uploadUrl)}&color=2d2d6d&bgcolor=ffffff`;
//     setQrCodeUrl(qrImageUrl);
    
//     // Start checking for uploads
//     startCheckingForUploads(code);
//   };

//   // Start checking for uploaded images
//   const startCheckingForUploads = (code: string) => {
//     // Clear any existing interval
//     if (checkIntervalRef.current) {
//       clearInterval(checkIntervalRef.current);
//     }
    
//     setIsChecking(true);
    
//     // Check immediately
//     checkForUpload(code);
    
//     // Set up interval to check every 1 second
//     checkIntervalRef.current = setInterval(() => {
//       checkForUpload(code);
//     }, 1000);
//   };

//   // Check if image was uploaded
//   const checkForUpload = (code: string) => {
//     const data = localStorage.getItem(`upload_${code}`);
//     if (data) {
//       try {
//         const parsed = JSON.parse(data);
//         if (parsed.image && parsed.code === code) {
//           // Image found! Stop checking and show it
//           setReceivedImage(parsed.image);
//           setShowNext(true);
//           setIsChecking(false);
          
//           // Clear the interval
//           if (checkIntervalRef.current) {
//             clearInterval(checkIntervalRef.current);
//             checkIntervalRef.current = null;
//           }
          
//           // Remove from localStorage after 5 seconds
//           setTimeout(() => {
//             localStorage.removeItem(`upload_${code}`);
//           }, 5000);
//         }
//       } catch (error) {
//         console.error("Error parsing upload data:", error);
//       }
//     }
//   };

//   // Manual check button
//   const manualCheck = () => {
//     if (connectionCode) {
//       checkForUpload(connectionCode);
//     }
//   };

//   // Handle image received (simulated - for testing without phone)
//   // const handleImageReceived = () => {
//   //   if (fileInputRef.current) {
//   //     fileInputRef.current.click();
//   //   }
//   // };

//   // Handle file selection (demo only)
//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file || !file.type.startsWith('image/')) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const imageUrl = e.target?.result as string;
//       setReceivedImage(imageUrl);
//       setShowNext(true);
      
//       // Store in localStorage (simulates mobile upload)
//       const uploadData = {
//         code: connectionCode,
//         image: imageUrl,
//         fileName: file.name,
//         timestamp: Date.now()
//       };
//       localStorage.setItem(`upload_${connectionCode}`, JSON.stringify(uploadData));
//     };
//     reader.readAsDataURL(file);
//   };

//   // Copy code to clipboard
//   const copyCode = () => {
//     navigator.clipboard.writeText(connectionCode);
//     alert("Code copied to clipboard!");
//   };

//   // Proceed to next step
//   const handleNext = () => {
//     // Your next workflow starts here
//     alert("Proceeding to next step with the image...");
//     // You can redirect or pass the image to next page:
//     // window.location.href = `/process?image=${encodeURIComponent(receivedImage)}`;
//   };

//   // Reset everything
//   const resetAll = () => {
//     // Clear interval
//     if (checkIntervalRef.current) {
//       clearInterval(checkIntervalRef.current);
//       checkIntervalRef.current = null;
//     }
    
//     // Clear localStorage for this code
//     if (connectionCode) {
//       localStorage.removeItem(`upload_${connectionCode}`);
//     }
    
//     // Reset state
//     setQrCodeUrl("");
//     setConnectionCode("");
//     setReceivedImage(null);
//     setShowNext(false);
//     setIsChecking(false);
//   };

//   // Cleanup on component unmount
//   useEffect(() => {
//     return () => {
//       if (checkIntervalRef.current) {
//         clearInterval(checkIntervalRef.current);
//       }
//     };
//   }, []);
  
//   const navigate = useNavigate();

//   // Handle back navigation
//   const handleGoBack = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     // Navigate back or to a specific route
//     navigate("/select-methods"); 
//     console.log("Navigate back to select methods");
//   };
  

//   return (
//   <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat p-4 relative overflow-x-hidden">
//   {/* Horizontal Navbar */}
//   <HorizontalNavbar />
  
//   {/* Back Button */}
//   <Box className="absolute top-8 xl:top-10 2xl:top-12 left-4 sm:left-6 md:left-8 lg:left-10 xl:left-32 2xl:left-40 z-50">
//     <GoBackButton onClick={handleGoBack} />
//   </Box>

//   {/* Custom Navbar for QR Upload Page */}
//   <Box className="absolute flex items-center justify-center w-full top-8 xl:top-10 2xl:top-12 z-40 px-4">
//     <Stack className="z-20 justify-center items-center p-0 gap-0 xl:gap-1 2xl:gap-2 max-w-full">
//       <Flex className="font-bold flex-col sm:flex-row items-center text-center">
//         <h1 className="bg-[linear-gradient(0deg,#E5E5E1_90%,#E5E5E5_100%)] bg-clip-text text-transparent tracking-wide text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
//           Upload from your
//         </h1>
//         <span className="text-[#F70353] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl ml-0 sm:ml-2 xl:ml-3 2xl:ml-4">
//           PHONE
//         </span>
//       </Flex>
//       <p
//         className="text-[#FFFFFF]/80 font-light p-0 text-center "
//         style={{
//           letterSpacing: "1.6px",
//           fontSize:"9px",
//           userSelect: "none",
//         }}
//       >
//         Scan QR code to upload images from your phone
//       </p>
//     </Stack>
//   </Box>

//   <Center className="h-full mt-20 pt-28 sm:pt-32 md:pt-36 overflow-y-auto"> 
//     <Stack className="w-full max-w-md items-center gap-4 sm:gap-6 px-2 sm:px-4">
      
//       {/* Logo/Icon */}
//       <Center className="relative mb-2">
//         <Box
//           className="absolute rounded-full"
//           style={{
//             width: "100px",
//             height: "100px",
//             background: "rgba(226, 2, 255, 0.15)",
//             filter: "blur(30px)",
//           }}
//         />
//         <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-white/10">
//           <Smartphone className="size-8 sm:size-10 md:size-12 text-purple-400" />
//         </div>
//       </Center>

//       {/* QR Code Section */}
//       {!qrCodeUrl ? (
//         // Initial state - Show generate button
//         <Box className="w-full mt-2 px-2 sm:px-0">
//           <CustomButton
//             wrapperClassName="w-full h-10 sm:h-12"
//             title="Generate QR Code"
//             icon={<QrCode size={18} />}
//             onClick={generateQRCode}
//           />
//         </Box>
//       ) : (
//         // QR Code generated state
//         <Box className="w-full space-y-3 sm:space-y-4 px-2 sm:px-0">
//           {/* QR Code Display */}
//           <Center className="p-3 sm:p-4 bg-white rounded-lg">
//             <img 
//               src={qrCodeUrl} 
//               alt="Scan this QR code" 
//               className="w-48 h-48 sm:w-56 sm:h-56"
//             />
//           </Center>

//           {/* Connection Code & Status */}
//           <Box className="bg-white/5 rounded-lg p-3 border border-white/10">
//             <div className="flex items-center justify-between mb-2">
//               <div className="overflow-hidden">
//                 <p className="text-white/60 text-xs">Connection Code:</p>
//                 <code className="text-white text-base sm:text-lg font-mono truncate">
//                   {connectionCode}
//                 </code>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={copyCode}
//                   className="text-white/60 hover:text-white p-1"
//                   title="Copy code"
//                 >
//                   <Copy size={16} />
//                 </button>
//                 <button
//                   onClick={manualCheck}
//                   className="text-white/60 hover:text-white p-1"
//                   title="Check for uploads"
//                 >
//                   <RefreshCw size={16} className={isChecking ? "animate-spin" : ""} />
//                 </button>
//               </div>
//             </div>
            
//             {/* Upload Status */}
//             {isChecking && !receivedImage && (
//               <div className="mt-2 p-2 bg-blue-500/10 rounded">
//                 <p className="text-blue-300 text-xs flex items-center gap-1">
//                   <div className="size-2 rounded-full bg-blue-500 animate-pulse"></div>
//                   Checking for uploads...
//                 </p>
//               </div>
//             )}
//           </Box>

//           {/* Instructions */}
//           <Box className="bg-white/5 rounded-lg p-3 border border-white/10">
//             <h3 className="text-white text-sm font-medium mb-2">How to upload:</h3>
//             <ol className="text-white/70 text-xs space-y-1.5">
//               <li className="flex items-center gap-2">
//                 <span className="bg-purple-500/20 text-purple-300 rounded-full size-4 sm:size-5 flex items-center justify-center text-[10px] sm:text-xs">1</span>
//                 Open phone camera
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="bg-purple-500/20 text-purple-300 rounded-full size-4 sm:size-5 flex items-center justify-center text-[10px] sm:text-xs">2</span>
//                 Scan QR code above
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="bg-purple-500/20 text-purple-300 rounded-full size-4 sm:size-5 flex items-center justify-center text-[10px] sm:text-xs">3</span>
//                 Tap the link that appears
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="bg-purple-500/20 text-purple-300 rounded-full size-4 sm:size-5 flex items-center justify-center text-[10px] sm:text-xs">4</span>
//                 Select and upload image
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="bg-purple-500/20 text-purple-300 rounded-full size-4 sm:size-5 flex items-center justify-center text-[10px] sm:text-xs">5</span>
//                 Image appears here automatically
//               </li>
//             </ol>
//           </Box>

//           {/* Demo Upload Button (for testing without phone) */}
//           <Box className="pt-3 border-t border-white/10">
//             <input
//               type="file"
//               ref={fileInputRef}
//               className="hidden"
//               accept="image/*"
//               onChange={handleFileSelect}
//             />
//           </Box>
//         </Box>
//       )}

//       {/* Received Image Display */}
//       {receivedImage && (
//         <Box className="w-full space-y-3 sm:space-y-4 px-2 sm:px-0 animate-in fade-in">
//           <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
//             <p className="text-green-300 text-xs sm:text-sm text-center flex items-center justify-center gap-2">
//               <ImageIcon size={14} />
//               ✅ Image received successfully!
//             </p>
//           </div>
          
//           <Box className="bg-white/5 rounded-lg border border-white/20 overflow-hidden">
//             <img 
//               src={receivedImage} 
//               alt="Uploaded" 
//               className="w-full h-32 sm:h-40 object-cover"
//             />
//             <div className="p-3 bg-black/30">
//               <p className="text-white text-xs sm:text-sm">Image uploaded from phone</p>
//             </div>
//           </Box>

//           {/* Next Button */}
//           {showNext && (
//             <CustomButton
//               wrapperClassName="w-full h-10 sm:h-12"
//               title="Continue to Next Step"
//               icon={<ArrowRight size={18} />}
//               onClick={handleNext}
//             />
//           )}
//         </Box>
//       )}

//       {/* Status Message - Shows when waiting for upload */}
//       {qrCodeUrl && !receivedImage && (
//         <div className="w-full space-y-3 px-2 sm:px-0">
//           <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
//             <p className="text-blue-300 text-xs sm:text-sm text-center">
//               {isChecking ? "🔍 Checking for uploads..." : "⏳ Waiting for image upload..."}
//             </p>
//             <p className="text-blue-300/70 text-[10px] sm:text-xs text-center mt-1">
//               Make sure mobile user scans QR and uploads image
//             </p>
//           </div>
          
//           <button
//             onClick={manualCheck}
//             className="w-full py-2 rounded-lg border border-white/20 bg-white/5 text-white text-xs sm:text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
//           >
//             <RefreshCw size={12} className={isChecking ? "animate-spin" : ""} />
//             Check Now for Upload
//           </button>
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex gap-2 w-full px-2 sm:px-0">
//         {qrCodeUrl && !receivedImage && (
//           <button
//             onClick={resetAll}
//             className="flex-1 py-2 rounded-lg border border-white/20 bg-white/5 text-white text-xs sm:text-sm hover:bg-white/10 transition-colors"
//           >
//             Start Over
//           </button>
//         )}
        
//         {receivedImage && (
//           <button
//             onClick={resetAll}
//             className="flex-1 py-2 rounded-lg border border-white/20 bg-white/5 text-white text-xs sm:text-sm hover:bg-white/10 transition-colors"
//           >
//             Upload Another Image
//           </button>
//         )}
//       </div>
//     </Stack>
//   </Center>
// </Box>
//   );
// };

// export default QRUploadPage;


// import { useState, useRef, useEffect } from "react";
// import CustomButton from "@/components/common/customButton";
// import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { useNavigate } from "react-router";
// import { Flex } from "@/components/ui/flex";
// import { Stack } from "@/components/ui/stack";
// import { QrCode, Image as ImageIcon, ArrowRight, Copy, Smartphone, RefreshCw, ExternalLink, AlertCircle, Check } from "lucide-react";
// import GoBackButton from "../components/horizontalnavbar/horizontalnavbar.tsx";
// import { HorizontalNavbar } from "../components/horizontalnavbar/horizontalnavbar.tsx";

// // Backend API Configuration
// const API_BASE_URL = "https://kiosk-ai-be-production.up.railway.app/api/v1";

// interface QRCodeData {
//   code: string;
//   qrImageUrl: string;
//   uploadUrl: string;
//   expiresAt: string;
//   createdAt: string;
// }

// const QRUploadPage = () => {
//   const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
//   const [receivedImage, setReceivedImage] = useState<string | null>(null);
//   const [showNext, setShowNext] = useState<boolean>(false);
//   const [isChecking, setIsChecking] = useState<boolean>(false);
//   const [isGenerating, setIsGenerating] = useState<boolean>(false);
//   const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
//   const [error, setError] = useState<string | null>(null);
//   const [debugInfo, setDebugInfo] = useState<any>(null);
  
//   const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const navigate = useNavigate();

//   // Check backend health on component mount
//   useEffect(() => {
//     checkBackendHealth();
//   }, []);

//   const checkBackendHealth = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/health`);
//       const data = await response.json();
//       if (response.ok) {
//         setBackendStatus('connected');
//         setDebugInfo({
//           backend: 'connected',
//           url: API_BASE_URL,
//           timestamp: new Date().toISOString()
//         });
//       } else {
//         setBackendStatus('error');
//         setError(`Backend error: ${data.message || response.status}`);
//       }
//     } catch (err: any) {
//       setBackendStatus('error');
//       setError(`Cannot connect to backend: ${err.message}`);
//     }
//   };

//   // Generate QR code from backend
//   const generateQRCode = async () => {
//     setIsGenerating(true);
//     setError(null);
//     setQrCodeData(null);
//     setReceivedImage(null);
    
//     try {
//       console.log('📡 Generating QR code from backend...');
      
//       const response = await fetch(`${API_BASE_URL}/qr/generate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       console.log('📊 Response status:', response.status);
      
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('📦 Response data:', data);
      
//       if (data.success && data.data) {
//         console.log('✅ QR Code generated successfully');
//         console.log('📱 Upload URL:', data.data.uploadUrl);
        
//         setQrCodeData(data.data);
        
//         // Start checking for uploads
//         startCheckingForUploads(data.data.code);
        
//         setDebugInfo(prev => ({
//           ...prev,
//           qrGenerated: true,
//           qrCode: data.data.code,
//           uploadUrl: data.data.uploadUrl,
//           timestamp: new Date().toISOString()
//         }));
//       } else {
//         throw new Error(data.message || 'Invalid response from server');
//       }
//     } catch (error: any) {
//       console.error('❌ Error generating QR code:', error);
//       setError(`Failed to generate QR code: ${error.message}`);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Start checking for uploaded images every 2 seconds
//   const startCheckingForUploads = (code: string) => {
//     // Clear any existing interval
//     if (checkIntervalRef.current) {
//       clearInterval(checkIntervalRef.current);
//     }
    
//     setIsChecking(true);
    
//     // Check immediately
//     checkForUploadFromBackend(code);
    
//     // Set up interval to check every 2 seconds
//     checkIntervalRef.current = setInterval(() => {
//       checkForUploadFromBackend(code);
//     }, 2000);
//   };

//   // Check if image was uploaded to backend
//   const checkForUploadFromBackend = async (code: string) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/upload/check/${code}`);
      
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.success && data.data && data.data.exists) {
//         // Image found!
//         const imageUrl = `${API_BASE_URL}/upload/image/${code}`;
//         console.log('🖼️ Image found:', imageUrl);
        
//         setReceivedImage(imageUrl);
//         setShowNext(true);
//         setIsChecking(false);
        
//         // Clear the interval
//         if (checkIntervalRef.current) {
//           clearInterval(checkIntervalRef.current);
//           checkIntervalRef.current = null;
//         }
//       }
//     } catch (error) {
//       console.error("Error checking upload:", error);
//     }
//   };

//   // Manual check button
//   const manualCheck = async () => {
//     if (qrCodeData?.code) {
//       setIsChecking(true);
//       await checkForUploadFromBackend(qrCodeData.code);
//       setIsChecking(false);
//     }
//   };

//   // Copy code to clipboard
//   const copyCode = () => {
//     if (qrCodeData?.code) {
//       navigator.clipboard.writeText(qrCodeData.code);
//       alert("Code copied to clipboard!");
//     }
//   };

//   // Copy upload URL to clipboard
//   const copyUploadUrl = () => {
//     if (qrCodeData?.uploadUrl) {
//       navigator.clipboard.writeText(qrCodeData.uploadUrl);
//       alert("Upload URL copied to clipboard!");
//     }
//   };

//   // Open upload URL in new tab
//   const openUploadPage = () => {
//     if (qrCodeData?.uploadUrl) {
//       window.open(qrCodeData.uploadUrl, '_blank', 'noopener,noreferrer');
//     }
//   };

//   // Test upload URL
//   const testUploadUrl = () => {
//     if (qrCodeData?.uploadUrl) {
//       const testWindow = window.open('', '_blank');
//       if (testWindow) {
//         testWindow.document.write(`
//           <html>
//             <head><title>Test Upload URL</title></head>
//             <body style="padding: 20px; font-family: Arial;">
//               <h1>Upload URL Test</h1>
//               <p>URL: ${qrCodeData.uploadUrl}</p>
//               <p>Code: ${qrCodeData.code}</p>
//               <button onclick="window.location.href='${qrCodeData.uploadUrl}'" 
//                       style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
//                 Open Upload Page
//               </button>
//             </body>
//           </html>
//         `);
//         testWindow.document.close();
//       }
//     }
//   };

//   // Proceed to next step
//   const handleNext = () => {
//     if (receivedImage && qrCodeData) {
//       navigate(`/process-image?code=${qrCodeData.code}`);
//     }
//   };

//   // Reset everything
//   const resetAll = () => {
//     // Clear interval
//     if (checkIntervalRef.current) {
//       clearInterval(checkIntervalRef.current);
//       checkIntervalRef.current = null;
//     }
    
//     // Reset state
//     setQrCodeData(null);
//     setReceivedImage(null);
//     setShowNext(false);
//     setIsChecking(false);
//     setError(null);
//   };

//   // Cleanup on component unmount
//   useEffect(() => {
//     return () => {
//       if (checkIntervalRef.current) {
//         clearInterval(checkIntervalRef.current);
//       }
//     };
//   }, []);

//   // Handle back navigation
//   const handleGoBack = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     navigate("/select-methods"); 
//   };

//   // Test backend connection
//   const testBackend = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/health`);
//       const data = await response.json();
//       alert(`✅ Backend is running!\nStatus: ${data.status}\nTime: ${data.timestamp}`);
//     } catch (err: any) {
//       alert(`❌ Backend test failed: ${err.message}`);
//     }
//   };

//   return (
//     <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat p-4 relative overflow-x-hidden">
//       {/* Horizontal Navbar */}
//       <HorizontalNavbar />
      
//       {/* Back Button */}
//       <Box className="absolute top-8 xl:top-10 2xl:top-12 left-4 sm:left-6 md:left-8 lg:left-10 xl:left-32 2xl:left-40 z-50">
//         <GoBackButton onClick={handleGoBack} />
//       </Box>

//       {/* Custom Navbar for QR Upload Page */}
//       <Box className="absolute flex items-center justify-center w-full top-8 xl:top-10 2xl:top-12 z-40 px-4">
//         <Stack className="z-20 justify-center items-center p-0 gap-0 xl:gap-1 2xl:gap-2 max-w-full">
//           <Flex className="font-bold flex-col sm:flex-row items-center text-center">
//             <h1 className="bg-[linear-gradient(0deg,#E5E5E1_90%,#E5E5E5_100%)] bg-clip-text text-transparent tracking-wide text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
//               Upload from your
//             </h1>
//             <span className="text-[#F70353] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl ml-0 sm:ml-2 xl:ml-3 2xl:ml-4">
//               PHONE
//             </span>
//           </Flex>
//           <p
//             className="text-[#FFFFFF]/80 font-light p-0 text-center"
//             style={{
//               letterSpacing: "1.6px",
//               fontSize: "11px",
//               userSelect: "none",
//             }}
//           >
//             Scan QR code to upload images from your phone
//           </p>
//         </Stack>
//       </Box>

//       <Center className="h-full mt-20 pt-28 sm:pt-32 md:pt-36 overflow-y-auto"> 
//         <Stack className="w-full max-w-md items-center gap-4 sm:gap-6 px-2 sm:px-4">
          
        

           

//           {/* Logo/Icon */}
//           <Center className="relative mb-2">
//             <Box
//               className="absolute rounded-full"
//               style={{
//                 width: "100px",
//                 height: "100px",
//                 background: "rgba(226, 2, 255, 0.15)",
//                 filter: "blur(30px)",
//               }}
//             />
//             <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-white/10">
//               <Smartphone className="size-8 sm:size-10 md:size-12 text-purple-400" />
//             </div>
//           </Center>

//           {/* QR Code Section */}
//           {!qrCodeData ? (
//             // Initial state - Show generate button
//             <Box className="w-full mt-2 px-2 sm:px-0">
//               <CustomButton
//                 wrapperClassName="w-full h-10 sm:h-12"
//                 title={isGenerating ? "Generating QR Code..." : "Generate QR Code"}
//                 icon={isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <QrCode size={18} />}
//                 onClick={generateQRCode}
//                 disabled={isGenerating || backendStatus !== 'connected'}
//               />
//               <p className="text-white/60 text-xs text-center mt-2">
//                 Click to generate a unique QR code for mobile upload
//               </p>
//             </Box>
//           ) : (
//             // QR Code generated state
//             <Box className="w-full space-y-3 sm:space-y-4 px-2 sm:px-0">
//               {/* QR Code Display */}
//               <Center className="p-3 sm:p-4 bg-white rounded-lg relative">
//                 {qrCodeData.qrImageUrl ? (
//                   <img 
//                     src={qrCodeData.qrImageUrl} 
//                     alt="Scan this QR code" 
//                     className="w-48 h-48 sm:w-56 sm:h-56"
//                   />
//                 ) : (
//                   <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-gray-100 rounded">
//                     <p className="text-gray-500 text-sm">QR Code loading...</p>
//                   </div>
//                 )}
                
//               </Center>

//               {/* Connection Code & Status */}
//               <Box className="bg-white/5 rounded-lg p-3 border border-white/10">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="overflow-hidden">
//                     <p className="text-white/60 text-xs">Connection Code:</p>
//                     <div className="flex items-center gap-2">
//                       <code className="text-white text-base sm:text-lg font-mono truncate">
//                         {qrCodeData.code}
//                       </code>
//                       <span className="text-xs bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
//                         Active
//                       </span>
//                     </div>
//                     <p className="text-white/40 text-xs mt-1">
//                       Expires: {new Date(qrCodeData.expiresAt).toLocaleTimeString()}
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={copyCode}
//                       className="text-white/60 hover:text-white p-1 transition-colors"
//                       title="Copy code"
//                     >
//                       <Copy size={16} />
//                     </button>
//                     <button
//                       onClick={manualCheck}
//                       className="text-white/60 hover:text-white p-1 transition-colors"
//                       title="Check for uploads"
//                     >
//                       <RefreshCw size={16} className={isChecking ? "animate-spin" : ""} />
//                     </button>
//                   </div>
//                 </div>
                
              
                
//                 {/* Upload Status */}
//                 {isChecking && !receivedImage && (
//                   <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
//                     <p className="text-blue-300 text-xs flex items-center gap-2">
//                       <div className="size-2 rounded-full bg-blue-500 animate-pulse"></div>
//                       Checking for uploads every 2 seconds...
//                     </p>
//                   </div>
//                 )}
//               </Box>

//               {/* Instructions */}
//               <Box className="bg-white/5 rounded-lg p-3 border border-white/10">
//                 <h3 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
//                   <Smartphone size={14} />
//                   How to upload:
//                 </h3>
//                 <ol className="text-white/70 text-xs space-y-2">
//                   <li className="flex items-start gap-2">
//                     <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">1</span>
//                     <span>Open your phone camera and scan the QR code above</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">2</span>
//                     <span>Tap the link that appears on your phone screen</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">3</span>
//                     <span>Select an image from your phone gallery or take a photo</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">4</span>
//                     <span>Tap "Upload" - the image will appear here automatically</span>
//                   </li>
//                 </ol>
//               </Box>
//             </Box>
//           )}

//           {/* Received Image Display */}
//           {receivedImage && (
//             <Box className="w-full space-y-3 sm:space-y-4 px-2 sm:px-0 animate-in fade-in">
//               <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
//                 <div className="flex items-center justify-center gap-2">
//                   <ImageIcon size={16} className="text-green-400" />
//                   <p className="text-green-300 text-sm font-medium">
//                     ✅ Image received successfully!
//                   </p>
//                 </div>
//                 <p className="text-green-300/70 text-xs text-center mt-1">
//                   Code: {qrCodeData?.code}
//                 </p>
//               </div>
              
//               <Box className="bg-white/5 rounded-lg border border-white/20 overflow-hidden">
//                 <img 
//                   src={receivedImage} 
//                   alt="Uploaded" 
//                   className="w-full h-32 sm:h-40 object-cover"
//                   onError={(e) => {
//                     console.error('Image failed to load');
//                     e.currentTarget.src = 'https://via.placeholder.com/400x300/2d2d6d/ffffff?text=Image+Uploaded';
//                   }}
//                 />
//                 <div className="p-3 bg-black/30">
//                   <p className="text-white text-sm">Image uploaded from phone</p>
//                   <p className="text-white/60 text-xs mt-1">
//                     Ready for processing
//                   </p>
//                 </div>
//               </Box>

//               {/* Next Button */}
//               {showNext && (
//                 <CustomButton
//                   wrapperClassName="w-full h-10 sm:h-12"
//                   title="Continue to Next Step"
//                   icon={<ArrowRight size={18} />}
//                   onClick={handleNext}
//                 />
//               )}
//             </Box>
//           )}

//           {/* Status Message */}
//           {qrCodeData && !receivedImage && (
//             <div className="w-full space-y-3 px-2 sm:px-0">
//               <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
//                 <p className="text-blue-300 text-xs sm:text-sm text-center">
//                   {isChecking ? "🔄 Checking for uploads..." : "⏳ Waiting for image upload..."}
//                 </p>
//                 <p className="text-blue-300/70 text-[10px] sm:text-xs text-center mt-1">
//                   Auto-refreshing every 2 seconds
//                 </p>
//               </div>
              
              
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-2 w-full px-2 sm:px-0">
            
            
//             {receivedImage && (
//               <>
//                 <button
//                   onClick={resetAll}
//                   className="flex-1 py-2 rounded-lg border border-white/20 bg-white/5 text-white text-xs sm:text-sm hover:bg-white/10 transition-colors"
//                 >
//                   Upload Another
//                 </button>
               
//               </>
//             )}
//           </div>

         
//         </Stack>
//       </Center>
//     </Box>
//   );
// };

// export default QRUploadPage;


import { useState, useRef, useEffect } from "react";
import CustomButton from "@/components/common/customButton";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { useNavigate } from "react-router";
import { Flex } from "@/components/ui/flex";
import { Stack } from "@/components/ui/stack";
import { QrCode, Image as ImageIcon, ArrowRight, Copy, Smartphone, RefreshCw, ExternalLink} from "lucide-react";
import GoBackButton from "../components/horizontalnavbar/horizontalnavbar.tsx";
import { HorizontalNavbar } from "../components/horizontalnavbar/horizontalnavbar.tsx";

// Debug Info Interface
interface DebugInfo {
  backend?: string;
  url?: string;
  timestamp?: string;
  qrGenerated?: boolean;
  qrCode?: string;
  uploadUrl?: string;
  error?: string;
  errorType?: string;
  response?: any;
}

// Backend API Configuration
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isDevelopment 
  ? "http://localhost:5000/api/v1"
  : "https://kiosk-ai-be-production.up.railway.app/api/v1";

interface QRCodeData {
  code: string;
  qrImageUrl: string;
  uploadUrl: string;
  expiresAt: string;
  createdAt: string;
}

// Helper function for fetch with CORS handling
const fetchWithCors = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const defaultOptions: RequestInit = {
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };
  
  return fetch(url, { ...defaultOptions, ...options });
};

const QRUploadPage = () => {
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [receivedImage, setReceivedImage] = useState<string | null>(null);
  const [showNext, setShowNext] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
    
    // Cleanup on component unmount
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  const checkBackendHealth = async () => {
    try {
      console.log('🔍 Checking backend health at:', `${API_BASE_URL}/health`);
      
      const response = await fetchWithCors(`${API_BASE_URL}/health`);
      
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Backend health response:', data);
      
      if (response.ok) {
        setBackendStatus('connected');
        setDebugInfo({
          backend: 'connected',
          url: API_BASE_URL,
          timestamp: new Date().toISOString(),
          response: data
        });
        setError(null);
      } else {
        setBackendStatus('error');
        setError(`Backend error: ${data.message || response.status}`);
      }
    } catch (err: any) {
      console.error('❌ Backend health check failed:', err);
      setBackendStatus('error');
      setError(`Cannot connect to backend: ${err.message}`);
      
      // Log more details
      setDebugInfo((prev: DebugInfo | null) => ({
        ...prev,
        error: err.message,
        errorType: err.name,
        timestamp: new Date().toISOString()
      }));
    }
  };

  // Generate QR code from backend
  const generateQRCode = async () => {
    setIsGenerating(true);
    setError(null);
    setQrCodeData(null);
    setReceivedImage(null);
    
    try {
      console.log('📡 Generating QR code from backend...');
      
      const response = await fetchWithCors(`${API_BASE_URL}/qr/generate`, {
        method: 'POST',
      });
      
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (data.success && data.data) {
        console.log('✅ QR Code generated successfully');
        console.log('📱 Upload URL:', data.data.uploadUrl);
        
        setQrCodeData(data.data);
        
        // Start checking for uploads
        startCheckingForUploads(data.data.code);
        
        setDebugInfo((prev: DebugInfo | null) => ({
          ...prev,
          qrGenerated: true,
          qrCode: data.data.code,
          uploadUrl: data.data.uploadUrl,
          timestamp: new Date().toISOString()
        }));
      } else {
        throw new Error(data.message || 'Invalid response from server');
      }
    } catch (error: any) {
      console.error('❌ Error generating QR code:', error);
      setError(`Failed to generate QR code: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Start checking for uploaded images every 2 seconds
  const startCheckingForUploads = (code: string) => {
    // Clear any existing interval
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    
    setIsChecking(true);
    
    // Check immediately
    checkForUploadFromBackend(code);
    
    // Set up interval to check every 2 seconds
    checkIntervalRef.current = setInterval(() => {
      checkForUploadFromBackend(code);
    }, 2000);
  };

  // Check if image was uploaded to backend
  const checkForUploadFromBackend = async (code: string) => {
    try {
      const response = await fetchWithCors(`${API_BASE_URL}/upload/check/${code}`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.exists) {
        // Image found!
        const imageUrl = `${API_BASE_URL}/upload/image/${code}`;
        console.log('🖼️ Image found:', imageUrl);
        
        setReceivedImage(imageUrl);
        setShowNext(true);
        setIsChecking(false);
        
        // Clear the interval
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      }
    } catch (error) {
      console.error("Error checking upload:", error);
    }
  };

  // Manual check button
  const manualCheck = async () => {
    if (qrCodeData?.code) {
      setIsChecking(true);
      await checkForUploadFromBackend(qrCodeData.code);
      setIsChecking(false);
    }
  };

  // Copy code to clipboard
  const copyCode = () => {
    if (qrCodeData?.code) {
      navigator.clipboard.writeText(qrCodeData.code);
      alert("Code copied to clipboard!");
    }
  };

  // Copy upload URL to clipboard
  const copyUploadUrl = () => {
    if (qrCodeData?.uploadUrl) {
      navigator.clipboard.writeText(qrCodeData.uploadUrl);
      alert("Upload URL copied to clipboard!");
    }
  };

  // Open upload URL in new tab
  const openUploadPage = () => {
    if (qrCodeData?.uploadUrl) {
      window.open(qrCodeData.uploadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // // Test upload URL
  // const testUploadUrl = () => {
  //   if (qrCodeData?.uploadUrl) {
  //     const testWindow = window.open('', '_blank');
  //     if (testWindow) {
  //       testWindow.document.write(`
  //         <html>
  //           <head><title>Test Upload URL</title></head>
  //           <body style="padding: 20px; font-family: Arial;">
  //             <h1>Upload URL Test</h1>
  //             <p>URL: ${qrCodeData.uploadUrl}</p>
  //             <p>Code: ${qrCodeData.code}</p>
  //             <button onclick="window.location.href='${qrCodeData.uploadUrl}'" 
  //                     style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
  //               Open Upload Page
  //             </button>
  //           </body>
  //         </html>
  //       `);
  //       testWindow.document.close();
  //     }
  //   }
  // };

  // Proceed to next step
  const handleNext = () => {
    if (receivedImage && qrCodeData) {
      navigate(`/process-image?code=${qrCodeData.code}`);
    }
  };

  // Reset everything
  const resetAll = () => {
    // Clear interval
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    
    // Reset state
    setQrCodeData(null);
    setReceivedImage(null);
    setShowNext(false);
    setIsChecking(false);
    setError(null);
  };

  // Handle back navigation
  const handleGoBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/select-methods"); 
  };

  // // Test backend connection
  // const testBackend = async () => {
  //   try {
  //     const response = await fetchWithCors(`${API_BASE_URL}/health`);
  //     const data = await response.json();
  //     alert(`✅ Backend is running!\nStatus: ${data.status}\nTime: ${data.timestamp}`);
  //   } catch (err: any) {
  //     alert(`❌ Backend test failed: ${err.message}`);
  //   }
  // };

  // Test direct fetch
  const testDirectFetch = async () => {
    try {
      console.log('Testing direct fetch to:', API_BASE_URL);
      const test = await fetch(`${API_BASE_URL}/health`);
      console.log('Test fetch result:', test);
      const text = await test.text();
      console.log('Response text:', text);
      
      alert(`Response: ${text}`);
    } catch (err: any) {
      console.error('Fetch error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat p-4 relative overflow-x-hidden">
      {/* Horizontal Navbar */}
      <HorizontalNavbar />
      
      {/* Back Button */}
      <Box className="absolute top-8 xl:top-10 2xl:top-12 left-4 sm:left-6 md:left-8 lg:left-10 xl:left-32 2xl:left-40 z-50">
        <GoBackButton onClick={handleGoBack} />
      </Box>

      {/* Custom Navbar for QR Upload Page */}
      <Box className="absolute flex items-center justify-center w-full top-8 xl:top-10 2xl:top-12 z-40 px-4">
        <Stack className="z-20 justify-center items-center p-0 gap-0 xl:gap-1 2xl:gap-2 max-w-full">
          <Flex className="font-bold flex-col sm:flex-row items-center text-center">
            <h1 className="bg-[linear-gradient(0deg,#E5E5E1_90%,#E5E5E5_100%)] bg-clip-text text-transparent tracking-wide text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
              Upload from your
            </h1>
            <span className="text-[#F70353] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl ml-0 sm:ml-2 xl:ml-3 2xl:ml-4">
              PHONE
            </span>
          </Flex>
          <p
            className="text-[#FFFFFF]/80 font-light p-0 text-center"
            style={{
              letterSpacing: "1.6px",
              fontSize: "11px",
              userSelect: "none",
            }}
          >
            Scan QR code to upload images from your phone
          </p>
        </Stack>
      </Box>

      <Center className="h-full mt-20 pt-28 sm:pt-32 md:pt-36 overflow-y-auto"> 
        <Stack className="w-full max-w-md items-center gap-4 sm:gap-6 px-2 sm:px-4">
          {/* Logo/Icon */}
          <Center className="relative mb-2">
            <Box
              className="absolute rounded-full"
              style={{
                width: "100px",
                height: "100px",
                background: "rgba(226, 2, 255, 0.15)",
                filter: "blur(30px)",
              }}
            />
            <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-white/10">
              <Smartphone className="size-8 sm:size-10 md:size-12 text-purple-400" />
            </div>
          </Center>

          {/* Debug/Connection Status Section */}
          <div className="w-full space-y-2 px-2 sm:px-0">
            <div className="p-3 bg-white/5 rounded border border-white/10">
              <p className="text-white text-sm font-medium">Backend Status:</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`size-2 rounded-full ${
                  backendStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                  backendStatus === 'error' ? 'bg-red-500' :
                  'bg-yellow-500 animate-pulse'
                }`} />
                <span className={`text-xs ${
                  backendStatus === 'connected' ? 'text-green-300' :
                  backendStatus === 'error' ? 'text-red-300' :
                  'text-yellow-300'
                }`}>
                  {backendStatus === 'connected' ? 'Connected' :
                   backendStatus === 'error' ? 'Error' :
                   'Checking...'}
                </span>
              </div>
              
              {error && (
                <p className="text-red-300 text-xs mt-2 break-words">{error}</p>
              )}
              
              <p className="text-white/60 text-xs mt-2 break-all">
                URL: {API_BASE_URL}
              </p>
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={async () => {
                    console.log('Testing connection...');
                    await checkBackendHealth();
                  }}
                  className="flex-1 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30 transition-colors"
                >
                  Test Connection
                </button>
                <button
                  onClick={testDirectFetch}
                  className="flex-1 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded text-xs hover:bg-purple-500/30 transition-colors"
                >
                  Direct Test
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          {!qrCodeData ? (
            // Initial state - Show generate button
            <Box className="w-full mt-2 px-2 sm:px-0">
              <CustomButton
                wrapperClassName="w-full h-10 sm:h-12"
                title={isGenerating ? "Generating QR Code..." : "Generate QR Code"}
                icon={isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <QrCode size={18} />}
                onClick={generateQRCode}
                disabled={isGenerating || backendStatus !== 'connected'}
              />
              <p className="text-white/60 text-xs text-center mt-2">
                {backendStatus !== 'connected' 
                  ? "Waiting for backend connection..."
                  : "Click to generate a unique QR code for mobile upload"}
              </p>
            </Box>
          ) : (
            // QR Code generated state
            <Box className="w-full space-y-3 sm:space-y-4 px-2 sm:px-0">
              {/* QR Code Display */}
              <Center className="p-3 sm:p-4 bg-white rounded-lg relative">
                {qrCodeData.qrImageUrl ? (
                  <img 
                    src={qrCodeData.qrImageUrl} 
                    alt="Scan this QR code" 
                    className="w-48 h-48 sm:w-56 sm:h-56"
                    onError={(e) => {
                      console.error('QR Code failed to load');
                      e.currentTarget.src = 'https://via.placeholder.com/300/2d2d6d/ffffff?text=QR+Code';
                    }}
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-gray-100 rounded">
                    <p className="text-gray-500 text-sm">QR Code loading...</p>
                  </div>
                )}
              </Center>

              {/* Connection Code & Status */}
              <Box className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="overflow-hidden">
                    <p className="text-white/60 text-xs">Connection Code:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-white text-base sm:text-lg font-mono truncate">
                        {qrCodeData.code}
                      </code>
                      <span className="text-xs bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-white/40 text-xs mt-1">
                      Expires: {new Date(qrCodeData.expiresAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyCode}
                      className="text-white/60 hover:text-white p-1 transition-colors"
                      title="Copy code"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={manualCheck}
                      className="text-white/60 hover:text-white p-1 transition-colors"
                      title="Check for uploads"
                    >
                      <RefreshCw size={16} className={isChecking ? "animate-spin" : ""} />
                    </button>
                  </div>
                </div>
                
                {/* Upload URL */}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-white/60 text-xs">Upload URL:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-white text-xs font-mono truncate flex-1">
                      {qrCodeData.uploadUrl}
                    </code>
                    <div className="flex gap-1">
                      <button
                        onClick={copyUploadUrl}
                        className="text-white/60 hover:text-white p-1 transition-colors"
                        title="Copy URL"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={openUploadPage}
                        className="text-white/60 hover:text-white p-1 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Upload Status */}
                {isChecking && !receivedImage && (
                  <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                    <p className="text-blue-300 text-xs flex items-center gap-2">
                      <div className="size-2 rounded-full bg-blue-500 animate-pulse"></div>
                      Checking for uploads every 2 seconds...
                    </p>
                  </div>
                )}
              </Box>

              {/* Instructions */}
              <Box className="bg-white/5 rounded-lg p-3 border border-white/10">
                <h3 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Smartphone size={14} />
                  How to upload:
                </h3>
                <ol className="text-white/70 text-xs space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">1</span>
                    <span>Open your phone camera and scan the QR code above</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">2</span>
                    <span>Tap the link that appears on your phone screen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">3</span>
                    <span>Select an image from your phone gallery or take a photo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">4</span>
                    <span>Tap "Upload" - the image will appear here automatically</span>
                  </li>
                </ol>
              </Box>
            </Box>
          )}

          {/* Received Image Display */}
          {receivedImage && (
            <Box className="w-full space-y-3 sm:space-y-4 px-2 sm:px-0 animate-in fade-in">
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <ImageIcon size={16} className="text-green-400" />
                  <p className="text-green-300 text-sm font-medium">
                    ✅ Image received successfully!
                  </p>
                </div>
                <p className="text-green-300/70 text-xs text-center mt-1">
                  Code: {qrCodeData?.code}
                </p>
              </div>
              
              <Box className="bg-white/5 rounded-lg border border-white/20 overflow-hidden">
                <img 
                  src={receivedImage} 
                  alt="Uploaded" 
                  className="w-full h-32 sm:h-40 object-cover"
                  onError={(e) => {
                    console.error('Image failed to load');
                    e.currentTarget.src = 'https://via.placeholder.com/400x300/2d2d6d/ffffff?text=Image+Uploaded';
                  }}
                />
                <div className="p-3 bg-black/30">
                  <p className="text-white text-sm">Image uploaded from phone</p>
                  <p className="text-white/60 text-xs mt-1">
                    Ready for processing
                  </p>
                </div>
              </Box>

              {/* Next Button */}
              {showNext && (
                <CustomButton
                  wrapperClassName="w-full h-10 sm:h-12"
                  title="Continue to Next Step"
                  icon={<ArrowRight size={18} />}
                  onClick={handleNext}
                />
              )}
            </Box>
          )}

          {/* Status Message */}
          {qrCodeData && !receivedImage && (
            <div className="w-full space-y-3 px-2 sm:px-0">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-xs sm:text-sm text-center">
                  {isChecking ? "🔄 Checking for uploads..." : "⏳ Waiting for image upload..."}
                </p>
                <p className="text-blue-300/70 text-[10px] sm:text-xs text-center mt-1">
                  Auto-refreshing every 2 seconds
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 w-full px-2 sm:px-0">
            {qrCodeData && !receivedImage && (
              <button
                onClick={resetAll}
                className="flex-1 py-2 rounded-lg border border-white/20 bg-white/5 text-white text-xs sm:text-sm hover:bg-white/10 transition-colors"
              >
                Cancel & Reset
              </button>
            )}
            
            {receivedImage && (
              <>
                <button
                  onClick={resetAll}
                  className="flex-1 py-2 rounded-lg border border-white/20 bg-white/5 text-white text-xs sm:text-sm hover:bg-white/10 transition-colors"
                >
                  Upload Another
                </button>
              </>
            )}
          </div>

          {/* Debug Info (hidden by default, can be toggled) */}
          {debugInfo && (
            <details className="w-full text-xs">
              <summary className="text-white/50 cursor-pointer">Debug Info</summary>
              <pre className="mt-2 p-2 bg-black/30 rounded text-white/70 overflow-auto max-h-40">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}
        </Stack>
      </Center>
    </Box>
  );
};

export default QRUploadPage;