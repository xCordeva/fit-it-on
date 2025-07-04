"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FaCircleXmark } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";
import Image from "next/image";

interface UploadGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadGuideModal({
  open,
  onOpenChange,
}: UploadGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col rounded-lg">
        <DialogTitle className="hidden"></DialogTitle>
        <div className="flex items-center justify-center mx-auto flex-col pb-6 mt-6 max-w-120">
          <div>
            <h2 className="text-green-500 flex items-center justify-center gap-1">
              <IoIosCheckmarkCircle />
              Suitable Photos
            </h2>
            <p className="text-gray-500 text-center">
              For the best result, please use a photo with a white background, a
              single item in front view, and a clear, simple pattern.
            </p>
            <div className="flex gap-2 items-center justify-center mt-2">
              <Image
                height={80}
                width={80}
                src="/suitable-photos/coat.webp"
                alt="fit-it-on-f-logo"
                className="border-1 border-gray-500 p-2"
              />
              <Image
                height={80}
                width={80}
                src="/suitable-photos/sweat-shirt.webp"
                alt="fit-it-on-f-logo"
                className="border-1 border-gray-500 p-2"
              />
              <Image
                height={80}
                width={80}
                src="/suitable-photos/jacket.webp"
                alt="fit-it-on-f-logo"
                className="border-1 border-gray-500 p-2 object-cover w-20 h-20"
              />
              <Image
                height={80}
                width={80}
                src="/suitable-photos/dress.webp"
                alt="fit-it-on-f-logo"
                className="border-1 border-gray-500 p-2"
              />
              <Image
                height={80}
                width={80}
                src="/suitable-photos/t-shirt.webp"
                alt="fit-it-on-f-logo"
                className="border-1 border-gray-500 p-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-red-500 flex items-center justify-center gap-1">
              <FaCircleXmark />
              Unsuitable Photos
            </h2>
            <p className="text-gray-500 text-center">
              Avoid using photos with multiple items, busy backgrounds or
              patterns, text overlays, folds, or any obstructions.
            </p>
            <div className="flex gap-2 items-center justify-center mt-2">
              <Image
                height={80}
                width={80}
                src="/unsuitable-photos/cover.webp"
                alt="fit-it-on-f-logo"
                className="border-1 border-gray-500 p-0 object-cover w-20 h-20"
              />
              <Image
                height={80}
                width={80}
                src="/unsuitable-photos/2-looks.webp"
                alt="fit-it-on-f-logo"
                className="border-1 border-gray-500 p-0  object-cover w-20 h-20"
              />
              <Image
                height={80}
                width={80}
                src="/unsuitable-photos/back-dress.webp"
                alt="fit-it-on-f-logo"
                className="border-1 border-gray-500 p-0 object-cover"
              />
              <Image
                height={80}
                width={80}
                src="/unsuitable-photos/models.webp"
                alt="fit-it-on-f-logo"
                className="border-1 border-gray-500 p-0  object-cover w-20 h-20"
              />
              <Image
                height={80}
                width={80}
                src="/unsuitable-photos/multi-items.webp"
                alt="fit-it-on-f-logo"
                className="border-1 border-gray-500 p-2"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
