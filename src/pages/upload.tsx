// import { useState, useRef, useEffect } from "react";
// import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { 
//   Camera, 
//   Upload as UploadIcon,
//   CheckCircle,
//   Smartphone,
//   X
// } from "lucide-react";

// const MobileUploadPage = () => {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [uploadStatus, setUploadStatus] = useState<'ready' | 'uploading' | 'success'>('ready');
//   const [connectionCode, setConnectionCode] = useState<string>('');
//   const [fileName, setFileName] = useState<string>('');
//   const [fileSize, setFileSize] = useState<string>('');
  
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Get connection code from URL
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const urlParams = new URLSearchParams(window.location.search);
//       const code = urlParams.get('code');
//       if (code) {
//         setConnectionCode(code);
//       }
//     }
//   }, []);

//   // Handle image selection
//   const handleSelectImage = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Handle file selection
//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
    
//     if (!file.type.startsWith('image/')) {
//       alert("Please select an image file (JPG, PNG, etc.)");
//       return;
//     }
    
//     if (file.size > 10 * 1024 * 1024) { // 10MB limit
//       alert("Image too large! Please select an image under 10MB.");
//       return;
//     }

//     // Set file info
//     setFileName(file.name);
//     setFileSize(formatFileSize(file.size));

//     // Preview image
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const imageUrl = e.target?.result as string;
//       setSelectedImage(imageUrl);
//     };
//     reader.readAsDataURL(file);
//   };

//   // Format file size
//   const formatFileSize = (bytes: number): string => {
//     if (bytes < 1024) return bytes + ' bytes';
//     else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
//     else return (bytes / 1048576).toFixed(1) + ' MB';
//   };

//   // Upload image to main page - INSTANT
//   const uploadImage = () => {
//     if (!selectedImage || !connectionCode) {
//       alert("Please select an image first");
//       return;
//     }

//     setUploadStatus('uploading');

//     // INSTANT UPLOAD - No delay
//     // Store image in localStorage (shared with main page)
//     const uploadData = {
//       code: connectionCode,
//       image: selectedImage,
//       fileName: fileName,
//       fileSize: fileSize,
//       timestamp: Date.now(),
//       status: 'uploaded'
//     };
    
//     localStorage.setItem(`upload_${connectionCode}`, JSON.stringify(uploadData));
    
//     // Show success immediately
//     setUploadStatus('success');
    
//     // Auto-close after 2 seconds
//     setTimeout(() => {
//       // Close the page or show close message
//       document.getElementById('close-message')?.classList.remove('hidden');
//     }, 500);
//   };

//   // Remove selected image
//   const removeImage = () => {
//     setSelectedImage(null);
//     setFileName('');
//     setFileSize('');
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   return (
//     <Box className="min-h-screen w-full bg-[#080319] p-4">
//       <Center className="h-full">
//         <Stack className="w-full max-w-sm items-center gap-5">
          
//           {/* Header */}
//           <Center className="flex-col gap-3">
//             <div className="p-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full">
//               <Smartphone className="size-12 text-white" />
//             </div>
//             <h1 className="text-2xl font-bold text-white text-center">
//               Upload to Kiosk AI
//             </h1>
//             {connectionCode && (
//               <div className="px-4 py-2 bg-white/10 rounded-full">
//                 <p className="text-white/80 text-sm">
//                   Code: <span className="font-mono font-bold">{connectionCode}</span>
//                 </p>
//               </div>
//             )}
//           </Center>

//           {/* Upload Area */}
//           <Box className="w-full bg-white/5 rounded-xl p-4 border border-white/10">
//             <Stack className="gap-4">
              
//               {!selectedImage ? (
//                 // Select Image Button
//                 <button
//                   onClick={handleSelectImage}
//                   className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/30 hover:border-white/50 transition-colors active:scale-95"
//                 >
//                   <div className="p-3 rounded-full bg-white/10">
//                     <Camera className="size-8 text-white" />
//                   </div>
//                   <div className="text-center">
//                     <p className="text-white font-medium text-lg">Select Image</p>
//                     <p className="text-white/60 text-sm mt-1">
//                       Tap to choose from gallery
//                     </p>
//                   </div>
//                 </button>
//               ) : (
//                 // Image Preview
//                 <div className="space-y-3">
//                   <div className="relative rounded-lg overflow-hidden bg-black/20">
//                     <img 
//                       src={selectedImage} 
//                       alt="Selected" 
//                       className="w-full h-48 object-cover"
//                     />
//                     <button
//                       onClick={removeImage}
//                       className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5"
//                     >
//                       <X size={16} />
//                     </button>
//                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
//                       <p className="text-white text-sm truncate">{fileName}</p>
//                       <p className="text-white/70 text-xs">{fileSize}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleSelectImage}
//                       className="flex-1 py-3 rounded-lg border border-white/20 bg-white/5 text-white text-sm active:scale-95"
//                     >
//                       Change Image
//                     </button>
                    
//                     <button
//                       onClick={uploadImage}
//                       disabled={uploadStatus === 'uploading'}
//                       className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-sm active:scale-95 ${
//                         uploadStatus === 'uploading'
//                           ? 'bg-blue-500 text-white'
//                           : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
//                       }`}
//                     >
//                       {uploadStatus === 'uploading' ? (
//                         <>
//                           <div className="animate-spin rounded-full size-4 border-2 border-white border-t-transparent"></div>
//                           Sending...
//                         </>
//                       ) : (
//                         <>
//                           <UploadIcon size={16} />
//                           Upload Now
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
              
//               {/* Hidden file input */}
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleFileSelect}
//               />
//             </Stack>
//           </Box>

