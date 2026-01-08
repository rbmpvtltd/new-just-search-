import { zodResolver } from "@hookform/resolvers/zod";
import { requestAccountsInsertSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import type z from "zod";
import LableText from "@/components/inputs/LableText";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import TextAreaInput from "@/components/inputs/TextAreaInput";
import { trpc } from "@/lib/trpc";

type DeleteRequestSchema = z.infer<typeof requestAccountsInsertSchema>;
export default function AccountDeleteRequestForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DeleteRequestSchema>({
    resolver: zodResolver(requestAccountsInsertSchema),
    defaultValues: {
      reason: "",
    },
  });

  const { mutate } = useMutation(
    trpc.userRouter.accountDeleteRequest.mutationOptions(),
  );

  const onSubmit = (data: DeleteRequestSchema) => {
    mutate(data, {
      onSuccess: (data) => {
        if (data?.success) {
          Alert.alert(data?.message);
          router.replace("/(root)/(home)/home");
        }
      },
      onError: (error) => {
        console.log("Error", error);
        Alert.alert(error?.message);
      },
    });
  };

  return (
    <View className="h-full m-4 shadow-md bg-base-200 rounded-lg">
      <LableText title="Reason To Delete The Account" className="text-3xl" />
      <Controller
        control={control}
        name="reason"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextAreaInput
            className="bg-base-200 w-[90%] mx-auto"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            placeholder="Enter Your Message"
          />
        )}
      />
      {errors.reason && (
        <Text className="text-error text-sm mb-4">{errors.reason.message}</Text>
      )}

      <View className="flex-row justify-between w-[90%] self-center mt-6 mb-12">
        <View className="w-[45%] mx-auto">
          <PrimaryButton
            title="Submit"
            isLoading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </View>
  );
}
