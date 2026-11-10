import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
// El CSS de react-image-crop (`react-image-crop/dist/ReactCrop.css`) lo importa el consumidor.
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CircleNotch as Loader2 } from "@phosphor-icons/react";

export interface ImageCropModalLabels {
  title: string;
  description: string;
  imageAlt: string;
  cancel: string;
  processing: string;
  save: string;
}

export const DEFAULT_IMAGE_CROP_MODAL_LABELS: ImageCropModalLabels = {
  title: "Recortar Imagen",
  description: "Ajusta el área de recorte para tu foto de perfil (cuadrada, 400x400px)",
  imageAlt: "Imagen a recortar",
  cancel: "Cancelar",
  processing: "Procesando...",
  save: "Guardar",
};

export interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  labels?: Partial<ImageCropModalLabels>;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export const ImageCropModal = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  labels: labelsProp,
}: ImageCropModalProps) => {
  const labels = { ...DEFAULT_IMAGE_CROP_MODAL_LABELS, ...labelsProp };
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [processing, setProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1)); // 1:1 aspect ratio for square
  }, []);

  const getCroppedImg = async (): Promise<Blob | null> => {
    if (!completedCrop || !imgRef.current) {
      return null;
    }

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    // Calculate the scale between displayed size and natural size
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set output size to 400x400 max
    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw the cropped image onto the canvas, scaling to 400x400
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      outputSize,
      outputSize
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.9 // Quality
      );
    });
  };

  const handleCropComplete = async () => {
    setProcessing(true);
    try {
      const croppedBlob = await getCroppedImg();
      if (croppedBlob) {
        onCropComplete(croppedBlob);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {labels.description}
          </p>

          <div className="max-h-[400px] overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop={false}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt={labels.imageAlt}
                onLoad={onImageLoad}
                style={{ maxHeight: "400px", maxWidth: "100%" }}
              />
            </ReactCrop>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={processing}>
            {labels.cancel}
          </Button>
          <Button onClick={handleCropComplete} disabled={processing || !completedCrop}>
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {labels.processing}
              </>
            ) : (
              labels.save
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
