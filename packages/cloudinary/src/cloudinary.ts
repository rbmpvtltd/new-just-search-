"use server";

import { v2 as cloudinary } from "cloudinary";

// const config = {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// };
//
// cloudinary.config(config);

export default cloudinary;

// import fs, { unlinkSync } from "fs";

import type { UploadApiResponse } from "cloudinary";
import { urlToWebP } from "./imageTransform";

export type MultiUploadOnCloudinaryFile = {
  filename: string;
  id: string | number;
};

function withTimeout<T>(promise: Promise<T>, ms = 30000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Upload timeout")), ms),
    ),
  ]);
}

const noCloudinary = true;

const multiUploadOnCloudinary = async (
  files: MultiUploadOnCloudinaryFile[],
  folderName = "",
  onlineUpload = false,
) => {
  if (!onlineUpload) {
    const customName = ``;

    const result = {
      public_id: customName,
    };

    return files.map((file) => ({
      id: file.id,
      public_id: result.public_id,
    }));
  }
  const uploadPromises = files.map(async (file) => {
    if (noCloudinary) {
      const public_id = await urlToWebP(file.filename, folderName);
      return {
        id: file.id,
        public_id,
      };
    }
    try {
      const cloudinaryData: UploadApiResponse = await withTimeout(
        cloudinary.uploader.upload(file.filename, {
          resource_type: "auto",
          folder: folderName,
        }),
        30_000, // 30 sec timeout
      );

      return {
        id: file.id,
        public_id: cloudinaryData.public_id,
      };
    } catch (error) {
      console.error("Upload failed:", file.id, error);

      return {
        id: file.id,
        public_id: "",
      };
    }
  });

  const allImageSettled = await Promise.allSettled(uploadPromises);
  console.log("All Images Settled");
  type Image = {
    id: string | number;
    public_id: string;
  };
  const allImages: Image[] = [];
  allImageSettled.forEach((o, i) => {
    if (o.status === "fulfilled") {
      allImages.push(o.value);
    } else {
      console.error(i, "reason", o.reason);
    }
  });

  return allImages;
};

const uploadOnCloudinary = async (
  localFilePath: string,
  folderName = "",
  uploadOnline = false,
) => {
  // if (!localFilePath) return null;
  try {
    if (!uploadOnline) {
      const customName = "";
      const result = {
        public_id: customName,
      };

      return result.public_id;
    }

    if (noCloudinary) {
      const public_id = await urlToWebP(localFilePath, folderName);
      return public_id;
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName,
    });

    console.log("cloudinaryData", result);

    return result.public_id;

    // Uncomment if you want to delete local file after upload
    // fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);
  } catch (err) {
    return "";
  }
};

const deleteOnCloudinary = async (cloudinary_url: string) => {
  try {
    if (!cloudinary_url) return null;
    const response = await cloudinary.uploader.destroy(cloudinary_url, {
      resource_type: "auto",
    });
    return response;
  } catch (error) {
    throw new Error(`cloudinary delete failed: ${error}`);
  }
};

export { uploadOnCloudinary, deleteOnCloudinary, multiUploadOnCloudinary };
