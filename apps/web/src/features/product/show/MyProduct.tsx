"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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
  const offersData = myProducts?.products ?? [];

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
      {myProducts?.products ? (
        myProducts.products.map((product) => (
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
>["products"][number];

function ProductCard({ product }: { product: ProductType }) {
  const trpc = useTRPC();
  const { mutate: deleteProduct, isPending } = useMutation(
    trpc.productrouter.deleteProduct.mutationOptions(),
  );

  return (
    <div className="bg-gray-100 rounded-2xl shadow-lg overflow-hidden flex sm:flex-row flex-col gap-4 p-4">
      <div className="flex justify-center sm:w-48">
        {product?.mainImage ? (
          <CldImage
            width="200"
            height="200"
            className="border rounded"
            src={product.mainImage}
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
            href={`/profile/product/edit/${product.id}`}
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
