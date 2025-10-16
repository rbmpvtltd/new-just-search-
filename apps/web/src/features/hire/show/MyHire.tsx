"use client"
import { logger } from "@repo/helper";
import { useMutation } from "@tanstack/react-query";
import { Eye, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";

type MyHireType = OutputTrpcType["hirerouter"]["show"];
export default function MyHire({ data }: { data: MyHireType }) {
  const trpc = useTRPC();

  const { mutate, isPending } = useMutation(
    trpc.hirerouter.delete.mutationOptions({
      onSuccess: () => {
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
          <h1 className="text-2xl font-bold text-gray-800">My Hire Listing</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and update your active listings
          </p>
        </div>

        <div className="flex sm:flex-row flex-col gap-4 p-2">
          <div className=" pl-4 flex justify-center">
            <Image
              src="https://www.justsearch.net.in/assets/images/17014923821760515259.png"
              alt="Hire Listing"
              className="sm:w-60 w-full h-60 object-cover rounded-xl shadow-md border border-gray-200"
              width={640}
              height={640}
              //   loading="lazy"
            />
          </div>

          <div className="flex-1 flex flex-col justify-start pl-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {data.name}
              </h2>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {data.area}, {data.city}
              </p>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                type="button"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
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
                <Trash className="w-4 h-4" />
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
