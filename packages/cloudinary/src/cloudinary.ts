"use server";

import { v2 as cloudinary } from "cloudinary";

const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(config);

export default cloudinary;

// import fs, { unlinkSync } from "fs";

import type { UploadApiResponse } from "cloudinary";

export type MultiUploadOnCloudinaryFile = {
  filename: string;
  id: string | number;
};

const multiUploadOnCloudinary = async (
  files: MultiUploadOnCloudinaryFile[],
  folderName = "",
  test = false,
) => {
  if (test) {
    const customName = `Banner/cbycmehjeetyxbuxc6ie`;

    const result = {
      public_id: customName,
    };

    return files.map((file) => ({
      id: file.id,
      public_id: result.public_id,
    }));
  }
  const uploadPromises = files.map(async (file) => {
    const cloudinaryData: UploadApiResponse = await cloudinary.uploader.upload(
      file.filename,
      {
        resource_type: "auto",
        folder: folderName,
      },
    );

    console.log("cloudinaryData", cloudinaryData);

    return {
      id: file.id,
      public_id: cloudinaryData.public_id,
    };
  });

  return Promise.all(uploadPromises);
};

const uploadOnCloudinary = async (
  localFilePath: string,
  folderName = "",
  test = false,
) => {
  // if (!localFilePath) return null;
  try {
    if (test) {
      const customName = `Banner/cbycmehjeetyxbuxc6ie`;
      const result = {
        public_id: customName,
      };

      return result.public_id;
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
    console.log("errr", err);

    // Uncomment if you are using localFilePath not url
    // fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);
    throw new Error(`Cloudinary upload failed: ${err}`);
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
