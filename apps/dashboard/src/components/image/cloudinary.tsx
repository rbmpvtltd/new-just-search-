"use client";

import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

function isBlobUrl(url: string) {
  try {
    return new URL(url).protocol === "blob:";
  } catch (_) {
    return false;
  }
}

export const uploadToCloudinary = async (
  files: (string | null | undefined)[],
  folder: string = "unknown",
  tags: string = "",
  eager: string = "c_pad,h_300,w_400|c_crop,h_200,w_260",
): Promise<(string | null)[]> => {
  const signResponse = await asyncHandler(
    trpcServer.cloudinarySignature.signUploadForm.query({
      eager,
      folder,
      tags,
    }),
  );

  const uploadPromises: Promise<string | null>[] = [];

  for (let i = 0; i < files.length; i++) {
    const fileUrl = files[i];
    if (!fileUrl) {
      uploadPromises.push(Promise.resolve(null));
      continue;
    }

    if (!isBlobUrl(fileUrl)) {
      uploadPromises.push(Promise.resolve(fileUrl));
      continue;
    }

    if (signResponse.error || !signResponse.data) {
      uploadPromises.push(Promise.resolve(fileUrl));
      continue;
    }
    const url = `https://api.cloudinary.com/v1_1/${signResponse.data.cloudname}/auto/upload`;
    // Fetch the blob from the blob URL
    const blobResponse = await fetch(fileUrl);
    const blob = await blobResponse.blob();

    // Determine type and extension from blob
    const type = blob.type || "image/jpeg";
    const ext = type.split("/")[1] || "jpg";
    const timestamp = Date.now();
    const fileName = `${timestamp}_${Math.floor(Math.random() * 10000)}.${ext}`;

    const formData = new FormData();
    formData.append("file", blob, fileName);
    formData.append("api_key", signResponse.data.apikey);
    formData.append("timestamp", signResponse.data.timestamp.toString());
    formData.append("signature", signResponse.data.signature);
    formData.append("eager", eager);
    formData.append("folder", folder);
    formData.append("tags", signResponse.data.tags);

    const uploadPromise = fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.public_id) {
          return data.public_id;
        } else {
          throw new Error(`Upload failed: ${JSON.stringify(data)}`);
        }
      })
      .catch((error) => {
        console.error("Upload error:", error);
        throw error;
      });

    uploadPromises.push(uploadPromise);
  }

  try {
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    console.error("One or more uploads failed:", error);
    return []; // Return empty array or handle as needed
  }
};
