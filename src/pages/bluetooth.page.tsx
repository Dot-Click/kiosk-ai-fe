// import CustomButton from "@/components/common/customButton";
// import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { BluetoothIcon } from "lucide-react";

// declare global {
//   interface Navigator {
//     bluetooth?: Bluetooth;
//   }
// }

// interface Bluetooth {
//   requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
// }

// interface RequestDeviceOptions {
//   acceptAllDevices?: boolean;
//   filters?: BluetoothLEScanFilterInit[];
//   optionalServices?: string[];
// }

// interface BluetoothLEScanFilterInit {
//   namePrefix?: string;
//   services?: string[];
// }

// interface BluetoothDevice {
//   name: string;
//   gatt?: BluetoothRemoteGATTServer;
// }

// interface BluetoothRemoteGATTServer {
//   connect(): Promise<BluetoothRemoteGATTServer>;
// }

// const BluetoothPage = () => {
//   const handleConnectBluetooth = async () => {
//     try {
//       // First check if Web Bluetooth is available
//       if (!navigator.bluetooth) {
//         alert(
//           "Your browser doesn't support Web Bluetooth. Please use Chrome or Edge."
//         );
//         return;
//       }

//       // Request a device — acceptAllDevices: true shows all nearby BLE devices
//       const device = await navigator.bluetooth.requestDevice({
//         acceptAllDevices: true,
//         // If you want to filter for specific devices, use this instead:
//         // filters: [{ namePrefix: "YourDeviceName" }],
//         // optionalServices: ['battery_service'] // e.g., for battery level
//       });

//       console.log("Connected device name:", device.name);

//       // Connect to the GATT server
//       const server = await device.gatt?.connect();

//       if (server) {
//         alert(`Successfully connected to: ${device.name}`);
//         console.log("GATT Server connected:", server);
//         // From here you can access services, characteristics, read/write data, etc.
//       }
//     } catch (error) {
//       console.error("Bluetooth error:", error);
//       alert("Connection failed: " + (error as Error).message);
//     }
//   };

//   return (
//     <Box className="h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat flex items-center justify-center p-4">
//       <Stack className="w-full max-w-[650px] max-sm:size-[90%] items-center justify-center gap-8">
//         {/* Bluetooth Icon with Glow - Centered */}
//         <Center
//           className="w-full h-[200px] max-sm:h-[150px] relative flex items-center justify-center mt-12"
//           style={{ userSelect: "none" }}
//         >
//           {/* Glow Effect */}
//           <Box
//             className="absolute top-18 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
//             style={{
//               width: "197.74px",
//               height: "197.74px",
//               background: "rgba(226, 2, 255, 0.22)",
//               filter: "blur(64.6563px)",
//             }}
//           />
//           <img
//             src="/general/onlybluetooth.svg"
//             alt="bluetooth"
//             className="size-46 object-cover relative z-10"
//           />
//         </Center>

//         {/* Instructions Section - No Background */}
//         <Stack className="w-lg max-w-[470px] max-sm:w-full items-center justify-center border-2 border-white/10 rounded-2xl p-0">
//           <Stack className="gap-2.5 items-start w-full p-4">
//             <h1 className="text-[#F70353] text-xl lg:text-[2.15rem] xl:text-[1.30rem] p-0 text-center">
//               Instructions:
//             </h1>
//             <p className="text-white/80 text-xs font-extralight tracking-widest uppercase text-center">
//               1. Enable Bluetooth on your phone.
//             </p>
//             <p className="text-white/80 text-xs font-extralight tracking-widest uppercase text-center">
//               2: Tap the button below to start pairing.
//             </p>
//             <p className="text-white/80 text-xs font-extralight tracking-widest uppercase text-center">
//               3. Select "Kiosk AI" from your phone's Bluetooth devices
//             </p>
//             <p className="text-xs font-extralight tracking-widest uppercase bg-gradient-to-b from-white to-white/16 bg-clip-text text-transparent text-center">
//               4. Choose an image from your gallery to send
//             </p>
//           </Stack>
//         </Stack>

