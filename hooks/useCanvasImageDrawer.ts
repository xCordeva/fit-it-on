"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { TOAST_CONFIG } from "@/lib/utils";

export function useCanvasImageDrawer() {
  const drawImage = useCallback(
    async (canvas: HTMLCanvasElement, imageUrl: string) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get 2D context for canvas.");
        return;
      }

      if (canvas.width === 0 || canvas.height === 0) {
        canvas.width = 600; // Default width for loading message
        canvas.height = 600; // Default height for loading message
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "16px Arial";
      ctx.fillStyle = "#888";
      ctx.textAlign = "center";
      ctx.fillText("Loading image...", canvas.width / 2, canvas.height / 2);

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to load image: ${response.statusText}`);
        }
        const imageBlob = await response.blob();

        const img = new Image();
        img.src = URL.createObjectURL(imageBlob);

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            URL.revokeObjectURL(img.src);
            resolve();
          };
          img.onerror = (e) => {
            URL.revokeObjectURL(img.src);
            reject(new Error("Image failed to load."));
          };
        });

        // --- CRUCIAL CHANGE: Set canvas dimensions to original image dimensions ---
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas at its original resolution
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear again after dimension change
        ctx.drawImage(img, 0, 0); // Draw at 0,0 with original width/height implicitly
      } catch (error: any) {
        console.error("Error drawing image to canvas:", error);
        if (typeof toast !== "undefined") {
          toast.error(error.message || "Failed to load result image.", {
            ...TOAST_CONFIG.error,
          });
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(
          "Error loading image.",
          canvas.width / 2,
          canvas.height / 2
        );
      }
    },
    []
  );

  return drawImage;
}
