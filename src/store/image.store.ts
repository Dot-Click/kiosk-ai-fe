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

export interface CustomizationDetails {
  color: string;
  colorName: string;
  position: [number, number, number];
  scale: number;
  // horizontal offset around cup circumference (radians). present only for cup product
  cupOffset?: number;
}

export interface ImageStore {
  // Single selected image (for current operation)
  selectedImage: string | null;
  // The captured 3D mockup URL
  mockupImageUrl: string | null;

  // All generated images from the prompt
  generatedImages: GeneratedImage[];

  // The prompt/description used
  promptDescription: string;

  // Selected product type
  selectedProduct: string;

  // Selected AI style/filter options
  selectedStyle: string;
  selectedAdditionalStyle: string | null;

  // Customization details
  customizationDetails: CustomizationDetails | null;

  // Actions
  setSelectedImage: (imageUrl: string | null) => void;
  setMockupImageUrl: (imageUrl: string | null) => void;
  setGeneratedImages: (images: string[], description: string) => void;
  addGeneratedImage: (image: GeneratedImage) => void;
  clearSelectedImage: () => void;
  clearAllImages: () => void;
  selectImageByIndex: (index: number) => void;
  selectImageByUrl: (url: string) => void;
  setSelectedProduct: (product: string) => void;
  setSelectedStyle: (style: string) => void;
  setCustomizationDetails: (details: CustomizationDetails | null) => void;
}

export const useImageStore = create(
  devtools(
    persist<ImageStore>(
      (set, get) => ({
        selectedImage: null,
        mockupImageUrl: null,
        generatedImages: [],
        promptDescription: "",
        selectedProduct: "cup",
        selectedStyle: "caricature",
        selectedAdditionalStyle: null,
        customizationDetails: null,

        setSelectedImage: (imageUrl) => {
          set((state) => {
            // Clean up previous image URL if it exists
            if (state.selectedImage && state.selectedImage.startsWith("blob:")) {
              URL.revokeObjectURL(state.selectedImage);
            }
            return { selectedImage: imageUrl };
          });
        },

        setMockupImageUrl: (imageUrl) => {
          set({ mockupImageUrl: imageUrl });
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
              promptDescription: "",
              selectedProduct: "cup",
              customizationDetails: null
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

        setSelectedProduct: (product: string) => {
          set({ selectedProduct: product });
        },

        setSelectedStyle: (style) => { set({ selectedStyle: style }); },
        setSelectedAdditionalStyle: (style: string) => { set({ selectedAdditionalStyle: style }); },
        setCustomizationDetails: (details) => {
          set({ customizationDetails: details });
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