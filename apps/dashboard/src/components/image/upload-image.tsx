// upload-image.tsx
"use client";
import { useCallback, useEffect, useState } from "react";
import ImageCropDialog from "./image-crop-dialog";

interface Area {
  x: number;
  y: number;
}

const CropperComponent = () => {
  const [crop, setCrop] = useState<Area>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [image, setImage] = useState<null | string>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Clean up object URL when image changes
  useEffect(() => {
    if (image) {
      return () => {
        URL.revokeObjectURL(image);
      };
    }
  }, [image]);

  // Clean up preview URL when preview changes
  useEffect(() => {
    if (previewUrl) {
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
  }, [previewUrl]);

  // Handle file selection
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPreviewUrl(null);
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const onCancel = useCallback(() => {
    setImage(null);
  }, []);

  const resetImage = useCallback((id: string) => {
    // No-op for standalone, dialog handles local reset
  }, []);

  const setCroppedImageFor = useCallback(
    (
      id: string,
      crop: Area,
      zoom: number,
      aspect: { value: number; text: string },
      croppedImageUrl: string,
    ) => {
      setPreviewUrl(croppedImageUrl);
      setImage(null);
    },
    [],
  );

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
          aspectInit={1}
          onCancel={onCancel}
          setCroppedImageFor={setCroppedImageFor}
          resetImage={resetImage}
        />
      )}

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Cropped preview"
          style={{ maxWidth: "300px", display: "block", margin: "20px 0" }}
        />
      )}
    </div>
  );
};

export default CropperComponent;
