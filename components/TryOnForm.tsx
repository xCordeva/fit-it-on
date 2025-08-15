"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "../app/Provider";
import { useTrials } from "@/hooks/useTrials";
import { toast } from "sonner";
import { RiDeleteBinLine } from "react-icons/ri";
import { getAnonUserId, TOAST_CONFIG } from "@/lib/utils";
import { useModalStore } from "@/stores/useModalStore";
import {
  uploadImageFromUrlToSupabase,
  uploadImageToSupabase,
} from "@/lib/tryOnHelpers";
import { useReuseStore } from "@/stores/useReuseStore";
import { useGalleryStore } from "@/stores/useGalleryStore";

interface TryOnFormProps {
  onResult: (result: string[]) => void;
}

export function TryOnForm({ onResult }: TryOnFormProps) {
  const [personImage, setPersonImage] = useState<File | string | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | string | null>(null);

  const [loading, setLoading] = useState(false);
  const { setShowSignInModal, setShowUpgradeModal, setShowGalleryModal } =
    useModalStore();
  const [personDragCounter, setPersonDragCounter] = useState(0);
  const [garmentDragCounter, setGarmentDragCounter] = useState(0);

  const personInputRef = useRef<HTMLInputElement>(null);
  const garmentInputRef = useRef<HTMLInputElement>(null);

  const { canTryOn, decrementTrial, markAnonymousTrialUsed } = useTrials();
  const { user } = useAuth();
  const { imageUrl, target, clearReuse } = useReuseStore();

  useEffect(() => {
    if (imageUrl && target) {
      if (target === "person") {
        setPersonImage(imageUrl);
      } else {
        setGarmentImage(imageUrl);
      }
      clearReuse();
    }
  }, [imageUrl, target, clearReuse]);
  const { person, garment } = useGalleryStore();
  const showChooseFromGalleryButton = !!(person?.length || garment?.length);
  const { refetchGallery } = useGalleryStore();
  const handleImageUpload = (file: File, type: "person" | "garment") => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file", {
        ...TOAST_CONFIG.error,
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB", {
        ...TOAST_CONFIG.error,
      });
      return;
    }

    if (type === "person") {
      setPersonImage(file);
    } else {
      setGarmentImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!personImage || !garmentImage) {
      toast.error("Please upload both images", { ...TOAST_CONFIG.error });
      return;
    }

    if (!canTryOn) {
      if (!user) {
        setShowSignInModal(true);
        toast.error(
          "You’ve reached the limit for non-signed-up users. Create an account and get 2 more free tries to keep trying on outfits!",
          { ...TOAST_CONFIG.error }
        );
      } else {
        setShowUpgradeModal(true);
        toast.error(
          "Looks like you’ve used all your free tries. Upgrade to Pro and enjoy more try-ons!",
          { ...TOAST_CONFIG.error }
        );
      }
      return;
    }

    setLoading(true);

    try {
      let modelImageUrl: string;
      let garmentImageUrl: string;

      if (typeof personImage === "string") {
        modelImageUrl = personImage;
      } else {
        modelImageUrl = await uploadImageToSupabase(
          personImage,
          "person",
          user?.id ?? `anon/${getAnonUserId()}`
        );
      }

      // Upload garment image
      if (typeof garmentImage === "string") {
        garmentImageUrl = garmentImage;
      } else {
        garmentImageUrl = await uploadImageToSupabase(
          garmentImage,
          "garment",
          user?.id ?? `anon/${getAnonUserId()}`
        );
      }

      // Send prediction request
      const runResponse = await fetch(
        `${process.env.NEXT_PUBLIC_FASHN_BASE_URL}/run`,
        {
          method: "POST",
          body: JSON.stringify({
            model_name: "tryon-v1.6",
            inputs: {
              model_image: modelImageUrl,
              garment_image: garmentImageUrl,
              num_samples: 1, // this is the number of results variants, max is 4 min is 1 its 1 automatically
            },
          }),
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FASHN_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!runResponse.ok) throw new Error("Failed to start try-on");

      const { id: predictionId } = await runResponse.json();

      // Poll for status
      let status = "starting";
      let output: string[] = [];

      while (status !== "completed" && status !== "failed") {
        const statusResponse = await fetch(
          `${process.env.NEXT_PUBLIC_FASHN_BASE_URL}/status/${predictionId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_FASHN_API_KEY}`,
            },
          }
        );

        if (!statusResponse.ok) {
          throw new Error("Failed to fetch try-on status");
        }

        const statusData = await statusResponse.json();
        status = statusData.status;

        if (status === "completed") {
          output = statusData.output;
          break;
        }

        if (status === "failed") {
          throw new Error(statusData.error.message);
        }

        // Wait before polling again
        await new Promise((res) => setTimeout(res, 2500));
      }

      // Upload result images to Supabase
      const uploadedResults = await Promise.all(
        output.map((url) =>
          uploadImageFromUrlToSupabase(
            url,
            "results",
            user?.id ?? `anon/${getAnonUserId()}`
          )
        )
      );

      if (user) {
        await decrementTrial();
        refetchGallery(user.id);
      } else {
        markAnonymousTrialUsed();
      }

      onResult(uploadedResults);
      toast.success("Your virtual try-on is ready!", {
        ...TOAST_CONFIG.success,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process try-on. Please try again.",
        { ...TOAST_CONFIG.error }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Person Image Upload */}
        <Card
          className={`border-2 border-dashed transition-colors drop-shadow-lg relative ${
            personDragCounter > 0
              ? "border-primary ring-2 ring-purple-300 bg-purple-50"
              : "border-gray-300 hover:border-primary"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setPersonDragCounter((c) => c + 1)}
          onDragLeave={() => setPersonDragCounter((c) => Math.max(0, c - 1))}
          onDrop={(e) => {
            e.preventDefault();
            setPersonDragCounter(0);
            const file = e.dataTransfer.files?.[0];
            if (file) handleImageUpload(file, "person");
          }}
        >
          <CardContent className="md:p-4 p-3">
            {personImage && (
              <RiDeleteBinLine
                className="absolute right-8 top-8 size-6 text-gray-600 cursor-pointer hover:text-primary"
                onClick={() => setPersonImage(null)}
              />
            )}
            <div className="text-center">
              <div className="mb-4">
                {personImage ? (
                  <img
                    src={
                      typeof personImage === "string"
                        ? personImage
                        : URL.createObjectURL(personImage)
                    }
                    alt="Person"
                    className="w-full h-100 object-cover rounded-lg mx-auto"
                  />
                ) : (
                  <div className="w-full h-100 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload Your Photo</h3>
              <p className="text-sm text-gray-600 mb-4">
                Clear photo of yourself (front-facing works best)
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => personInputRef.current?.click()}
                  className="w-full"
                >
                  {personImage ? "Change Photo" : "Upload Photo"}
                </Button>
                {showChooseFromGalleryButton && (
                  <Button
                    variant="outline"
                    onClick={() => setShowGalleryModal("person")}
                    className="w-full"
                  >
                    Choose from Your Gallery
                  </Button>
                )}
              </div>
              <input
                ref={personInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, "person");
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Garment Image Upload */}
        <Card
          className={`border-2 border-dashed transition-colors drop-shadow-lg relative ${
            garmentDragCounter
              ? "border-primary ring-2 ring-purple-300 bg-purple-50"
              : "border-gray-300 hover:border-primary"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setGarmentDragCounter((c) => c + 1)}
          onDragLeave={() => setGarmentDragCounter((c) => Math.max(0, c - 1))}
          onDrop={(e) => {
            e.preventDefault();
            setGarmentDragCounter(0);
            const file = e.dataTransfer.files?.[0];
            if (file) handleImageUpload(file, "garment");
          }}
        >
          <CardContent className="md:p-4 p-3">
            {garmentImage && (
              <RiDeleteBinLine
                className="absolute right-8 top-8 size-6 text-gray-600 cursor-pointer hover:text-primary"
                onClick={() => setGarmentImage(null)}
              />
            )}

            <div className="text-center">
              <div className="mb-4">
                {garmentImage ? (
                  <img
                    src={
                      typeof garmentImage === "string"
                        ? garmentImage
                        : URL.createObjectURL(garmentImage)
                    }
                    alt="Garment"
                    className="w-full h-100 object-cover rounded-lg mx-auto"
                  />
                ) : (
                  <div className="w-full h-100 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload Garment</h3>
              <p className="text-sm text-gray-600 mb-4">
                Clothing item you want to try on
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => garmentInputRef.current?.click()}
                  className="w-full"
                >
                  {garmentImage ? "Change Garment" : "Choose Garment"}
                </Button>
                {showChooseFromGalleryButton && (
                  <Button
                    variant="outline"
                    onClick={() => setShowGalleryModal("garment")}
                    className="w-full"
                  >
                    Choose from Your Gallery
                  </Button>
                )}
              </div>
              <input
                ref={garmentInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, "garment");
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Try-On Button */}
      <div className="text-center">
        <Button
          variant="cool"
          onClick={handleSubmit}
          disabled={!personImage || !garmentImage || loading}
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Try It On
            </>
          )}
        </Button>
        <h3 className="text-gray-400 text-sm mt-2">
          Processing can take up to 60 seconds.
        </h3>
      </div>
    </div>
  );
}
