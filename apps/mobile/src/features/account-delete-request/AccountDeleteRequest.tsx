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
    <View className="m-4 bg-base-200 rounded-2xl shadow-md">
      <View className="px-6 pt-6 pb-4 border-b border-base-300">
        <LableText
          title="Delete Account"
          className="text-2xl font-bold text-error"
        />
        <Text className="text-sm text-secondary-content mt-2">
          Please let us know why you want to delete your account. This action is
          irreversible.
        </Text>
      </View>

      <View className="px-6 py-6 space-y-3">
        <Text className="text-secondary font-semibold">
          Reason for deleting your account
        </Text>

        <Controller
          control={control}
          name="reason"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextAreaInput
              className="bg-base-100 rounded-lg min-h-[120px] px-3 py-2"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="Tell us your reason..."
            />
          )}
        />

        {errors.reason && (
          <Text className="text-error text-sm">{errors.reason.message}</Text>
        )}
      </View>

      <View className="px-6 py-5 border-t border-base-300">
        <PrimaryButton
          title="Request Account Deletion"
          isLoading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          className="bg-error"
        />
      </View>
    </View>
  );
}
