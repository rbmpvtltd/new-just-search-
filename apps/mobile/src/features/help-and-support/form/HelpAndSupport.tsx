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

      <View className="flex-1 h-full">
        <View className="bg-white w-full h-full">
          <View className="">
            <View className="p-6 ">
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
          <View className="flex-row justify-between w-[90%] self-center">
            <View className="w-[45%] mx-auto">
              <PrimaryButton
                title="Submit"
                isLoading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
