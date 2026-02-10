import { useCallback } from "react";
import axiosLib from "axios";
import { axios, backendDomain, apiBaseUrl } from "@/config/axios";

interface QrGenerateResponse {
  success: boolean;
  data?: {
    id?: string;
    code?: string;
    url: string;
  };
  message?: string;
}

interface UploadCheckResponse {
  success: boolean;
  data?: {
    exists: boolean;
    imageUrl?: string;
  };
}

export const useQrApi = () => {
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
   * Generate a QR code on the backend.
   */
  const generateQRCode = useCallback(async () => {
    const response = await axios.post<QrGenerateResponse>(`/v1/qr/generate`, {
      data: `kiosk-${Date.now()}`,
    });
    return response.data;
  }, []);

  /**
   * Check if an image has been uploaded for the given code.
   */
  const checkUpload = useCallback(async (code: string) => {
    const response = await axios.get<UploadCheckResponse>(`/v1/upload/check/${code}`);
    return response.data;
  }, []);

  /**
   * Build the image URL for a given code if the backend
   * does not return a direct URL.
   */
  const buildImageUrl = useCallback(
    (code: string) => `${apiBaseUrl}/v1/upload/image/${code}`,
    []
  );

  return {
    checkBackendHealth,
    generateQRCode,
    checkUpload,
    buildImageUrl,
  };
};

