"use client"
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertHireReviewSchema } from "@repo/db/dist/schema/hire.schema";
import { useMutation } from "@tanstack/react-query";
import { Form } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import type z from "zod";

type ReviewFormValues = z.infer<typeof insertHireReviewSchema>;

export function ReviewForm({ hireId }: { hireId: number }) {
  const trpc = useTRPC();
  const [submittedData, setSubmittedData] = useState<any>(null);

  const { mutate, isPending } = useMutation(
    trpc.hirerouter.hireReview.mutationOptions(),
  );

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(insertHireReviewSchema),
    defaultValues: {
      hireId: hireId,
      message: "",
    },
  });

  function onSubmit(data: ReviewFormValues) {
    mutate(data, {
      onSuccess: (responseData) => {
        console.log("Review submitted successfully:", responseData);
        setSubmittedData(responseData);
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: `Review Submitted Successfully`,
        });
        form.reset();
      },
      onError: (err) => {
        console.error("Error submitting review:", err);
      },
    });
  }


  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
        <p className="text-muted-foreground">
          Share your experience with this business
        </p>
      </div>

      {submittedData && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-medium">
            ✓ Review submitted successfully!
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your experience..."
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write at least 10 characters (max 500)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending || submittedData}
            className="w-full"
          >
            {isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
