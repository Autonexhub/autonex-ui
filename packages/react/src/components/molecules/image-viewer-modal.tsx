import { Dialog, DialogContent } from "../ui/dialog";
import { X, DownloadSimple as Download, WarningCircle as AlertCircle } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { useState } from "react";

export interface ImageViewerModalLabels {
  defaultAlt: string;
  download: string;
  loadError: string;
}

const DEFAULT_LABELS: ImageViewerModalLabels = {
  defaultAlt: "Imagen",
  download: "Descargar imagen",
  loadError: "No se pudo cargar la imagen",
};

export interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt?: string;
  labels?: Partial<ImageViewerModalLabels>;
}

export const ImageViewerModal = ({
  isOpen,
  onClose,
  imageUrl,
  imageAlt,
  labels,
}: ImageViewerModalProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };
  const resolvedAlt = imageAlt ?? l.defaultAlt;
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageUrl.split("/").pop() || "imagen.jpg";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setImageError(false);
      setImageLoading(true);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black/95 border-border"> {/* design-ok: visor de imagen — el relleno enmarcaría la foto */}
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <span className="text-sm text-white/90">{resolvedAlt}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="h-8 w-8 text-white/90 hover:bg-white/10 hover:text-white"
              title={l.download}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenChange(false)}
              className="h-8 w-8 text-white/90 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex items-center justify-center w-full h-full min-h-[400px] p-12">
          {imageLoading && !imageError && (
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            </div>
          )}

          {imageError && (
            <div className="flex flex-col items-center gap-3 text-white/70">
              <AlertCircle className="h-12 w-12" />
              <p className="text-sm">{l.loadError}</p>
              <p className="text-xs text-white/50 max-w-md text-center break-all">
                {imageUrl}
              </p>
            </div>
          )}

          {!imageError && (
            <img
              src={imageUrl}
              alt={resolvedAlt}
              className={`max-w-full max-h-full object-contain ${imageLoading ? "hidden" : ""}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