//         {/* Button - Centered */}
//         <CustomButton
//           wrapperClassName="w-[188px] h-[48px]"
//           title="Connect via Bluetooth"
//           icon={<BluetoothIcon />}
//           onClick={handleConnectBluetooth}
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default BluetoothPage;






// import { useState, useEffect, useRef } from "react";
// import CustomButton from "@/components/common/customButton";
// import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { 
//   QrCode, 
//   Download, 
//   Camera,
//   Image as ImageIcon,
//   Copy,
//   CheckCircle,
//   Smartphone,
//   Upload,
//   Wifi,
//   X,
//   Zap,
//   AlertCircle,
//   RefreshCw
// } from "lucide-react";

// // YOUR LOCAL IP ADDRESS (Replace if changes)
// const LOCAL_IP = "192.168.18.19";
// const PORT = 3000; // Change to your actual port

// const MobileToWebTransfer = () => {
//   const [status, setStatus] = useState<'ready' | 'waiting' | 'connected' | 'receiving' | 'complete'>('ready');
//   const [progress, setProgress] = useState(0);
//   const [receivedImage, setReceivedImage] = useState<string | null>(null);
//   const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
//   const [connectionCode, setConnectionCode] = useState<string>('');
//   const [sessionId, setSessionId] = useState<string>('');
//   const [logs, setLogs] = useState<string[]>([]);
//   const [mobileConnected, setMobileConnected] = useState(false);
  
//   const wsRef = useRef<WebSocket | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   // Add log
//   const addLog = (msg: string) => {
//     const time = new Date().toLocaleTimeString();
//     setLogs(prev => [`${time}: ${msg}`, ...prev.slice(0, 10)]);
//     console.log(msg);
//   };

//   // Generate QR code for mobile
//   const generateQRCode = () => {
//     try {
//       // Generate unique IDs
//       const session = `web-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
//       const code = Math.floor(100000 + Math.random() * 900000).toString();
      
//       setSessionId(session);
//       setConnectionCode(code);
//       setStatus('waiting');
//       setReceivedImage(null);
//       setProgress(0);
//       setMobileConnected(false);
      
//       // Create mobile page URL using YOUR LOCAL IP
//       const mobilePageUrl = `http://${LOCAL_IP}:${PORT}/mobile-upload?session=${session}&code=${code}`;
      
//       // Create simple QR code with URL
//       const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&data=${encodeURIComponent(mobilePageUrl)}&color=2d2d6d&bgcolor=ffffff`;
//       setQrCodeUrl(qrImageUrl);
      
//       addLog(`✅ QR Code Generated`);
//       addLog(`📱 Mobile URL: ${mobilePageUrl}`);
//       addLog(`🔢 Code: ${code}`);
//       addLog(`⏳ Waiting for mobile connection...`);
      
//       // Start polling for uploaded images
//       startPolling(session, code);
      
//     } catch (error) {
//       addLog(`❌ Error: ${error}`);
//     }
//   };

//   // Poll server for uploaded images (simple HTTP polling)
//   const startPolling = (session: string, code: string) => {
//     if (pollIntervalRef.current) {
//       clearInterval(pollIntervalRef.current);
//     }
    
//     pollIntervalRef.current = setInterval(async () => {
//       try {
//         // In a real app, this would check your backend API
//         // For now, we'll simulate with localStorage
//         const key = `image_upload_${session}_${code}`;
//         const uploadedData = localStorage.getItem(key);
        
//         if (uploadedData) {
//           const data = JSON.parse(uploadedData);
          
//           if (data.status === 'uploaded' && data.imageData) {
//             // Image received!
//             setMobileConnected(true);
//             setStatus('receiving');
//             setProgress(50);
            
//             addLog(`📸 Mobile uploaded image: ${data.fileName}`);
            
//             // Simulate processing
//             setTimeout(() => {
//               const imageUrl = data.imageData;
//               setReceivedImage(imageUrl);
//               setStatus('complete');
//               setProgress(100);
//               addLog(`✅ Image received and processed`);
              