//           {/* Upload Status */}
//           {uploadStatus === 'success' && (
//             <div className="w-full p-4 bg-green-500/10 border border-green-500/30 rounded-xl animate-in fade-in">
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="size-6 text-green-500" />
//                 <div>
//                   <p className="text-green-300 font-medium">✅ Upload Successful!</p>
//                   <p className="text-green-300/70 text-sm mt-1">
//                     Image sent to Kiosk AI screen
//                   </p>
//                   <div id="close-message" className="hidden mt-2 p-2 bg-green-500/20 rounded">
//                     <p className="text-green-300 text-xs">
//                       You can now close this page
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Instructions */}
//           <div className="w-full p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
//             <h3 className="text-white font-medium mb-2 text-sm">How it works:</h3>
//             <ul className="text-white/70 text-xs space-y-1.5">
//               <li className="flex items-start gap-2">
//                 <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">1</div>
//                 <span>Select image from your phone</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">2</div>
//                 <span>Tap "Upload Now" button</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">3</div>
//                 <span>Image appears instantly on Kiosk AI</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">4</div>
//                 <span>Close this page when done</span>
//               </li>
//             </ul>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-2 w-full">
//             {selectedImage && uploadStatus !== 'success' && (
//               <button
//                 onClick={removeImage}
//                 className="flex-1 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm active:scale-95"
//               >
//                 Cancel
//               </button>
//             )}
            
//             {uploadStatus === 'success' && (
//               <button
//                 onClick={() => window.close()}
//                 className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm active:scale-95"
//               >
//                 Close Page
//               </button>
//             )}
//           </div>

//           {/* Info */}
//           <div className="text-center">
//             <p className="text-white/50 text-xs">
//               Images are sent directly to the Kiosk AI screen
//             </p>
//             <p className="text-white/40 text-xs mt-1">
//               No data is stored on our servers
//             </p>
//           </div>
//         </Stack>
//       </Center>
//     </Box>
//   );
// };

// export default MobileUploadPage;



// import { useState, useRef, useEffect } from "react";
// import { Box } from "@/components/ui/box";
// import { Center } from "@/components/ui/center";
// import { Stack } from "@/components/ui/stack";
// import { 
//   Camera, 
//   Upload as UploadIcon,
//   CheckCircle,
//   Smartphone,
//   X,
//   AlertCircle
// } from "lucide-react";

// // Backend API Configuration
// const API_BASE_URL = "https://kiosk-ai-be-production.up.railway.app/api/v1";

