"use client";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";

export default function MyOffer() {
  const trpc = useTRPC();
  const { data: myOffers, isLoading } = useQuery(
    trpc.businessrouter.showOffer.queryOptions(),
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-6 bg-gray-100 px-4 py-3 font-semibold rounded-t-lg text-sm">
        <div>#</div>
        <div>Image</div>
        <div>Product Name</div>
        <div>Status</div>
        <div>Expires At</div>
        <div>Action</div>
      </div>

      {myOffers?.offers ? (
        myOffers.offers.map((offer, index) => (
          <OfferCard key={offer.id} offer={offer} index={index} />
        ))
      ) : (
        <p className="text-center text-gray-500">No products found</p>
      )}
    </div>
  );
}

type OfferType = NonNullable<
  OutputTrpcType["businessrouter"]["showOffer"]
>["offers"][number];
function OfferCard({ offer, index }: { offer: OfferType; index: number }) {
  const router = useRouter();

  const today = new Date();
  const end = new Date(offer.offerEndDate);

  const status = today <= end ? "Active" : "Expired";

  return (
    <div className="">
      <div
        key={offer.id}
        className="grid grid-cols-6 items-center px-4 py-3 border-b text-sm hover:bg-gray-50 transition"
      >
        <div>{index + 1}</div>

        <div>
          {offer?.offerPhotos?.[0]?.photo ? (
            <CldImage
              width="100"
              height="100"
              className="border rounded"
              src={offer.offerPhotos[0].photo}
              alt={offer.offerName}
            />
          ) : (
            <div className="flex items-center justify-center h-40 w-40 border rounded text-gray-400">
              No photo
            </div>
          )}
        </div>

        <div className="font-medium">{offer.offerName}</div>

        <div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </span>
        </div>

        <div>
          {offer.offerEndDate
            ? new Date(offer.offerEndDate).toLocaleDateString()
            : "—"}
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/user/offer/edit/${offer.offerSlug}`}>
            <Button size="icon" variant="secondary" className="cursor-pointer">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            size="icon"
            variant="outline"
            className="cursor-pointer hover:bg-red-500"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
