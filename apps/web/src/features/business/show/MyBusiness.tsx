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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">
            My Business Listing
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and update your active listings
          </p>
        </div>

        <div className="flex sm:flex-row flex-col gap-4 p-2">
          <div className=" pl-4 flex justify-center">
            {data.photo ? (
              <CldImage
                width="640"
                height="640"
                className="border rounded "
                src={data.photo}
                alt="cloudinary image not loaded"
              />
            ) : (
              <Image
                src="/images/no-image.png"
                width={100}
                height={100}
                alt="no image"
              />
            )}
          </div>

          <div className="flex-1 flex flex-col justify-start pl-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {data.name}
              </h2>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {data.area}, {data.city.city}
              </p>
            </div>

            <div className="mt-6 flex gap-2">
              <Link
                href={`/user/business/edit/${data.slug}`}
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
