import Cloudinary from "@/features/cloudinary";
import { HydrateClient } from "@/trpc/server";

export default function CloudinaryPage() {
  return (
    <HydrateClient>
      <Cloudinary />
    </HydrateClient>
  );
}
