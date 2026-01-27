import { staticPlugin } from "@elysiajs/static";
import { Elysia, t } from "elysia";

const app = new Elysia()
  // 1. Serve static files from /public
  .use(staticPlugin())

  // 2. Route for uploading images
  .post(
    "/upload",
    async ({ body: { image } }) => {
      // Generate a unique filename or use the original name
      const fileName = `${Date.now()}-${image.name}`;
      const path = `./public/uploads/${fileName}`;

      // Bun.write is an optimized way to save files to disk
      await Bun.write(path, image);

      return {
        success: true,
        url: `/uploads/${fileName}`,
      };
    },
    {
      // Validation: ensures the 'image' field is a file
      body: t.Object({
        image: t.File({
          type: "image/*", // Constraints to image types only
          maxSize: "5m", // Optional: limit to 5MB
        }),
      }),
    },
  )
  .listen(3000);

console.log(`🚀 Server running at ${app.server?.hostname}:${app.server?.port}`);
