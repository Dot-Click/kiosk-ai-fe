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
//     const uploadUrl = `https://kiosk-ai.vercel.app/upload?code=${code}`;
    
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


import { useState, useRef, useEffect } from "react";
import CustomButton from "@/components/common/customButton";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { QrCode, Upload, Image as ImageIcon, ArrowRight, Copy, Smartphone } from "lucide-react";

const QRUploadPage = () => {
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
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(uploadUrl)}&color=2d2d6d&bgcolor=ffffff`;
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
      setShowNext(true);
      
      // Store in localStorage so mobile page can access it
      const uploadData = {
        code: connectionCode,
        image: imageUrl,
        fileName: file.name,
        timestamp: Date.now()
      };
      localStorage.setItem(`upload_${connectionCode}`, JSON.stringify(uploadData));
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
    alert("Proceeding to next step with the image...");
    // You can redirect or pass the image to next page:
    // window.location.href = `/process?image=${encodeURIComponent(receivedImage)}`;
  };

  // Check if image was uploaded (polling simulation)
  const checkForUpload = () => {
    if (!connectionCode) return;
    
    const data = localStorage.getItem(`upload_${connectionCode}`);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.image) {
        setReceivedImage(parsed.image);
        setShowNext(true);
      }
    }
  };

  // Auto-check for uploads every 2 seconds - FIXED: useEffect instead of useState
  useEffect(() => {
    if (connectionCode) {
      const interval = setInterval(checkForUpload, 2000);
      return () => clearInterval(interval);
    }
  }, [connectionCode]);

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat p-4">
      <Center className="h-full">
        <Stack className="w-full max-w-md items-center gap-6">
          
          {/* Logo/Icon */}
          <Center className="relative mb-2">
            <Box
              className="absolute rounded-full"
              style={{
                width: "120px",
                height: "120px",
                background: "rgba(226, 2, 255, 0.15)",
                filter: "blur(30px)",
              }}
            />
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-white/10">
              <Smartphone className="size-12 text-purple-400" />
            </div>
          </Center>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center">
            Upload from Phone
          </h1>
          <p className="text-white/70 text-sm text-center px-4">
            Scan QR code with your phone to upload images instantly
          </p>

          {/* QR Code Section */}
          {!qrCodeUrl ? (
            // Initial state - Show generate button
            <Box className="w-full mt-2">
              <CustomButton
                wrapperClassName="w-full h-12"
                title="Generate QR Code"
                icon={<QrCode size={20} />}
                onClick={generateQRCode}
              />
            </Box>
          ) : (
            // QR Code generated state
            <Box className="w-full space-y-4">
              {/* QR Code Display */}
              <Center className="p-4 bg-white rounded-lg">
                <img 
                  src={qrCodeUrl} 
                  alt="Scan this QR code" 
                  className="w-56 h-56"
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
              <Box className="bg-white/5 rounded-lg p-3 border border-white/10">
                <h3 className="text-white text-sm font-medium mb-2">How to upload:</h3>
                <ol className="text-white/70 text-xs space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs">1</span>
                    Open phone camera
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs">2</span>
                    Scan QR code above
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs">3</span>
                    Tap the link that appears
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-300 rounded-full size-5 flex items-center justify-center text-xs">4</span>
                    Select and upload image
                  </li>
                </ol>
              </Box>

              {/* Demo Upload Button (for testing without phone) */}
              <Box className="pt-3 border-t border-white/10">
                <p className="text-white/60 text-xs mb-2">Testing without phone?</p>
                <button
                  onClick={handleImageReceived}
                  className="w-full py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={16} />
                  Upload Test Image from Computer
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
                <p className="text-green-300 text-sm text-center flex items-center justify-center gap-2">
                  <ImageIcon size={16} />
                  ✅ Image received successfully!
                </p>
              </div>
              
              <Box className="bg-white/5 rounded-lg border border-white/20 overflow-hidden">
                <img 
                  src={receivedImage} 
                  alt="Uploaded" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 bg-black/30">
                  <p className="text-white text-sm">Ready for next step</p>
                </div>
              </Box>

              {/* Next Button */}
              {showNext && (
                <CustomButton
                  wrapperClassName="w-full h-12"
                  title="Continue to Next Step"
                  icon={<ArrowRight size={20} />}
                  onClick={handleNext}
                />
              )}
            </Box>
          )}

          {/* Status Message */}
          {qrCodeUrl && !receivedImage && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm text-center">
                ⏳ Waiting for image upload from phone...
              </p>
            </div>
          )}

          {/* Back/Reset Button */}
          {qrCodeUrl && !receivedImage && (
            <button
              onClick={() => {
                setQrCodeUrl("");
                setConnectionCode("");
                setReceivedImage(null);
              }}
              className="text-white/60 hover:text-white text-sm"
            >
              ← Generate new QR code
            </button>
          )}
        </Stack>
      </Center>
    </Box>
  );
};

export default QRUploadPage;