"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
      <DialogContent className="sm:max-w-4xl overflow-y-auto flex flex-col rounded-lg">
        <DialogTitle className="hidden"></DialogTitle>
        <div className="flex items-center justify-center mx-auto flex-col max-w-6xl gap-6">
          <div className="relative w-full h-auto">
            <Image
              src="/suitable-photos/person-photo-type.webp"
              alt="Person photo type guide"
              width={1200}
              height={0}
              sizes="100vw"
              className="border border-gray-500 p-2 h-auto w-full"
            />
          </div>
          <div className="relative w-full h-auto">
            <Image
              src="/suitable-photos/garment-photo-type.webp"
              alt="Garment photo type guide"
              width={1200}
              height={0}
              sizes="100vw"
              className="border border-gray-500 p-2 h-auto w-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
