import { useCallback } from "react";
import axiosLib from "axios";
import { axios, backendDomain, ApiResponse } from "@/config/axios";

interface QrValidateResponse {
  success: boolean;
  data?: {
    isValid: boolean;
  };
  message?: string;
}

interface UploadResponse extends ApiResponse {
  success?: boolean;
  error?: string;
}

export const useUploadApi = () => {
  /**
   * Health check for the backend (non-/api route).
   */
  const checkBackendHealth = useCallback(async () => {
    const response = await axiosLib.get(`${backendDomain}/health`, {
      withCredentials: true,
    });
    return response.data as unknown;
  }, []);

  /**
   * Validate QR code before allowing upload.
   */
  const validateQRCode = useCallback(async (code: string) => {
    const response = await axios.get<QrValidateResponse>(`/v1/qr/validate/${code}`);
    return response.data;
  }, []);

  /**
   * Upload image for a given connection code.
   */
  const uploadImage = useCallback(
    async (code: string, file: File) => {
      const formData = new FormData();
      formData.append("code", code);
      formData.append("image", file);

      const response = await axios.post<UploadResponse>(`/v1/upload/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    []
  );

  return {
    checkBackendHealth,
    validateQRCode,
    uploadImage,
  };
};

