"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { sweetAlertSuccess } from "@/lib/sweetalert";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { OutputTrpcType } from "@/trpc/type";

export default function MyProduct() {
  const [page, setPage] = useState<number | null | undefined>(0); // current page cursor
  const [prevCursors, setPrevCursors] = useState<number[]>([]); // store previous cursors
  const trpc = useTRPC();
  const {
    data: myProducts,
    isLoading,
    isFetching,
  } = useQuery(
    trpc.productrouter.showProduct.queryOptions({
      cursor: page ?? 0,
      limit: 10,
    }),
  );
  const productData = myProducts?.productData ?? [];

  const handleNext = () => {
    setPrevCursors((prev) => [...prev, page ?? 0]);
    setPage(myProducts?.nextCursor);
  };

  const handlePrev = () => {
    const lastCursor = prevCursors[prevCursors.length - 1];
    setPrevCursors((prev) => prev.slice(0, -1));
    setPage(lastCursor ?? 0);
  };
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 p-4">
      {myProducts?.productData ? (
        myProducts.productData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className="text-center text-gray-500">No products found</p>
      )}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          disabled={prevCursors.length === 0 || isFetching}
          onClick={handlePrev}
        >
          Previous
        </Button>
        <Button
          disabled={!myProducts?.nextCursor || isFetching}
          onClick={handleNext}
        >
          {isFetching ? (
            <>
              <Spinner /> Loading...
            </>
          ) : (
            "Next "
          )}
        </Button>
      </div>
    </div>
  );
}

type ProductType = NonNullable<
  OutputTrpcType["productrouter"]["showProduct"]
>["productData"][number];

function ProductCard({ product }: { product: ProductType }) {
  const trpc = useTRPC();
  const { mutate: deleteProduct, isPending } = useMutation(
    trpc.productrouter.deleteProduct.mutationOptions(),
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4 flex flex-col sm:flex-row gap-5">
      {/* Image */}
      <div className="flex justify-center sm:justify-start sm:w-44">
        <div className="w-40 h-40 rounded-xl overflow-hidden border bg-gray-50 flex items-center justify-center">
          {product?.mainImage ? (
            <CldImage
              width="200"
              height="200"
              className="w-full h-full object-cover"
              src={product.mainImage}
              alt={product.productName}
            />
          ) : (
            <span className="text-sm text-gray-400">No image</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Info */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {product.productName}
          </h2>

          <p className="mt-1 text-lg font-medium text-emerald-600">
            ₹{product.rate}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/profile/product/edit/${product.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm transition"
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
                    if (data?.success) {
                      sweetAlertSuccess(data.message);
                      const queryClient = getQueryClient();
                      queryClient.invalidateQueries({
                        queryKey: trpc.productrouter.showProduct.queryKey(),
                      });
                    }
                  },
                },
              );
            }}
            disabled={isPending}
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 shadow-sm transition disabled:opacity-60"
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
  );
}
