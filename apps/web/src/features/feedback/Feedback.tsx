"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackInsertSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import type z from "zod";
import { FormField } from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";

type FeedbackSchema = z.infer<typeof feedbackInsertSchema>;
const feedbackOptions = [
  { label: "I can't find something.", value: "I can't find something." },
  {
    label: "I can't figure out how to do something.",
    value: "I can't figure out how to do something.",
  },
  {
    label: "I figured out how to do something but it was too hard to do.",
    value: "I figured out how to do something but it was too hard to do.",
  },
  { label: "I love it!", value: "I love it!" },
  { label: "Something else.", value: "Something else." },
];
export default function Feedback() {
  const trpc = useTRPC();
  const { mutate } = useMutation(trpc.userRouter.feedback.mutationOptions());
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackInsertSchema),
    defaultValues: {
      feedbackType: [],
      additionalFeedback: "",
    },
  });

  const onSubmit = (data: FeedbackSchema) => {
    mutate(data, {
      onSuccess: (data) => {
        if (data.success) {
          Swal.fire({
            title: data?.message,
            icon: "success",
            draggable: true,
          });
        }
      },
      onError: (error) => {
        Swal.fire({
          title: error?.message,
          icon: "error",
          draggable: true,
        });
      },
    });
  };
  return (
    <div className="flex  justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl  bg-gray-50 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="px-8 py-2 mt-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            What feedback do you have?
          </h2>
        </div>

        <div className="px-8 py-0 ">
          <div className="">
            <FormField
              control={control}
              name="feedbackType"
              component="checkbox"
              placeholder="Enter your reason..."
              options={feedbackOptions}
              error={errors?.feedbackType?.message}
              className="flex-col"
              required={false}
            />
          </div>
        </div>
        <div className="p-8 ">
          <h2 className="text-lg font-semibold text-gray-800">
            Anything else you'd like to share?
          </h2>
          <div>
            <FormField
              control={control}
              name="additionalFeedback"
              component="textarea"
              placeholder="Type here..."
              //   error={errors?.additionalFeedback?.message}
              className="w-full min-h-[120px]"
              required={false}
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 px-8 py-6 bg-gray-50 border-t border-gray-200">
          <Button
            type="submit"
            // disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner className="w-4 h-4" /> Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
