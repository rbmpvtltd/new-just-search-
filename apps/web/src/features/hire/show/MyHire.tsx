"use client";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { CheckCircle, Eye, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { sweetAlertError, sweetAlertSuccess } from "@/lib/sweetalert";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { OutputTrpcType } from "@/trpc/type";

type MyHireType = OutputTrpcType["hirerouter"]["show"];
export default function MyHire({ data }: { data: MyHireType }) {
  const trpc = useTRPC();
  const router = useRouter();
  const { mutate, isPending } = useMutation(
    trpc.hirerouter.delete.mutationOptions({
      onSuccess: (data) => {
        if (data.success) {
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({
            queryKey: trpc.hirerouter.show.queryKey(),
          });

          sweetAlertSuccess(
            data.message || "Hire listing deleted successfully",
          );
          router.push("/");
        }
        console.log("deleted");
      },
      onError: (err) => {
        if (isTRPCClientError(err)) {
          sweetAlertError(err.message);
        }
      },
    }),
  );

  const handleDelete = () => {
    mutate();
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-100 to-gray-200 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">My Hire Listing</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and update your active listings
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6">
          <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-lg overflow-hidden border shadow-sm bg-gray-50">
            {data.photo ? (
              // <CldImage
              //   width="640"
              //   height="640"
              //   className="w-full h-full object-cover"
              //   src={data.photo}
              //   alt="cloudinary image not loaded"
              // />
              <Image
                unoptimized
                width="640"
                height="640"
                className="w-full h-full object-cover"
                src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL}/public${data.photo}`}
                alt="cloudinary image not loaded"
              />
            ) : (
              "no photo"
            )}
          </div>

          <div className="flex-1 flex flex-col justify-start pl-4">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <span>{data?.name}</span>
                {data.status === "Approved" && (
                  <CheckCircle
                    size={26}
                    className="text-green-500"
                    aria-label="Verified"
                  />
                )}
              </h2>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {[data?.address, data?.city?.city, data?.state?.name]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div className="mt-6 flex gap-2">
              <Link
                href={`/profile/hire/edit/${data.id}`}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Link>
              <Button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm"
              >
                <Eye className="w-4 h-4" />
                View
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isPending}
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm"
              >
                {isPending ? (
                  <>
                    <Spinner /> Deleting...
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
