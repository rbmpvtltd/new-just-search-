import sharp from "sharp";

export async function urlToWebP(url: string, quality = 80) {
  const res = await fetch(url.trim());
  const outputName = url.split("/").pop()?.split(".")[0];
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const imageBytes = await res.bytes();
  sharp(imageBytes).webp({ quality }).toFile(`public/${outputName}.webp`);
  return `${outputName}.webp`;
}
