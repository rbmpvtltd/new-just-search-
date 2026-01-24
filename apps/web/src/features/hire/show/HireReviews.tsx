"use client";
import LoginRedirect from "@/components/LoginRedirect";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import React from "react";
import { ReviewForm } from "./component/ReviewForm";
import type { OutputTrpcType } from "@/trpc/type";
import { FaRegCalendarAlt } from "react-icons/fa";

type HireReviews = {
  id: number;
  created_at: Date | null;
  message: string;
  user: string | null;
  photo : string | null;
}

function HireReviews({
  hireId,
  name,
  reviews,
}: {
  hireId: number;
  name: string;
  reviews: HireReviews[];
}) {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.verifyauth.queryOptions());
  const { data: submmited } = useQuery(
    trpc.hirerouter.ReviewSubmitted.queryOptions({
      hireId: hireId,
    }),
  );
  console.log(reviews)
  return (
    <div>
      <div className="p-4 flex flex-col md:flex-row mx-auto w-full gap-8 ">
        {data?.success && (
          <div className="md:w-[30%] w-[90%]">
            {submmited?.submitted && (
              <Card className="border-green-200 pt-4 bg-green-50/50">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-green-900">
                        Review Already Submitted
                      </CardTitle>
                      <CardDescription className="text-green-700 mt-1">
                        Thank you for sharing your feedback! You've already
                        submitted a review for this business.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}
            {!submmited?.submitted && <ReviewForm hireId={hireId} />}
          </div>
        )}
        {!data?.success && <LoginRedirect />}
        <div className="md:w-[60%] w-[90%]">
          <h1 className="text-2xl font-semibold text-secondary">
            Recommended Reviews
          </h1>
          {reviews.length === 0 && (
            <div className="mx-auto bg-primary-accent px-6 py-4 rounded-lg">
              <h1 className="text-secondary text-center">
                No Reviews Founds On {name} 
              </h1>
            </div>
          )}
          {reviews?.map(
            (
              item: HireReviews,
              index: number,
            ) => {
              return (
                <div
                  key={index.toString()}
                  className="p-2 m-2 shadow-[0_4px_12px_rgba(0,0,0,0.650)] w-full rounded-md flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center w-full ">
                    <h2 className=" font-medium text-secondary">
                      {item.user ?? "Unknown"}
                    </h2>
                    <p className="flex items-center gap-2 text-sm">
                      <FaRegCalendarAlt className="text-primary" />{" "}
                      {item.created_at ? item.created_at.toLocaleDateString() : ""}
                    </p>
                  </div>
                  <p className="text-sm">{item.message}</p>
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

export default HireReviews;
