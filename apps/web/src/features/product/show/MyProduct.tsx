"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { OutputTrpcType } from "@/trpc/type";

export type MyProductsType =
  | OutputTrpcType["businessrouter"]["showProduct"]
  | null;
export default function MyProduct() {
  const trpc = useTRPC();
  const { data: myProducts, isLoading } = useQuery(
    trpc.businessrouter.showProduct.queryOptions(),
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 p-4">
      {myProducts?.products ? (
        myProducts.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className="text-center text-gray-500">No products found</p>
      )}
    </div>
  );
}

type ProductType = NonNullable<
  OutputTrpcType["businessrouter"]["showProduct"]
>["products"][number];

function ProductCard({ product }: { product: ProductType }) {
  const trpc = useTRPC();
  const { mutate: deleteProduct, isPending } = useMutation(
    trpc.businessrouter.deleteProduct.mutationOptions(),
  );

  return (
    <div className="bg-gray-100 rounded-2xl shadow-lg overflow-hidden flex sm:flex-row flex-col gap-4 p-4">
      <div className="flex justify-center sm:w-48">
        {product?.productPhotos?.[0]?.photo ? (
          <CldImage
            width="200"
            height="200"
            className="border rounded"
            src={product.productPhotos[0].photo}
            alt={product.productName}
          />
        ) : (
          <div className="flex items-center justify-center h-40 w-40 border rounded text-gray-400">
            No photo
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {product.productName}
          </h2>
          <p className="text-gray-600 mt-2">₹{product.rate}</p>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/business/product/edit/${product.productSlug}`}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>

          <Button
            onClick={() => {
              deleteProduct(
                { id: product.id },
                {
                  onSuccess: async (data) => {
                    console.log("data is", data);
                    if (!data?.success) {
                      console.warn(
                        "Delete product mutation returned no data:",
                        data,
                      );
                      return;
                    }

                    const queryClient = await getQueryClient();

                    await queryClient.invalidateQueries();

                    await Swal.fire({
                      title: "Deleted!",
                      icon: "success",
                      draggable: true,
                    });
                  },
                },
              );
            }}
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
  );
}
