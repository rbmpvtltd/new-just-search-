import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import { deleteAccountRequest } from "@/query/deleteAccountRequest";
import { type DeleteReqData, deleteReqSchema } from "@/schemas/deleteReqSchema";
import LableText from "../inputs/LableText";
import PrimaryButton from "../inputs/SubmitBtn";
import TextAreaInput from "../inputs/TextAreaInput";

export default function DeleteReqForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeleteReqData>({
    resolver: zodResolver(deleteReqSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (data: DeleteReqData) => {
    const response = await deleteAccountRequest(data);

    if (response?.status === 200) {
      Alert.alert("Request Sent Successfully", response?.message);
      reset();
    } else {
      Alert.alert("Error", response?.message);
    }
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

      <View className="flex-1 mx-auto p-4 w-[49%]">
        <PrimaryButton
          isLoading={isSubmitting}
          title="Submit"
          loadingText="Submitting..."
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          textClassName="text-secondary text-lg font-semibold"
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
}
