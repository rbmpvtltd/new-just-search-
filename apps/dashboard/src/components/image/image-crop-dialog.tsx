// image-crop-dialog.tsx
import type React from "react";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./crop-image";
import "./cropper.css";
import { Button } from "../ui/button";

export interface Area {
  x: number;
  y: number;
}

export interface PixelArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AspectRatio {
  value: number;
  text: string;
}

interface ImageCropDialogProps {
  imageUrl: string;
  cropInit: Area;
  zoomInit: number;
  aspectInit: number | AspectRatio;
  onCancel: () => void;
  setCroppedImageFor: (croppedImageUrl: string) => void;
  resetImage: () => void;
}

const aspectRatios: AspectRatio[] = [
  { value: 1, text: "1/1" },
  { value: 4 / 3, text: "4/3" },
  { value: 16 / 9, text: "16/9" },
  { value: 1 / 2, text: "1/2" },
] as const;

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
  imageUrl,
  cropInit,
  zoomInit,
  aspectInit,
  onCancel,
  setCroppedImageFor,
  resetImage,
}) => {
  const initialZoom = zoomInit ?? 1;
  const initialCrop: Area = cropInit ?? { x: 0, y: 0 };
  let initialAspect = aspectRatios[1] as AspectRatio;
  if (typeof aspectInit === "number") {
    const matching = aspectRatios.find(
      (r) => Math.abs(r.value - aspectInit) < 0.01,
    );
    initialAspect = matching || {
      value: aspectInit,
      text: `${Math.round(aspectInit * 100) / 100}`,
    };
  } else {
    initialAspect = aspectInit;
  }

  const [zoom, setZoom] = useState(initialZoom);
  const [crop, setCrop] = useState(initialCrop);
  const [aspect, setAspect] = useState(initialAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelArea | null>(
    null,
  );

  const onCropChange = useCallback((newCrop: Area) => {
    setCrop(newCrop);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onAspectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = parseFloat(e.target.value);
      const ratio = aspectRatios.find((r) => r.value === value);
      if (ratio) {
        setAspect(ratio);
      }
    },
    [],
  );

  const onCropComplete = useCallback(
    (_: Area, newCroppedAreaPixels: PixelArea) => {
      setCroppedAreaPixels(newCroppedAreaPixels);
    },
    [],
  );

  const onCrop = useCallback(async () => {
    if (!croppedAreaPixels) {
      return;
    }
    const croppedImageUrl = await getCroppedImg(
      imageUrl,
      croppedAreaPixels,
      0,
      aspect.value === 1,
    );
    if (croppedImageUrl) {
      setCroppedImageFor(croppedImageUrl);
    }
  }, [imageUrl, croppedAreaPixels, aspect, setCroppedImageFor]);

  const onResetImage = useCallback(() => {
    setCrop(initialCrop);
    setZoom(initialZoom);
    setAspect(initialAspect);
    setCroppedAreaPixels(null);
    resetImage();
  }, [initialCrop, initialZoom, initialAspect, resetImage]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <div>
      <div className="backdrop"></div>
      <div className="crop-container">
        <Cropper
          image={imageUrl}
          zoom={zoom}
          crop={crop}
          aspect={aspect.value}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="controls">
        <div className="controls-upper-area">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              onZoomChange(parseFloat(e.target.value));
            }}
            className="slider"
          />
          <select onChange={onAspectChange}>
            {aspectRatios.map((ratio) => (
              <option
                key={ratio.text}
                value={ratio.value.toString()}
                selected={ratio.value === aspect.value}
              >
                {ratio.text}
              </option>
            ))}
          </select>
        </div>
        <div className="button-area">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={onResetImage}>Reset</Button>
          <Button onClick={onCrop}>Crop</Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropDialog;
