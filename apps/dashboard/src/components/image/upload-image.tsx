// upload-image.tsx
"use client";
import { error } from "console";
import { CldImage } from "next-cloudinary";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ImageCropDialog from "./image-crop-dialog";

interface CropperProps {
  value: string;
  onChange: (imageUrl: string) => void;
}

const CropperComponent = ({ value, onChange }: CropperProps) => {
  const [image, setImage] = useState<null | string>(null);
  const firstTime = useRef(true);

  useEffect(() => {
    if (image) {
      return () => {
        URL.revokeObjectURL(image);
      };
    }
  }, [image]);

  useEffect(() => {
    if (value) {
      return () => {
        URL.revokeObjectURL(value);
      };
    }
  }, [value]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    firstTime.current = false;
    if (e.target.files && e.target.files.length > 0) {
      onChange("");
      const file = e.target.files[0];
      if (!file) return;
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      e.target.value = "";
    }
  };

  const onCancel = useCallback(() => {
    setImage(null);
  }, []);

  const resetImage = useCallback(() => {
    // No-op for standalone, dialog handles local reset
  }, []);

  const setCroppedImageFor = useCallback(
    (croppedImageUrl: string) => {
      onChange(croppedImageUrl);
      // setPreviewUrl(croppedImageUrl);
      setImage(null);
    },
    [onChange],
  );

  return (
    <>
      <div className="h-50 relative w-50 border rounded overflow-hidden">
        <input
          className="absolute opacity-0 inset-0 cursor-pointer z-10"
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />

        {!firstTime.current &&
          (value ? (
            // biome-ignore lint/performance/noImgElement: Using <img> is intentional here
            <img src={value} alt="Cropped preview" className="w-full h-full " />
          ) : (
            <span>no image</span>
          ))}

        {firstTime.current && value && (
          <CldImage
            width="100"
            height="100"
            className="border rounded p-4 w-full h-full"
            src={value}
            alt="Cloudinary image not loaded"
            onError={(error) =>
              console.error("Error loading Cloudinary image:", error)
            }
          />
        )}
      </div>

      {image && (
        <ImageCropDialog
          imageUrl={image}
          cropInit={{ x: 0, y: 0 }}
          zoomInit={1}
          aspectInit={1}
          onCancel={onCancel}
          setCroppedImageFor={setCroppedImageFor}
          resetImage={resetImage}
        />
      )}
    </>
  );
};

export default React.memo(CropperComponent);
