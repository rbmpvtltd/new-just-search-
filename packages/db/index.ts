import fs from "node:fs";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import cloudinary from "./configs/cloudinary.config"; // 👈 Use centralized config

const pool = new Pool({
  host: process.env.PGHOST ?? "localhost",
  port: +(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD ?? "12345678",
  database: process.env.PGDATABASE ?? "justsearch",
});

const uploadOnCloudinary = async (localFilePath: string, folderName = "") => {
  if (!localFilePath) return null;
  try {
    // TODO: Uncomment this in production
    // const result = await cloudinary.uploader.upload(localFilePath, {
    //   resource_type: 'auto',
    //   folder: folderName,
    // });
    //
    const customName = `${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
    const result = {
      secure_url: customName,
    };

    console.log(" Upload success:", result.secure_url);

    // Uncomment if you want to delete local file after upload
    // fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);

    return result;
  } catch (err: any) {
    console.error("Cloudinary upload failed:", err);
    fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);
    return null;
  }
};
``;

const deleteOnCloudinary = async (cloudinary_url: any) => {
  try {
    if (!cloudinary_url) return null;
    const response = await cloudinary.uploader.destroy(cloudinary_url, {
      resource_type: "auto",
    });
    return response;
  } catch (error) {
    throw new Error(`cannot delete file in cloudinary ${error}`);
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };

export const db = drizzle({ client: pool });

export * from "./schema/address.schema";
