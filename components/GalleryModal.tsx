import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useReuseStore } from "@/stores/useReuseStore";
import { toast } from "sonner";
import { TOAST_CONFIG } from "@/lib/utils";

interface GalleryModalProps {
  open: "person" | "garment" | null;
  onOpenChange: (open: "person" | "garment" | null) => void;
  images: string[];
  type: "person" | "garment";
}

export function GalleryModal({
  open,
  onOpenChange,
  images,
  type,
}: GalleryModalProps) {
  if (!open) return null;

  const { setReuseTarget } = useReuseStore();

  const handleChooseImage = (url: string) => {
    setReuseTarget(url, type);
    onOpenChange(null);
    toast("Image chosen successfully!", { ...TOAST_CONFIG.success });
  };
  const filteredImages = images.filter(
    (url) => !url.includes(".emptyFolderPlaceholder")
  );

  return (
    <Dialog
      open={!!open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onOpenChange(null);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto flex flex-col rounded-lg p-8">
        <DialogTitle className="hidden">{type} Gallery</DialogTitle>
        {filteredImages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No saved {type} images yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((url, i) => (
              <div
                key={i}
                className="relative w-full pb-[100%] cursor-pointer rounded-md overflow-hidden border border-gray-300 hover:ring-2 hover:ring-primary transition"
                onClick={() => handleChooseImage(url)}
              >
                <img
                  src={url}
                  alt={`Gallery image ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
