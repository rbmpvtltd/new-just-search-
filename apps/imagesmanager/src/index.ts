import fs from "node:fs";
import path from "node:path";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { Elysia, t } from "elysia";
import sharp from "sharp";

const app = new Elysia();
app
  .use(cors())
  .listen(3000)
  // 1. Serve static files from /public
  .use(staticPlugin())

  // 2. Route for uploading images
  .post(
    "/upload",
    async ({ body: { image, folder } }) => {
      // sanitize filename
      const safeName = image.name
        .replace(/\s+/g, "-")
        .toLowerCase()
        .split(".")[0];
      const fileName = `${Date.now()}-${safeName}.webp`;

      // ensure folder exists
      const uploadDir = path.join("public", folder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const imageBuffer = Buffer.from(await image.arrayBuffer());

      await sharp(imageBuffer)
        .webp({ quality: 80 })
        .toFile(path.join(uploadDir, fileName));

      return {
        success: true,
        public_id: `/${folder}/${fileName}`,
      };
    },
    {
      body: t.Object({
        image: t.File({
          type: "image",
          maxSize: "5m",
        }),
        folder: t.String(),
      }),
    },
  )
  .listen(5000);

console.log(`🚀 Server running at ${app.server?.hostname}:${app.server?.port}`);