//               // Clear from storage
//               localStorage.removeItem(key);
              
//               // Stop polling
//               if (pollIntervalRef.current) {
//                 clearInterval(pollIntervalRef.current);
//                 pollIntervalRef.current = null;
//               }
//             }, 1500);
//           }
//         }
//       } catch (error) {
//         console.error("Polling error:", error);
//       }
//     }, 2000); // Poll every 2 seconds
//   };

//   // Simulate WebSocket connection (for demo)
//   const simulateWebSocket = () => {
//     addLog("🔗 Simulating connection...");
    
//     setTimeout(() => {
//       setMobileConnected(true);
//       setStatus('connected');
//       addLog("📱 Mobile connected (simulated)");
//     }, 1000);
//   };

//   // Handle file upload from website (for testing)
//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
    
//     if (!file.type.startsWith('image/')) {
//       addLog("Please select an image file");
//       return;
//     }
    
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const imageUrl = e.target?.result as string;
//       setReceivedImage(imageUrl);
//       setStatus('complete');
//       addLog("✅ Image uploaded from computer");
//     };
//     reader.readAsDataURL(file);
//   };

//   // Save image
//   const saveImage = () => {
//     if (!receivedImage) return;
    
//     const link = document.createElement('a');
//     link.href = receivedImage;
//     link.download = `web-received-${Date.now()}.jpg`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     addLog("💾 Image saved to device");
//   };

//   // Copy connection code
//   const copyCode = () => {
//     navigator.clipboard.writeText(connectionCode);
//     addLog("📋 Code copied to clipboard");
//   };

//   // Copy mobile URL
//   const copyMobileUrl = () => {
//     const mobileUrl = `http://${LOCAL_IP}:${PORT}/mobile-upload?session=${sessionId}&code=${connectionCode}`;
//     navigator.clipboard.writeText(mobileUrl);
//     addLog("📋 Mobile URL copied");
//   };

//   // Reset
//   const reset = () => {
//     if (pollIntervalRef.current) {
//       clearInterval(pollIntervalRef.current);
//       pollIntervalRef.current = null;
//     }
    
