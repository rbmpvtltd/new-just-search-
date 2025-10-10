"use client";
import { useCallback, useEffect, useState } from "react";
import ImageCropDialog from "./image-crop-dialog";

interface Area {
  x: number;
  y: number;
}

interface PixelArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CropperComponent = () => {
  const [crop, setCrop] = useState<Area>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [image, setImage] = useState<null | string>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelArea>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Clean up object URL when image changes
  useEffect(() => {
    if (image) {
      return () => {
        URL.revokeObjectURL(image);
      };
    }
  }, [image]);

  // Handle file selection
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: PixelArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
      console.log(croppedArea, croppedAreaPixels);
    },
    [],
  );

  const handleSaveCrop = useCallback(async () => {
    if (
      !image ||
      croppedAreaPixels.width === 0 ||
      croppedAreaPixels.height === 0
    )
      return;

    const imageElement = new Image();
    imageElement.src = image;
    await new Promise((resolve, reject) => {
      imageElement.onload = () => resolve(null);
      imageElement.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const cropX = croppedAreaPixels.x;
    const cropY = croppedAreaPixels.y;
    const cropWidth = croppedAreaPixels.width;
    const cropHeight = croppedAreaPixels.height;

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingQuality = "high";

    // For round crop, clip to circle (assuming square bounding box)
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      cropWidth / 2,
      cropHeight / 2,
      Math.min(cropWidth, cropHeight) / 2,
      0,
      2 * Math.PI,
    );
    ctx.clip();

    ctx.drawImage(
      imageElement,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );
    ctx.restore();

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cropped-image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [image, croppedAreaPixels]);

  return (
    <div>
      {/* File input to select image */}
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ marginBottom: "20px" }}
      />

      {/* Cropper component - only show when image is selected */}
      {image && (
        <ImageCropDialog
          id="12"
          imageUrl={image}
          cropInit={crop}
          zoomInit={zoom}
          aspectInit={4 / 3}
          onCancel
          setCroppedImageFor
          resetImage
        />
      )}
    </div>
  );
};

export default CropperComponent;
