"use client";
import { useMutation } from "@tanstack/react-query";
import { Eye, Pencil, Trash } from "lucide-react";
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
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({
            queryKey: trpc.hirerouter.show.queryKey(),
          });

          await Swal.fire({
            title: "Deleted!",
            icon: "success",
            draggable: true,
          });
        }
        router.push("/");
        console.log("deleted");
      },
      onError: (err) => {
        console.error(err);
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
          <h1 className="text-2xl font-bold text-gray-800">
            My Business Listing
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and update your active listings
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6">
          <div className="flex justify-center sm:justify-start sm:w-1/4">
            <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-lg overflow-hidden border shadow-sm bg-gray-50">
              {data.photo ? (
                <CldImage
                  width="640"
                  height="640"
                  className="w-full h-full object-cover"
                  src={data.photo}
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
            </div>
          </div>

          <div className="">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {data.name}
              </h2>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {data.area}, {data.city.city}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {/* We make a shared class for all */}
              <Link
                href={`/profile/business/edit/${data.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg shadow-sm font-medium px-4 py-2 text-white bg-emerald-500 hover:bg-emerald-600 transition-colors h-10"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Link>

              <Button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg shadow-sm font-medium px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 transition-colors h-10"
              >
                <Eye className="w-4 h-4" />
                View
              </Button>

              <Button
                onClick={handleDelete}
                disabled={isPending}
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg shadow-sm font-medium px-4 py-2 text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-70 h-10"
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
