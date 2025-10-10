// image-crop-dialog.tsx
import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./crop-image";
import "./cropper.css";
import { Button } from "../ui/button";

const aspectRatios = [
  { value: 4 / 3, text: "4/3" },
  { value: 16 / 9, text: "16/9" },
  { value: 1 / 2, text: "1/2" },
];

const ImageCropDialog = ({
  id,
  imageUrl,
  cropInit,
  zoomInit,
  aspectInit,
  onCancel,
  setCroppedImageFor,
  resetImage,
}) => {
  // Set default values properly
  const [zoom, setZoom] = useState(zoomInit ?? 1);
  const [crop, setCrop] = useState(cropInit ?? { x: 0, y: 0 });
  const [aspect, setAspect] = useState(aspectInit ?? aspectRatios[0].value);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onAspectChange = (e) => {
    const value = parseFloat(e.target.value);
    setAspect(value);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onCrop = async () => {
    if (!croppedAreaPixels) return;
    const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels);
    setCroppedImageFor(id, crop, zoom, aspect, croppedImageUrl);
  };

  const onResetImage = () => {
    resetImage(id);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div>
      <div className="backdrop"></div>
      <div className="crop-container">
        <Cropper
          image={imageUrl}
          zoom={zoom}
          crop={crop}
          aspect={aspect}
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
            onChange={(e) => {
              onZoomChange(parseFloat(e.target.value));
            }}
            className="slider"
          />
          <select value={aspect} onChange={onAspectChange}>
            {aspectRatios.map((ratio) => (
              <option key={ratio.text} value={ratio.value}>
                {ratio.text}
              </option>
            ))}
          </select>
        </div>
        <div className="button-area">
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onResetImage}>Reset</Button>
          <Button onClick={onCrop}>Crop</Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropDialog;
