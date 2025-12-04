"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatTokenSessionInsertSchema } from "@repo/db/src/schema/help-and-support.schema";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Alert, ScrollView, Text, View } from "react-native";
import Swal from "sweetalert2";
import type z from "zod";
import { FormField } from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { Loading } from "@/components/ui/Loading";
import { trpc } from "@/lib/trpc";

type HelpAndSupportSchema = z.infer<typeof chatTokenSessionInsertSchema>;
export default function HelpAndSupport() {
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
          Alert.alert(data.message);
        } else {
          Alert.alert(data.message);
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
    <View className="flex-1 bg-gray-100 h-full">
      <View className="bg-white rounded-xl shadow-xl w-full h-full">
        <View className="p-6 space-y-8">
          <View className="p-6 bg-white shadow rounded-xl">
            <Text className="text-xl font-black text-gray-800 mb-6">
              Help and Support
            </Text>

            <View className="space-y-6">
              <FormField
                control={control}
                label="Subject"
                name="subject"
                placeholder="Select subject"
                component="dropdown"
                data={[
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
                label="Message"
                name="message"
                placeholder="Message here..."
                component="textarea"
                error={errors.message?.message}
              />
            </View>
          </View>
        </View>

        <View className="flex-row justify-end w-[40%] mx-auto ">
          <PrimaryButton
            title="Submit"
            onPress={handleSubmit(onSubmit)}
            className="bg-orange-500 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loading />
                <Text className="text-white ml-2">Submitting...</Text>
              </>
            ) : (
              <Text className="text-white font-bold">Submit</Text>
            )}
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
}
