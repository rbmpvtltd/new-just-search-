"use server";

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(config);

export default cloudinary;

import fs, { unlinkSync } from "fs";

const uploadOnCloudinary = async (
  localFilePath: string,
  folderName = "",
  test = false,
) => {
  if (!localFilePath) return null;
  try {
    if (test) {
      const customName = `Banner/od5jlaui25sb8djl3mfc`;
      const result = {
        public_id: customName,
      };
      return result.public_id;
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName,
    });

    return result.public_id;

    // Uncomment if you want to delete local file after upload
    // fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);
  } catch (err) {
    console.log("errr", err);

    fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);
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

export { uploadOnCloudinary, deleteOnCloudinary };