// const MobileUploadPage = () => {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [uploadStatus, setUploadStatus] = useState<'ready' | 'uploading' | 'success' | 'error'>('ready');
//   const [connectionCode, setConnectionCode] = useState<string>('');
//   const [fileName, setFileName] = useState<string>('');
//   const [fileSize, setFileSize] = useState<string>('');
//   const [file, setFile] = useState<File | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string>('');
//   const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Get connection code from URL and validate QR code
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const urlParams = new URLSearchParams(window.location.search);
//       const code = urlParams.get('code');
//       if (code) {
//         setConnectionCode(code);
//         validateQRCode(code);
//       } else {
//         setErrorMessage('No QR code provided. Please scan the QR code again.');
//       }
//     } 
    
//     // Check backend health
//     checkBackendHealth();
//   }, []);

//   const checkBackendHealth = async () => {
//     try {
//       const response = await fetch(`https://kiosk-ai-be-production.up.railway.app/health`);
//       if (response.ok) {
//         setBackendStatus('connected');
//       } else {
//         setBackendStatus('error');
//         setErrorMessage('Backend server is not responding');
//       }
//     } catch {
//       setBackendStatus('error');
//       setErrorMessage('Cannot connect to backend server');
//     }
//   };

// const validateQRCode = async (code: string) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/qr/validate/${code}`);
    
//     if (!response.ok) {
//       console.warn('QR validation failed, but continuing anyway');
//       // Don't show error, just continue
//       return;
//     }
    
//     const data = await response.json();
    
//     if (!data.success || !data.data.isValid) {
//       console.warn('QR code is invalid or expired');
//       // Show warning but don't block
//       setErrorMessage('Note: QR code may be expired. You can still try uploading.');
//     }
//   } catch (error) {
//     console.warn('QR validation error, continuing anyway:', error);
//     // Don't block on validation error
//   }
// };

//   // Handle image selection
//   const handleSelectImage = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Handle file selection
//  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//   const selectedFile = event.target.files?.[0];
//   if (!selectedFile) return;
  
//   // Validate file type
//   const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//   if (!allowedTypes.includes(selectedFile.type)) {
//     setErrorMessage('Please select an image file (JPG, PNG, GIF, WebP)');
//     return;
//   }
  
//   // Validate file size (10MB limit)
//   if (selectedFile.size > 10 * 1024 * 1024) {
//     setErrorMessage('Image too large! Please select an image under 10MB.');
//     return;
//   }

//   // Set file info
//   setFileName(selectedFile.name);
//   setFileSize(formatFileSize(selectedFile.size));
//   setFile(selectedFile);
//   setErrorMessage('');

//   // Preview image
//   const reader = new FileReader();
//   reader.onload = (e) => {
//     const imageUrl = e.target?.result as string;
//     setSelectedImage(imageUrl);
//   };
//   reader.readAsDataURL(selectedFile);
// };
//   // Format file size
//   const formatFileSize = (bytes: number): string => {
//     if (bytes < 1024) return bytes + ' bytes';
//     else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
//     else return (bytes / 1048576).toFixed(1) + ' MB';
//   };

//   // Upload image to backend
//  const uploadImage = async () => {
//   if (!selectedImage || !connectionCode || !file) {
//     setErrorMessage('Please select an image first');
//     return;
//   }

//   setUploadStatus('uploading');
//   setErrorMessage('');

//   try {
//     console.log('🔼 Starting upload...');
//     console.log('📁 File:', file.name, file.size);
//     console.log('🔢 Code:', connectionCode);

//     // Create form data
//     const formData = new FormData();
//     formData.append('code', connectionCode);
//     formData.append('image', file);

//     // Upload to backend
//     console.log('📤 Uploading to:', `${API_BASE_URL}/upload/upload`);
//     const response = await fetch(`${API_BASE_URL}/upload/upload`, {
//       method: 'POST',
//       body: formData,
//     });

//     console.log('📥 Response status:', response.status);
//     const responseText = await response.text();
//     console.log('📦 Response text:', responseText);

//     let data;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       console.error('❌ Invalid JSON response:', responseText);
//       throw new Error('Invalid server response');
//     }

//     if (data.success) {
//       console.log('✅ Upload successful:', data);
//       setUploadStatus('success');
      
//       // Auto-show close message after 2 seconds
//       setTimeout(() => {
//         document.getElementById('close-message')?.classList.remove('hidden');
//       }, 2000);
      
