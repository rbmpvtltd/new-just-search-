"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

const schema = z.object({
  displayName: z.string().min(1, "Required"),
});

export default function UpdateDisplayNameForm({ userId }: { userId: number }) {
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.auth.updateDisplayName.mutationOptions(),
  );
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    mutate(
      { userId, displayName: values.displayName },
      {
        onSuccess: async (data) => {
          Swal.fire({
            icon: "success",
            title: "Update Successful",
            text: "Display Name Has Been Update Successfully",
            // footer: '<a href="#">Why do I have this issue?</a>',
          });
          window.location.reload();
          console.log("otp sended successfully", data);
        },
        onError: async (error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            // footer: '<a href="#">Why do I have this issue?</a>',
          });
          console.log("oops error while seding otp", error);
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-md border">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Enter Display Name
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Display Name <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                Save
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
