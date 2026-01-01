import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { environment } from "@/configs/axios.config";

export interface ImageStore {
  selectedImage: string | null;
  setSelectedImage: (imageUrl: string | null) => void;
  clearSelectedImage: () => void;
}

export const useImageStore = create(
  devtools<ImageStore>(
    (set) => ({
      selectedImage: null,
      setSelectedImage: (imageUrl) => {
        set((state) => {
          // Clean up previous image URL if it exists
          if (state.selectedImage && state.selectedImage.startsWith("blob:")) {
            URL.revokeObjectURL(state.selectedImage);
          }
          return { selectedImage: imageUrl };
        });
      },
      clearSelectedImage: () => {
        set((state) => {
          // Clean up previous image URL if it exists
          if (state.selectedImage && state.selectedImage.startsWith("blob:")) {
            URL.revokeObjectURL(state.selectedImage);
          }
          return { selectedImage: null };
        });
      },
    }),
    {
      enabled: environment === "development",
      name: "image store",
    }
  )
);

