"use client";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatTokenSessionInsertSchema } from "@repo/db/src/schema/help-and-support.schema";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { Stack, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import Swal from "sweetalert2";
import type z from "zod";
import { FormField } from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { Loading } from "@/components/ui/Loading";
import { trpc } from "@/lib/trpc";

type HelpAndSupportSchema = z.infer<typeof chatTokenSessionInsertSchema>;
export default function HelpAndSupport() {
  const router = useRouter();
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
          router.replace("/(root)/(home)/home");
        }
      },
      onError: (error) => {
        console.log("Error", error);
        if (isTRPCClientError(error)) {
          Alert.alert(error.message);
        }
      },
    });
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: "Create Ticket",

          headerLeft: () => (
            <View className="flex-row items-center gap-2">
              <Pressable className="ml-2" onPress={() => router.back()}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  className="mr-8 self-center"
                />
              </Pressable>
            </View>
          ),
        }}
      />

      <View className="flex-1 bg-gray-100">
        <View className="bg-white px-6 pt-4 pb-6 shadow-sm">
          <Text className="text-2xl font-extrabold text-gray-900">
            Help & Support
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Tell us how we can help you. Our team will get back to you shortly.
          </Text>
        </View>

        <View className="flex-1 px-4 mt-6">
          <View className="bg-white rounded-2xl p-6 shadow-md">
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
                    label: "Hire / Job Profile Issue",
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
                placeholder="Write your message here..."
                component="textarea"
                error={errors.message?.message}
              />
            </View>
          </View>
        </View>

        <View className="bg-white px-6 py-4 border-t border-gray-200">
          <PrimaryButton
            title="Submit Request"
            isLoading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </>
  );
}