//       // Also show alert for user
//       setTimeout(() => {
//         alert('✅ Upload successful! You can now close this page.');
//       }, 500);
//     } else {
//       console.error('❌ Upload failed:', data);
//       setUploadStatus('error');
//       setErrorMessage(data.error || data.message || 'Upload failed. Please try again.');
//     }
//   } catch (error: any) {
//     console.error('❌ Upload error:', error);
//     setUploadStatus('error');
//     setErrorMessage(error.message || 'Upload failed. Please check your connection and try again.');
//   }
// };

//   // Remove selected image
//   const removeImage = () => {
//     setSelectedImage(null);
//     setFileName('');
//     setFileSize('');
//     setFile(null);
//     setErrorMessage('');
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   return (
//     <Box className="min-h-screen w-full bg-[#080319] p-4">
//       <Center className="h-full">
//         <Stack className="w-full max-w-sm items-center gap-5">
          
//           {/* Header */}
//           <Center className="flex-col gap-3">
//             <div className="p-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full">
//               <Smartphone className="size-12 text-white" />
//             </div>
//             <h1 className="text-2xl font-bold text-white text-center">
//               Upload to Kiosk AI
//             </h1>
//             {connectionCode && (
//               <div className="px-4 py-2 bg-white/10 rounded-full">
//                 <p className="text-white/80 text-sm">
//                   Code: <span className="font-mono font-bold">{connectionCode}</span>
//                 </p>
//               </div>
//             )}
//           </Center>

//           {/* Backend Status */}
//           {backendStatus !== 'connected' && (
//             <div className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <AlertCircle className="size-5 text-red-400" />
//                 <p className="text-red-300 text-sm">
//                   {backendStatus === 'checking' ? 'Checking server...' : 'Server connection failed'}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Error Message */}
//           {errorMessage && (
//             <div className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
//               <p className="text-red-300 text-sm text-center">{errorMessage}</p>
//             </div>
//           )}

//           {/* Upload Area */}
//           <Box className="w-full bg-white/5 rounded-xl p-4 border border-white/10">
//             <Stack className="gap-4">
              
//               {!selectedImage ? (
//                 // Select Image Button
//                 <button
//                   onClick={handleSelectImage}
//                   disabled={!connectionCode || backendStatus !== 'connected'}
//                   className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/30 hover:border-white/50 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <div className="p-3 rounded-full bg-white/10">
//                     <Camera className="size-8 text-white" />
//                   </div>
//                   <div className="text-center">
//                     <p className="text-white font-medium text-lg">Select Image</p>
//                     <p className="text-white/60 text-sm mt-1">
//                       Tap to choose from gallery
//                     </p>
//                   </div>
//                 </button>
//               ) : (
//                 // Image Preview
//                 <div className="space-y-3">
//                   <div className="relative rounded-lg overflow-hidden bg-black/20">
//                     <img 
//                       src={selectedImage} 
//                       alt="Selected" 
//                       className="w-full h-48 object-cover"
//                     />
//                     <button
//                       onClick={removeImage}
//                       className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5"
//                     >
//                       <X size={16} />
//                     </button>
//                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
//                       <p className="text-white text-sm truncate">{fileName}</p>
//                       <p className="text-white/70 text-xs">{fileSize}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleSelectImage}
//                       className="flex-1 py-3 rounded-lg border border-white/20 bg-white/5 text-white text-sm active:scale-95"
//                     >
//                       Change Image
//                     </button>
                    
//                     <button
//                       onClick={uploadImage}
//                       disabled={uploadStatus === 'uploading' || backendStatus !== 'connected'}
//                       className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
//                         uploadStatus === 'uploading'
//                           ? 'bg-blue-500 text-white'
//                           : uploadStatus === 'success'
//                           ? 'bg-green-500 text-white'
//                           : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
//                       }`}
//                     >
//                       {uploadStatus === 'uploading' ? (
//                         <>
//                           <div className="animate-spin rounded-full size-4 border-2 border-white border-t-transparent"></div>
//                           Uploading...
//                         </>
//                       ) : uploadStatus === 'success' ? (
//                         <>
//                           <CheckCircle size={16} />
//                           Uploaded!
//                         </>
//                       ) : (
//                         <>
//                           <UploadIcon size={16} />
//                           Upload to Server
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
              
//               {/* Hidden file input */}
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 capture="environment" // Opens camera on mobile
//               />
//             </Stack>
//           </Box>

//           {/* Upload Status */}
//           {uploadStatus === 'success' && (
//             <div className="w-full p-4 bg-green-500/10 border border-green-500/30 rounded-xl animate-in fade-in">
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="size-6 text-green-500" />
//                 <div>
//                   <p className="text-green-300 font-medium">✅ Upload Successful!</p>
//                   <p className="text-green-300/70 text-sm mt-1">
//                     Image sent to Kiosk AI screen
//                   </p>
//                   <div id="close-message" className="hidden mt-2 p-2 bg-green-500/20 rounded">
//                     <p className="text-green-300 text-xs">
//                       You can now close this page
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {uploadStatus === 'error' && (
//             <div className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
//               <div className="flex items-center gap-3">
//                 <AlertCircle className="size-6 text-red-500" />
//                 <div>
//                   <p className="text-red-300 font-medium">Upload Failed</p>
//                   <p className="text-red-300/70 text-sm mt-1">
//                     Please try again or check your connection
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Instructions */}
//           <div className="w-full p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
//             <h3 className="text-white font-medium mb-2 text-sm">How it works:</h3>
//             <ul className="text-white/70 text-xs space-y-1.5">
//               <li className="flex items-start gap-2">
//                 <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">1</div>
//                 <span>Select image from your phone</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">2</div>
//                 <span>Tap "Upload to Server" button</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">3</div>
//                 <span>Image saved to database with your code</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs mt-0.5">4</div>
//                 <span>Kiosk AI will detect it automatically</span>
//               </li>
//             </ul>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-2 w-full">
//             {selectedImage && uploadStatus !== 'success' && uploadStatus !== 'uploading' && (
//               <button
//                 onClick={removeImage}
//                 className="flex-1 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm active:scale-95"
//               >
//                 Cancel
//               </button>
//             )}
            
//             {uploadStatus === 'success' && (
//               <button
//                 onClick={() => window.close()}
//                 className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm active:scale-95"
//               >
//                 Close Page
//               </button>
//             )}
//           </div>

//           {/* Info */}
//           <div className="text-center">
//             <p className="text-white/50 text-xs">
//               Images are saved to secure database
//             </p>
//             <p className="text-white/40 text-xs mt-1">
//               Only accessible with your unique code
//             </p>
//             {process.env.NODE_ENV === 'development' && (
//               <p className="text-gray-500 text-xs mt-1">
//                 🔗 API: {API_BASE_URL}
//               </p>
//             )}
//           </div>
//         </Stack>
//       </Center>
//     </Box>
//   );
// };

// export default MobileUploadPage;



import { useState, useRef, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { 
  Upload as UploadIcon,
  CheckCircle,
  Smartphone,
  X,
  Image as ImageIcon
} from "lucide-react";

// Backend API Configuration
const API_BASE_URL = "https://kiosk-ai-be-production.up.railway.app/api/v1";

const MobileUploadPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'ready' | 'uploading' | 'success' | 'error'>('ready');
  const [connectionCode, setConnectionCode] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get connection code from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        setConnectionCode(code);
        validateQRCode(code);
      } else {
        setErrorMessage('No QR code provided. Please scan the QR code again.');
      }
    } 
    
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`https://kiosk-ai-be-production.up.railway.app/health`);
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch {
      setBackendStatus('error');
    }
  };

  const validateQRCode = async (code: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/qr/validate/${code}`);
      if (!response.ok) return;
      const data = await response.json();
      if (!data.success || !data.data.isValid) {
        setErrorMessage('Note: QR code may be expired. You can still try uploading.');
      }
    } catch (error) {
      console.warn('QR validation error:', error);
    }
  };

  // Handle gallery selection
  const handleOpenGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle camera selection
  const handleOpenCamera = () => {
    // Create a temporary input for camera
    const cameraInput = document.createElement('input');
    cameraInput.type = 'file';
    cameraInput.accept = 'image/*';
    cameraInput.capture = 'environment'; // This opens camera
    
    cameraInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const selectedFile = target.files?.[0];
      if (selectedFile) {
        handleFileSelection(selectedFile);
      }
    };
    
    cameraInput.click();
  };

  // Handle file selection from both sources
  const handleFileSelection = (selectedFile: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage('Please select an image file (JPG, PNG, GIF, WebP)');
      return;
    }
    
    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('Image too large! Please select an image under 10MB.');
      return;
    }

    // Set file info
    setFileName(selectedFile.name);
    setFileSize(formatFileSize(selectedFile.size));
    setFile(selectedFile);
    setErrorMessage('');

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle file input change (for gallery)
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const uploadImage = async () => {
    if (!selectedImage || !connectionCode || !file) {
      setErrorMessage('Please select an image first');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('code', connectionCode);
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/upload/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadStatus('success');
        setTimeout(() => {
          document.getElementById('close-message')?.classList.remove('hidden');
        }, 2000);
      } else {
        setUploadStatus('error');
        setErrorMessage(data.error || data.message || 'Upload failed');
      }
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage('Upload failed. Please check your connection.');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setFileName('');
    setFileSize('');
    setFile(null);
    setErrorMessage('');
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

          {/* Error Message */}
          {errorMessage && (
            <div className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm text-center">{errorMessage}</p>
            </div>
          )}

          {/* Upload Area */}
          <Box className="w-full bg-white/5 rounded-xl p-4 border border-white/10">
            <Stack className="gap-4">
              
              {!selectedImage ? (
                // Show BOTH options: Gallery AND Camera
                <div className="space-y-3">
                  <button
                    onClick={handleOpenGallery}
                    disabled={!connectionCode || backendStatus !== 'connected'}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-purple-500/30 hover:border-purple-500/50 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-3 rounded-full bg-purple-500/20">
                      <ImageIcon className="size-6 text-purple-400" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white font-medium text-lg">Choose from Gallery</p>
                      <p className="text-white/60 text-sm">Select existing photos</p>
                    </div>
                  </button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-[#080319] text-white/40">OR</span>
                    </div>
                  </div>
                  
                  {/*<button
                    onClick={handleOpenCamera}
                    disabled={!connectionCode || backendStatus !== 'connected'}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-green-500/30 hover:border-green-500/50 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-3 rounded-full bg-green-500/20">
                      <Camera className="size-6 text-green-400" />
                    </div>
                     <div className="text-left flex-1">
                      <p className="text-white font-medium text-lg">Take a Photo</p>
                      <p className="text-white/60 text-sm">Open camera now</p>
                    </div> 
                  </button>*/}
                </div>
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
                      className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
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
                      onClick={handleOpenGallery}
                      className="flex-1 py-3 rounded-lg border border-white/20 bg-white/5 text-white text-sm hover:bg-white/10 transition-colors"
                    >
                      Change Image
                    </button>
                    
                    <button
                      onClick={uploadImage}
                      disabled={uploadStatus === 'uploading' || backendStatus !== 'connected'}
                      className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors ${
                        uploadStatus === 'uploading'
                          ? 'bg-blue-500 text-white'
                          : uploadStatus === 'success'
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {uploadStatus === 'uploading' ? (
                        <>
                          <div className="animate-spin rounded-full size-4 border-2 border-white border-t-transparent"></div>
                          Uploading...
                        </>
                      ) : uploadStatus === 'success' ? (
                        <>
                          <CheckCircle size={16} />
                          Uploaded!
                        </>
                      ) : (
                        <>
                          <UploadIcon size={16} />
                          Upload to Server
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Hidden file input for gallery (NO capture attribute) */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileInputChange}
                // No capture attribute = opens gallery
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
            <h3 className="text-white font-medium mb-2 text-sm">How to upload:</h3>
            <ol className="text-white/70 text-xs space-y-1.5">
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs">1</div>
                <span><strong>Tap "Choose from Gallery"</strong> to select existing photos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs">2</div>
                <span><strong>OR tap "Take a Photo"</strong> to use camera</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs">3</div>
                <span><strong>Tap "Upload to Server"</strong> button</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 text-blue-300 rounded-full size-4 flex items-center justify-center text-xs">4</div>
                <span><strong>Done!</strong> Image will appear on Kiosk AI screen</span>
              </li>
            </ol>
          </div>

          {/* Info */}
          <div className="text-center">
            <p className="text-white/50 text-xs">
              Supports JPG, PNG, GIF, WebP • Max 10MB
            </p>
          </div>
        </Stack>
      </Center>
    </Box>
  );
};

export default MobileUploadPage;