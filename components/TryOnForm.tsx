"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTrials } from "@/hooks/useTrials";
import { SignInModal } from "./SignInModal";
import { UpgradeModal } from "./UpgradeModal";
import { toast } from "sonner";
import { RiDeleteBinLine } from "react-icons/ri";
import { TOAST_CONFIG } from "@/lib/utils";
import { useModalStore } from "@/stores/useModalStore";

interface TryOnFormProps {
  onResult: (result: {
    inputUrl: string;
    garmentUrl: string;
    outputUrl: string;
  }) => void;
}

export function TryOnForm({ onResult }: TryOnFormProps) {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    showSignInModal,
    setShowSignInModal,
    showUpgradeModal,
    setShowUpgradeModal,
  } = useModalStore();
  const [personDragCounter, setPersonDragCounter] = useState(0);
  const [garmentDragCounter, setGarmentDragCounter] = useState(0);

  const personInputRef = useRef<HTMLInputElement>(null);
  const garmentInputRef = useRef<HTMLInputElement>(null);

  const { canTryOn, decrementTrial, markAnonymousTrialUsed } = useTrials();
  const { user } = useAuth();

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
          "You’ve reached your free trial limit. Create an account to keep trying on outfits!",
          { ...TOAST_CONFIG.error }
        );

        return;
      } else {
        setShowUpgradeModal(true);
        toast.error(
          "Looks like you’ve used all your free tries. Upgrade to Pro and enjoy unlimited try-ons!",
          { ...TOAST_CONFIG.error }
        );
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("personImage", personImage);
      formData.append("garmentImage", garmentImage);

      const response = {
        ok: true,
        status: 200,
        json: async () => ({
          inputUrl: personImage,
          garmentUrl: garmentImage,
          outputUrl: "/result.jpg",
        }),
      };

      if (!response.ok) {
        throw new Error("Failed to process try-on");
      }

      const result = await response.json();

      // Decrement trial for authenticated users

      if (user) {
        await decrementTrial();
      } else {
        markAnonymousTrialUsed();
      }

      onResult(result);
      toast.success("Your virtual try-on is ready!", {
        ...TOAST_CONFIG.success,
      });
    } catch (error) {
      console.error("Try-on error:", error);
      toast.error("Failed to process try-on. Please try again.", {
        ...TOAST_CONFIG.error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            <CardContent className="p-4">
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
                      src={URL.createObjectURL(personImage)}
                      alt="Person"
                      className="w-full h-100 object-cover rounded-lg mx-auto"
                    />
                  ) : (
                    <div className="w-full h-100 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Upload Your Photo
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Clear photo of yourself (front-facing works best)
                </p>
                <Button
                  variant="outline"
                  onClick={() => personInputRef.current?.click()}
                  className="w-full"
                >
                  {personImage ? "Change Photo" : "Choose Photo"}
                </Button>
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
            <CardContent className="p-4">
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
                      src={URL.createObjectURL(garmentImage)}
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
                <Button
                  variant="outline"
                  onClick={() => garmentInputRef.current?.click()}
                  className="w-full"
                >
                  {garmentImage ? "Change Garment" : "Choose Garment"}
                </Button>
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
            onClick={handleSubmit}
            disabled={!personImage || !garmentImage || loading}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
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
            Processing can take up to 30 seconds.
          </h3>
        </div>
      </div>

      <SignInModal open={showSignInModal} onOpenChange={setShowSignInModal} />

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </>
  );
}