//     setStatus('ready');
//     setProgress(0);
//     setReceivedImage(null);
//     setQrCodeUrl('');
//     setConnectionCode('');
//     setMobileConnected(false);
//     addLog("🔄 Session reset");
//   };

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (pollIntervalRef.current) {
//         clearInterval(pollIntervalRef.current);
//       }
//     };
//   }, []);

//   return (
//     <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat p-4">
//       <Stack className="w-full max-w-6xl mx-auto gap-8 py-8">
        
//         {/* Header */}
//         <Center className="flex-col gap-4">
//           <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10">
//             <div className="relative">
//               <Smartphone className="size-20 text-purple-400" />
//               <Upload className="size-10 text-pink-400 absolute -top-2 -right-2" />
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-white">Mobile to Web Image Transfer</h1>
//           <p className="text-white/60 text-lg">Local Testing Mode</p>
//           <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/30">
//             <Wifi className="size-4 text-blue-400" />
//             <span className="text-blue-300 text-sm">Local IP: {LOCAL_IP}</span>
//           </div>
//         </Center>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left: QR Code */}
//           <Box className="bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm rounded-2xl p-8 border border-white/10">
//             <Stack className="gap-8">
//               <div>
//                 <h2 className="text-2xl font-bold text-white mb-2">Step 1: Generate QR Code</h2>
//                 <p className="text-white/60">Create QR code for mobile to scan</p>
//               </div>
              
//               {qrCodeUrl ? (
//                 <Center className="flex-col gap-6">
//                   <div className="p-4 bg-white rounded-xl">
//                     <img src={qrCodeUrl} alt="Scan with phone" className="w-64 h-64" />
//                   </div>
                  
//                   <div className="text-center space-y-4">
//                     <div className="flex items-center justify-center gap-3">
//                       <span className="text-white/60">Connection Code:</span>
//                       <code className="bg-white/10 px-4 py-2 rounded-lg text-white font-mono">
//                         {connectionCode}
//                       </code>
//                       <button
//                         onClick={copyCode}
//                         className="text-white/60 hover:text-white"
//                         title="Copy code"
//                       >
//                         <Copy className="size-5" />
//                       </button>
//                     </div>
                    
//                     <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
//                       <p className="text-blue-300 text-sm">
//                         📱 On Mobile: Open browser and visit:
//                       </p>
//                       <p className="text-white text-xs mt-1 break-all">
//                         http://{LOCAL_IP}:{PORT}/mobile-upload
//                       </p>
//                       <button
//                         onClick={copyMobileUrl}
//                         className="text-blue-400 hover:text-blue-300 text-xs mt-2 flex items-center gap-1"
//                       >
//                         <Copy className="size-3" />
//                         Copy Mobile URL
//                       </button>
//                     </div>
                    
//                     {status === 'waiting' && (
//                       <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
//                         <p className="text-yellow-300 text-sm">
//                           ⏳ Waiting for mobile connection...
//                         </p>
//                       </div>
//                     )}
                    
//                     {mobileConnected && (
//                       <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
//                         <p className="text-green-300 text-sm flex items-center gap-2">
//                           <CheckCircle className="size-4" />
//                           ✅ Mobile connected!
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </Center>
//               ) : (
//                 <Center className="py-12">
//                   <div className="text-center space-y-6">
//                     <div className="p-10 bg-white/5 rounded-2xl border-2 border-dashed border-white/20 inline-block">
//                       <QrCode className="size-24 text-white/30" />
//                     </div>
//                     <p className="text-white/60">QR code will appear here</p>
//                   </div>
//                 </Center>
//               )}
              
//               <div className="flex gap-4">
//                 <CustomButton
//                   wrapperClassName="flex-1"
//                   title={qrCodeUrl ? "Generate New Code" : "Generate QR Code"}
//                   icon={<QrCode className="size-5" />}
//                   onClick={generateQRCode}
//                   size="lg"
//                 />
//                 {qrCodeUrl && (
//                   <CustomButton
//                     wrapperClassName="w-32"
//                     title="Reset"
//                     variant="outline"
//                     onClick={reset}
//                   />
//                 )}
//               </div>
              
//               {/* Test Upload (for development) */}
//               <div className="pt-4 border-t border-white/10">
//                 <p className="text-white/60 text-sm mb-3">Developer Test:</p>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleFileUpload}
//                 />
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="w-full py-3 rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors"
//                 >
//                   Test: Upload Image from Computer
//                 </button>
//               </div>
//             </Stack>
//           </Box>

//           {/* Right: Image Preview */}
//           <Box className="bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm rounded-2xl p-8 border border-white/10">
//             <Stack className="gap-8">
//               <div>
//                 <h2 className="text-2xl font-bold text-white mb-2">Step 2: Receive & Process Image</h2>
//                 <p className="text-white/60">Images will appear here automatically</p>
//               </div>
              
//               {/* Progress */}
//               {progress > 0 && (
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-white">
//                       {status === 'receiving' ? 'Receiving...' : 'Complete!'} {progress}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-800 rounded-full h-3">
//                     <div 
//                       className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
//                       style={{ width: `${progress}%` }}
//                     />
//                   </div>
//                 </div>
//               )}
              
//               {/* Image Display */}
//               <div className="flex-1 flex items-center justify-center min-h-[400px]">
//                 {receivedImage ? (
//                   <div className="w-full space-y-6">
//                     <div className="relative">
//                       <img 
//                         src={receivedImage} 
//                         alt="Received from mobile" 
//                         className="w-full max-h-96 object-contain rounded-xl border-2 border-white/20 bg-black/50"
//                       />
//                       <div className="absolute top-4 right-4 bg-green-500/80 text-white text-xs px-3 py-1 rounded-full">
//                         Received ✓
//                       </div>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                       <CustomButton
//                         title="Save Image"
//                         icon={<Download className="size-5" />}
//                         onClick={saveImage}
//                       />
//                       <CustomButton
//                         title="Process Image"
//                         icon={<Zap className="size-5" />}
//                         variant="outline"
//                         onClick={() => {
//                           addLog("🔄 Running image processing...");
//                           // Your custom processing logic here
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center space-y-6">
//                     <div className="p-10 bg-white/5 rounded-2xl border-2 border-dashed border-white/20 inline-block">
//                       <ImageIcon className="size-24 text-white/30" />
//                     </div>
//                     <div>
//                       <p className="text-white/60 mb-2">
//                         {status === 'connected' 
//                           ? 'Ready to receive image from mobile...' 
//                           : 'No image received yet'}
//                       </p>
//                       {status === 'connected' && (
//                         <p className="text-white/40 text-sm">
//                           Ask user to select image on their phone
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {/* Mobile Instructions */}
//               <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
//                 <h3 className="text-white font-medium mb-3 flex items-center gap-2">
//                   <Camera className="size-5" />
//                   Testing Instructions:
//                 </h3>
//                 <ol className="space-y-2 text-sm text-white/80 pl-5">
//                   <li><strong>On Phone:</strong> Open browser</li>
//                   <li><strong>Visit:</strong> http://192.168.18.19:3000/mobile-upload</li>
//                   <li>Enter code: {connectionCode || "[Code will appear]"}</li>
//                   <li>Select image and upload</li>
//                   <li>Image appears here automatically</li>
//                 </ol>
//               </div>
//             </Stack>
//           </Box>
//         </div>

//         {/* Connection Status */}
//         <Box className="bg-white/5 rounded-2xl p-6 border border-white/10">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="flex items-center gap-3">
//               <div className={`w-3 h-3 rounded-full ${
//                 status === 'ready' ? 'bg-gray-500' :
//                 status === 'waiting' ? 'bg-yellow-500 animate-pulse' :
//                 status === 'connected' ? 'bg-green-500' :
//                 status === 'receiving' ? 'bg-blue-500 animate-pulse' :
//                 'bg-purple-500'
//               }`} />
//               <div>
//                 <p className="text-white font-medium">Status: {status.toUpperCase()}</p>
//                 <p className="text-white/60 text-sm">
//                   {status === 'ready' && 'Ready to generate QR code'}
//                   {status === 'waiting' && 'Waiting for mobile connection'}
//                   {status === 'connected' && 'Mobile connected'}
//                   {status === 'receiving' && 'Receiving image'}
//                   {status === 'complete' && 'Image received & processed'}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Wifi className={`size-5 ${mobileConnected ? 'text-green-500' : 'text-gray-500'}`} />
//               <div>
//                 <p className="text-white font-medium">Mobile Connection</p>
//                 <p className="text-white/60 text-sm">
//                   {mobileConnected ? 'Connected' : 'Not connected'}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Globe className="size-5 text-blue-500" />
//               <div>
//                 <p className="text-white font-medium">Local Network</p>
//                 <p className="text-white/60 text-sm">IP: {LOCAL_IP}</p>
//               </div>
//             </div>
//           </div>
//         </Box>

//         {/* Connection Logs */}
//         <Box className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-white font-medium flex items-center gap-2">
//               <Wifi className="size-5" />
//               Activity Log
//             </h3>
//             <span className="text-white/60 text-sm bg-white/10 px-3 py-1 rounded-full">
//               {logs.length} events
//             </span>
//           </div>
          
//           <div className="max-h-60 overflow-y-auto space-y-2">
//             {logs.length === 0 ? (
//               <p className="text-white/40 text-center p-4">No activity yet</p>
//             ) : (
//               logs.map((log, index) => (
//                 <div key={index} className="text-white/60 text-xs p-3 hover:bg-white/5 rounded-lg font-mono">
//                   {log}
//                 </div>
//               ))
//             )}
//           </div>
//         </Box>
//       </Stack>
//     </Box>
//   );
// };

// export default MobileToWebTransfer;


import { useState, useEffect, useRef } from "react";
import CustomButton from "@/components/common/customButton";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { 
  QrCode, 
  Download, 
  Camera,
  Image as ImageIcon,
  Copy,
  CheckCircle,
  Smartphone,
  Upload,
  Wifi,
  Globe,
  Zap
} from "lucide-react";

// Deployment configuration - Update for your domain
const DEPLOYMENT_DOMAIN = "kiosk-ai.vercel.app";
const MOBILE_UPLOAD_PATH = "/mobile-upload";

const MobileToWebTransfer = () => {
  const [status, setStatus] = useState<'ready' | 'waiting' | 'connected' | 'receiving' | 'complete'>('ready');
  const [progress, setProgress] = useState(0);
  const [receivedImage, setReceivedImage] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [connectionCode, setConnectionCode] = useState<string>('');
  const [, setSessionId] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [mobileConnected, setMobileConnected] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add log
  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`${time}: ${msg}`, ...prev.slice(0, 8)]); // Reduced from 10 to 8
    console.log(msg);
  };

  // Generate QR code for mobile
  const generateQRCode = () => {
    try {
      // Generate unique IDs
      const session = `web-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      setSessionId(session);
      setConnectionCode(code);
      setStatus('waiting');
      setReceivedImage(null);
      setProgress(0);
      setMobileConnected(false);
      
      // Create mobile page URL using your deployed domain
      const mobilePageUrl = `https://${DEPLOYMENT_DOMAIN}${MOBILE_UPLOAD_PATH}?session=${session}&code=${code}`;
      
      // Create QR code with URL
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(mobilePageUrl)}&color=2d2d6d&bgcolor=ffffff&margin=8`;
      setQrCodeUrl(qrImageUrl);
      
      addLog(`✅ QR Code Generated`);
      addLog(`🔢 Code: ${code}`);
      addLog(`⏳ Waiting for mobile connection...`);
      
      // Start polling for uploaded images
      startPolling(session, code);
      
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  // Poll for uploaded images
  const startPolling = (session: string, code: string) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const key = `image_upload_${session}_${code}`;
        const uploadedData = localStorage.getItem(key);
        
        if (uploadedData) {
          const data = JSON.parse(uploadedData);
          
          if (data.status === 'uploaded' && data.imageData) {
            // Image received!
            setMobileConnected(true);
            setStatus('receiving');
            setProgress(50);
            
            addLog(`📸 Mobile uploaded: ${data.fileName}`);
            
            // Simulate processing
            setTimeout(() => {
              const imageUrl = data.imageData;
              setReceivedImage(imageUrl);
              setStatus('complete');
              setProgress(100);
              addLog(`✅ Image received and processed`);
              
              // Clear from storage
              localStorage.removeItem(key);
              
              // Stop polling
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
            }, 1000); // Reduced from 1500ms
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);
  };

  // Handle file upload from website (for testing)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      addLog("Please select an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setReceivedImage(imageUrl);
      setStatus('complete');
      addLog("✅ Image uploaded from computer");
    };
    reader.readAsDataURL(file);
  };

  // Save image
  const saveImage = () => {
    if (!receivedImage) return;
    
    const link = document.createElement('a');
    link.href = receivedImage;
    link.download = `web-received-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addLog("💾 Image saved to device");
  };

  // Copy connection code
  const copyCode = () => {
    navigator.clipboard.writeText(connectionCode);
    addLog("📋 Code copied to clipboard");
  };

  // Reset
  const reset = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    
    setStatus('ready');
    setProgress(0);
    setReceivedImage(null);
    setQrCodeUrl('');
    setConnectionCode('');
    setMobileConnected(false);
    addLog("🔄 Session reset");
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat p-3 md:p-4">
      <Stack className="w-full max-w-5xl mx-auto gap-4 md:gap-6 py-4 md:py-6">
        
        {/* Header - Made more compact */}
        <Center className="flex-col gap-2 md:gap-3">
          <div className="relative p-4 md:p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10">
            <div className="relative">
              <Smartphone className="size-14 md:size-16 text-purple-400" />
              <Upload className="size-7 md:size-8 text-pink-400 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">Mobile to Web Image Transfer</h1>
          <p className="text-white/60 text-sm md:text-base text-center">Scan QR with phone → Send image → Website processes it</p>
          <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/30">
            <Globe className="size-3 md:size-4 text-blue-400" />
            <span className="text-blue-300 text-xs md:text-sm">{DEPLOYMENT_DOMAIN}</span>
          </div>
        </Center>

        {/* Main Content - Made more compact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left: QR Code Panel - Reduced padding and sizes */}
          <Box className="bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
            <Stack className="gap-4 md:gap-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-1">Step 1: Generate QR Code</h2>
                <p className="text-white/60 text-xs md:text-sm">Create QR code for mobile to scan</p>
              </div>
              
              {qrCodeUrl ? (
                <Center className="flex-col gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-white rounded-lg">
                    <img src={qrCodeUrl} alt="Scan with phone" className="w-48 h-48 md:w-56 md:h-56" />
                  </div>
                  
                  <div className="text-center space-y-2 md:space-y-3 w-full">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-white/60 text-xs md:text-sm">Code:</span>
                      <code className="bg-white/10 px-2 py-1.5 md:px-3 md:py-2 rounded text-white font-mono text-sm md:text-base">
                        {connectionCode}
                      </code>
                      <button
                        onClick={copyCode}
                        className="text-white/60 hover:text-white"
                        title="Copy code"
                      >
                        <Copy className="size-4 md:size-5" />
                      </button>
                    </div>
                    
                    {status === 'waiting' && (
                      <div className="p-2 md:p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-300 text-xs md:text-sm">
                          ⏳ Waiting for mobile connection...
                        </p>
                      </div>
                    )}
                    
                    {mobileConnected && (
                      <div className="p-2 md:p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-green-300 text-xs md:text-sm flex items-center gap-1.5">
                          <CheckCircle className="size-3 md:size-4" />
                          ✅ Mobile connected!
                        </p>
                      </div>
                    )}
                  </div>
                </Center>
              ) : (
                <Center className="py-6 md:py-8">
                  <div className="text-center space-y-3 md:space-y-4">
                    <div className="p-6 md:p-8 bg-white/5 rounded-xl border-2 border-dashed border-white/20 inline-block">
                      <QrCode className="size-16 md:size-20 text-white/30" />
                    </div>
                    <p className="text-white/60 text-sm">QR code will appear here</p>
                  </div>
                </Center>
              )}
              
              <div className="flex gap-2 md:gap-3">
                <CustomButton
                  wrapperClassName="flex-1"
                  title={qrCodeUrl ? "New Code" : "Generate QR Code"}
                  icon={<QrCode className="size-4 md:size-5" />}
                  onClick={generateQRCode}
                  size="sm"
                />
                {qrCodeUrl && (
                  <CustomButton
                    wrapperClassName="w-24 md:w-28"
                    title="Reset"
                    variant="outline"
                    onClick={reset}
                    size="sm"
                  />
                )}
              </div>
              
              {/* Test Upload (for development) */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-white/60 text-xs mb-2">Developer Test:</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 rounded-lg border border-white/20 bg-white/5 text-white text-sm hover:bg-white/10 transition-colors"
                >
                  Test: Upload Image from Computer
                </button>
              </div>
            </Stack>
          </Box>

          {/* Right: Image Preview Panel - Reduced padding and sizes */}
          <Box className="bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
            <Stack className="gap-4 md:gap-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-1">Step 2: Receive & Process Image</h2>
                <p className="text-white/60 text-xs md:text-sm">Images will appear here automatically</p>
              </div>
              
              {/* Progress */}
              {progress > 0 && (
                <div className="space-y-1.5 md:space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white text-sm">
                      {status === 'receiving' ? 'Receiving...' : 'Complete!'} {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Image Display - Made more compact */}
              <div className="flex-1 flex items-center justify-center min-h-[280px] md:min-h-[320px]">
                {receivedImage ? (
                  <div className="w-full space-y-3 md:space-y-4">
                    <div className="relative">
                      <img 
                        src={receivedImage} 
                        alt="Received from mobile" 
                        className="w-full max-h-64 md:max-h-72 object-contain rounded-lg md:rounded-xl border-2 border-white/20 bg-black/50"
                      />
                      <div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-0.5 rounded-full">
                        Received ✓
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      <CustomButton
                        title="Save Image"
                        icon={<Download className="size-4 md:size-5" />}
                        onClick={saveImage}
                        size="sm"
                      />
                      <CustomButton
                        title="Process"
                        icon={<Zap className="size-4 md:size-5" />}
                        variant="outline"
                        onClick={() => {
                          addLog("🔄 Running image processing...");
                          // Your custom processing logic here
                        }}
                        size="sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3 md:space-y-4">
                    <div className="p-6 md:p-8 bg-white/5 rounded-xl border-2 border-dashed border-white/20 inline-block">
                      <ImageIcon className="size-16 md:size-20 text-white/30" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">
                        {status === 'connected' 
                          ? 'Ready to receive image from mobile...' 
                          : 'No image received yet'}
                      </p>
                      {status === 'connected' && (
                        <p className="text-white/40 text-xs mt-1">
                          Ask user to select image on their phone
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile Instructions - Made more compact */}
              <div className="p-3 md:p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="text-white font-medium text-sm mb-2 flex items-center gap-1.5">
                  <Camera className="size-4" />
                  Testing Instructions:
                </h3>
                <ol className="space-y-1 text-xs text-white/80 pl-4">
                  <li><strong>On Phone:</strong> Open browser</li>
                  <li><strong>Visit:</strong> {DEPLOYMENT_DOMAIN}/mobile-upload</li>
                  <li>Enter code: {connectionCode || "[Code will appear]"}</li>
                  <li>Select image and upload</li>
                  <li>Image appears here automatically</li>
                </ol>
              </div>
            </Stack>
          </Box>
        </div>

        {/* Connection Status - Made more compact */}
        <Box className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                status === 'ready' ? 'bg-gray-500' :
                status === 'waiting' ? 'bg-yellow-500 animate-pulse' :
                status === 'connected' ? 'bg-green-500' :
                status === 'receiving' ? 'bg-blue-500 animate-pulse' :
                'bg-purple-500'
              }`} />
              <div>
                <p className="text-white font-medium text-sm">Status: {status.toUpperCase()}</p>
                <p className="text-white/60 text-xs">
                  {status === 'ready' && 'Ready to generate QR code'}
                  {status === 'waiting' && 'Waiting for mobile connection'}
                  {status === 'connected' && 'Mobile connected'}
                  {status === 'receiving' && 'Receiving image'}
                  {status === 'complete' && 'Image received & processed'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Wifi className={`size-4 ${mobileConnected ? 'text-green-500' : 'text-gray-500'}`} />
              <div>
                <p className="text-white font-medium text-sm">Mobile Connection</p>
                <p className="text-white/60 text-xs">
                  {mobileConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-blue-500" />
              <div>
                <p className="text-white font-medium text-sm">Domain</p>
                <p className="text-white/60 text-xs truncate">{DEPLOYMENT_DOMAIN}</p>
              </div>
            </div>
          </div>
        </Box>

        {/* Connection Logs - Made more compact */}
        <Box className="bg-black/40 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium text-sm flex items-center gap-1.5">
              <Wifi className="size-4" />
              Activity Log
            </h3>
            <span className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded">
              {logs.length} events
            </span>
          </div>
          
          <div className="max-h-40 overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <p className="text-white/40 text-xs text-center p-2">No activity yet</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-white/60 text-xs p-2 hover:bg-white/5 rounded font-mono">
                  {log}
                </div>
              ))
            )}
          </div>
        </Box>
      </Stack>
    </Box>
  );
};

export default MobileToWebTransfer;