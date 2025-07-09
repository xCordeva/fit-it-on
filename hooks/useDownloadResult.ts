"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { TOAST_CONFIG } from "@/lib/utils";
import { useModalStore } from "@/stores/useModalStore";

export function useDownloadTryOnResult(
  isProUser: boolean,

  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  outputUrl: string,
  setLoading: (loading: boolean) => void
) {
  const { setShowUpgradeModal } = useModalStore();

  const handleDownload = useCallback(
    async (quality: "low" | "high") => {
      if (!isProUser && quality === "high") {
        setShowUpgradeModal(true);
        return;
      }
      const canvas = canvasRef.current;
      if (!canvas || !canvas.getContext("2d")) {
        toast.error("Image not loaded on canvas yet.", {
          ...TOAST_CONFIG.error,
        });
        return;
      }

      setLoading(true);

      try {
        let finalBlob: Blob | null = null;
        let targetMimeType = "image/jpeg";

        if (quality === "low") {
          const tempCanvas = document.createElement("canvas");
          const ctxTemp = tempCanvas.getContext("2d");
          if (!ctxTemp)
            throw new Error("Failed to get temporary canvas context.");

          const targetWidth = 512;
          const scale = targetWidth / canvas.width;
          tempCanvas.width = targetWidth;
          tempCanvas.height = canvas.height * scale;

          ctxTemp.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

          finalBlob = await new Promise<Blob | null>((resolve) =>
            tempCanvas.toBlob((b) => resolve(b), targetMimeType, 0.8)
          );
        } else {
          finalBlob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((b) => resolve(b), targetMimeType, 1.0)
          );
        }

        if (!finalBlob) {
          throw new Error("Failed to create image blob for download.");
        }

        const downloadUrl = URL.createObjectURL(finalBlob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `fititon-${quality}-result-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);

        toast.success(
          `Downloaded ${
            quality === "high" ? "Max" : "Low"
          } Quality image successfully!`,
          { ...TOAST_CONFIG.success }
        );
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download image.", { ...TOAST_CONFIG.error });
      } finally {
        setLoading(false);
      }
    },
    [isProUser, canvasRef, outputUrl, setLoading, setShowUpgradeModal]
  );

  return handleDownload;
}
