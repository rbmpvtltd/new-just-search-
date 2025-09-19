import Cloudinary from "@/features/cloudinary";
import { HydrateClient } from "@/trpc/server";
import { trpcServer } from "@/trpc/trpc-server";

export default async function CloudinaryPage() {
  await trpcServer.test.addImage.query();
  return (
    <HydrateClient>
      <Cloudinary />
    </HydrateClient>
  );
}
