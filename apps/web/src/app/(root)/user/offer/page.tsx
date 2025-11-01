import Link from "next/link";
import { Button } from "@/components/ui/button"; // assuming shadcn/ui or similar
import MyOffer from "@/features/offer/show/MyOffer";

export default function page() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Offers</h1>
        <Link href="/user/offer/add">
          <Button>Add Offer</Button>
        </Link>
      </div>

      <MyOffer />
    </div>
  );
}
