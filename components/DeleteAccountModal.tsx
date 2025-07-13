"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaExclamationTriangle } from "react-icons/fa";

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (url?: string | null) => Promise<void>;
  plan?: string | undefined;
  deleteImage?: boolean;
}

export function DeleteAccountModal({
  open,
  onOpenChange,
  onConfirm,
  plan,
  deleteImage = false,
}: DeleteAccountModalProps) {
  const isPaid = plan !== "Free";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <FaExclamationTriangle className="h-5 w-5" />
            {deleteImage ? <>Delete Image ?</> : <>Confirm Account Deletion</>}
          </DialogTitle>
          <DialogDescription>
            {deleteImage ? (
              <>
                Are you sure you want to <strong>permanently</strong> delete
                this image? This action cannot be undone.
              </>
            ) : isPaid ? (
              <>
                You are currently on the <strong>{plan}</strong> plan. Deleting
                your account will{" "}
                <strong>permanently remove your subscription.</strong> This
                action cannot be undone.
              </>
            ) : (
              <>
                You are currently on the free plan. Deleting your account will
                permanently remove your data. This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {deleteImage ? (
              <>Yes, delete image</>
            ) : (
              <>Yes, I’m sure. Delete my account</>
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            {deleteImage ? <>No, cancel</> : <>No, keep my account</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
