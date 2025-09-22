import dotenv from "dotenv";
import {  } from "cloudinary";
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
    if (!test) {
      const customName = `${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
      const result = {
        secure_url: customName,
      };
      return result;
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName,
    });

    return result;

    // Uncomment if you want to delete local file after upload
    // fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);
  } catch (err) {
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
