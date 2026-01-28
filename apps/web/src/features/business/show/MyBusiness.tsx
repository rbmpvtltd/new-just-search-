"use client";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Eye, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { OutputTrpcType } from "@/trpc/type";

type MyBusinessType = OutputTrpcType["businessrouter"]["show"];
export default function MyBusiness({ data }: { data: MyBusinessType }) {
  const trpc = useTRPC();
  const router = useRouter();
  const { mutate, isPending } = useMutation(
    trpc.businessrouter.delete.mutationOptions({
      onSuccess: async (data) => {
        if (data.success) {
          await Swal.fire({
            title: "Deleted!",
            icon: "success",
            draggable: true,
          });
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({
            queryKey: trpc.businessrouter.show.queryKey(),
          });
          router.push("/");
        }
      },
      onError: (err) => {
        console.error(err);
      },
    }),
  );

  const handleDelete = () => {
    mutate();
  };
  const fullAddress = [
    data.buildingName,
    data.streetName,
    data.landmark,
    data?.address,
    data?.city,
    data?.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 to-gray-200 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900">
            My Business Listing
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and update your active listings
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 p-5 sm:p-6">
          <div className="flex justify-center sm:justify-start sm:w-1/3">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-xl overflow-hidden border bg-gray-50 shadow-sm">
              {data?.photo ? (
                <Image
                  unoptimized
                  width="640"
                  height="640"
                  className="w-full h-full object-cover"
                  src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL}/public${data?.photo}`}
                  alt="Business image"
                />
              ) : (
                <Image
                  src="/images/no-image.png"
                  alt="No image"
                  width={256}
                  height={256}
                  className="w-full h-full object-contain bg-gray-100"
                />
              )}

              <div className="absolute top-3 left-3">
                {data?.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 text-xs font-medium px-2 py-1">
                    <CheckCircle size={14} />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {data?.name}
              </h2>

              <p className="mt-2 flex items-start gap-2 text-gray-600 leading-relaxed">
                <span className="mt-1 text-gray-400">📍</span>
                {fullAddress}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={`/profile/business/edit/${data?.id}`}
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm transition"
              >
                <Pencil className="w-4 h-4" />
                Edit Listing
              </Link>

              <Button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm transition"
              >
                <Eye className="w-4 h-4" />
                View
              </Button>

              <Button
                onClick={handleDelete}
                disabled={isPending}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 shadow-sm transition disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Spinner /> Deleting…
                  </>
                ) : (
                  <>
                    <Trash className="w-4 h-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
