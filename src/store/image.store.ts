// import { create } from "zustand";
// import { devtools } from "zustand/middleware";
// import { environment } from "@/configs/axios.config";

// export interface ImageStore {
//   selectedImage: string | null;
//   setSelectedImage: (imageUrl: string | null) => void;
//   clearSelectedImage: () => void;
// }

// export const useImageStore = create(
//   devtools<ImageStore>(
//     (set) => ({
//       selectedImage: null,
//       setSelectedImage: (imageUrl) => {
//         set((state) => {
//           // Clean up previous image URL if it exists
//           if (state.selectedImage && state.selectedImage.startsWith("blob:")) {
//             URL.revokeObjectURL(state.selectedImage);
//           }
//           return { selectedImage: imageUrl };
//         });
//       },
//       clearSelectedImage: () => {
//         set((state) => {
//           // Clean up previous image URL if it exists
//           if (state.selectedImage && state.selectedImage.startsWith("blob:")) {
//             URL.revokeObjectURL(state.selectedImage);
//           }
//           return { selectedImage: null };
//         });
//       },
//     }),
//     {
//       enabled: environment === "development",
//       name: "image store",
//     }
//   )
// );




// /store/image.store.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { environment } from "@/configs/axios.config";

export interface GeneratedImage {
  url: string;
  id: string;
  prompt?: string;
}

export interface ImageStore {
  // Single selected image (for current operation)
  selectedImage: string | null;
  
  // All generated images from the prompt
  generatedImages: GeneratedImage[];
  
  // The prompt/description used
  promptDescription: string;
  
  // Actions
  setSelectedImage: (imageUrl: string | null) => void;
  setGeneratedImages: (images: string[], description: string) => void;
  addGeneratedImage: (image: GeneratedImage) => void;
  clearSelectedImage: () => void;
  clearAllImages: () => void;
  selectImageByIndex: (index: number) => void;
  selectImageByUrl: (url: string) => void;
}

export const useImageStore = create(
  devtools(
    persist<ImageStore>(
      (set, get) => ({
        selectedImage: null,
        generatedImages: [],
        promptDescription: "",
        
        setSelectedImage: (imageUrl) => {
          set((state) => {
            // Clean up previous image URL if it exists
            if (state.selectedImage && state.selectedImage.startsWith("blob:")) {
              URL.revokeObjectURL(state.selectedImage);
            }
            return { selectedImage: imageUrl };
          });
        },
        
        setGeneratedImages: (images: string[], description: string) => {
          const generatedImages: GeneratedImage[] = images.map((url, index) => ({
            url,
            id: `img-${Date.now()}-${index}`,
            prompt: description,
          }));
          
          set({ 
            generatedImages,
            promptDescription: description,
            selectedImage: images.length > 0 ? images[0] : null 
          });
        },
        
        addGeneratedImage: (image: GeneratedImage) => {
          set((state) => ({
            generatedImages: [...state.generatedImages, image],
            selectedImage: image.url,
          }));
        },
        
        clearSelectedImage: () => {
          set((state) => {
            if (state.selectedImage && state.selectedImage.startsWith("blob:")) {
              URL.revokeObjectURL(state.selectedImage);
            }
            return { selectedImage: null };
          });
        },
        
        clearAllImages: () => {
          set((state) => {
            // Clean up all blob URLs
            state.generatedImages.forEach((img) => {
              if (img.url.startsWith("blob:")) {
                URL.revokeObjectURL(img.url);
              }
            });
            if (state.selectedImage && state.selectedImage.startsWith("blob:")) {
              URL.revokeObjectURL(state.selectedImage);
            }
            return { 
              selectedImage: null,
              generatedImages: [],
              promptDescription: "" 
            };
          });
        },
        
        selectImageByIndex: (index: number) => {
          const state = get();
          if (index >= 0 && index < state.generatedImages.length) {
            set({ selectedImage: state.generatedImages[index].url });
          }
        },
        
        selectImageByUrl: (url: string) => {
          set({ selectedImage: url });
        },
      }),
      {
        name: "image-storage",
      }
    ),
    {
      enabled: environment === "development",
      name: "image store",
    }
  )
);