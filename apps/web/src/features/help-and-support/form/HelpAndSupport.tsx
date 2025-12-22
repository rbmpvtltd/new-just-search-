"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatTokenSessionInsertSchema } from "@repo/db/src/schema/help-and-support.schema";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import type z from "zod";
import { FormField } from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";

type HelpAndSupportSchema = z.infer<typeof chatTokenSessionInsertSchema>;
export default function HelpAndSupport() {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.helpAndSupportRouter.create.mutationOptions(),
  );
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HelpAndSupportSchema>({
    resolver: zodResolver(chatTokenSessionInsertSchema),
    defaultValues: {
      message: "",
      subject: "",
    },
  });

  const onSubmit = (data: HelpAndSupportSchema) => {
    mutate(data, {
      onSuccess: (data) => {
        if (data.success) {
          Swal.fire({
            title: data.message,
            icon: "success",
            draggable: true,
          });
        } else {
          Swal.fire({
            title: data.message,
            icon: "error",
            draggable: true,
          });
        }
      },
      onError: (error) => {
        console.log("Error", error);
        Swal.fire({
          title: error?.message,
          icon: "error",
          draggable: true,
        });
      },
    });
  };
  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl  bg-gray-50 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="px-8 py-2 mt-4">
          <div className="p-6 ">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Help and Support
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={control}
                type=""
                label="Subject"
                name="subject"
                placeholder="Subject"
                component="select"
                options={[
                  { label: "Payment Issue", value: "payment issue" },
                  {
                    label: "Business Profile Issue",
                    value: "business profile issue",
                  },
                  {
                    label: "Hire/Job Profile Issue",
                    value: "hire/job profile issue",
                  },
                  { label: "Suggestions", value: "suggestions" },
                ]}
                error={errors.subject?.message}
              />
              <FormField
                control={control}
                type=""
                label="Message"
                name="message"
                placeholder="Message here"
                component="textarea"
                error={errors.message?.message}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Submitting...
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
