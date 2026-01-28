import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
export async function urlToWebP(url: string, folderName: string, quality = 80) {
  const uploadDir = path.join("public", folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const res = await fetch(url.trim());
  const outputName = url.split("/").pop()?.split(".")[0];
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const imageBytes = await res.bytes();
  sharp(imageBytes).webp({ quality }).toFile(`${uploadDir}/${outputName}.webp`);
  return `${uploadDir}/${outputName}.webp`;
}
