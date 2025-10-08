// Cloudinary.tsx

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";

interface CloudinaryProps {
  value?: string; // e.g., public_id or URL (for controlled behavior)
  onChange?: (publicId: string) => void; // or pass full result if needed
  // Optional: if you want to show existing image
}

export default function Cloudinary({ value, onChange }: CloudinaryProps) {
  const [resource, setResource] = useState<any>(null);

  // If `value` is provided (e.g., from form), try to show it
  // Note: Cloudinary doesn't re-upload just because value exists — only on button click

  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.cloudinarySign.uploadImage.mutationOptions(),
  );

  const handleUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dra2pandx",
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ?? "322325555249722",
        uploadSignature: (
          callback: (result: { signature: string }) => void,
          paramsToSign: { timestamp: number; source: string },
        ) => {
          mutate(
            { paramsToSign },
            {
              onSuccess: (data) => callback({ signature: data.signature }),
              onError: (err) => console.error("Signature error:", err),
            },
          );
        },
      },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          const info = result.info;
          setResource(info);

          // Notify parent — usually we send public_id for storage
          if (onChange) {
            onChange(info.public_id); // or info.secure_url if you prefer URL
          }
        }
      },
    );

    widget.open();
  };

  // If `value` is a public_id, you can reconstruct URL (optional)
  const imageUrl = value
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${value}`
    : resource?.secure_url;

  return (
    <div className="w-full">
      <button type="button" onClick={handleUpload}>
        {value ? "Change Image" : "Upload Image"}
      </button>

      {imageUrl && (
        <div className="mt-2">
          <Image
            src={imageUrl}
            alt="Preview"
            width={200}
            height={200}
            unoptimized
          />
        </div>
      )}
    </div>
  );
}
