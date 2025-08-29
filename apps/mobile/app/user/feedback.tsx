import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Text, useColorScheme, View } from "react-native";
import { Checkbox } from "react-native-paper";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import TextAreaInput from "@/components/inputs/TextAreaInput";
import Colors from "@/constants/Colors";
import { sendFeedBack } from "@/query/feedback";
import { type FeedbackData, feedbackSchema } from "@/schemas/feedbackSchema";
import { useAuthStore } from "@/store/authStore";

const feedbackOptions = [
  "I can't find something.",
  "I can't figure out how to do something.",
  "I figured out how to do something but it was too hard to do.",
  "I love it!",
  "Something else.",
];

export default function Feedback() {
  const colorScheme = useColorScheme();
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback_type: "",
      additional_feedback: "",
    },
  });

  const selectedOptions = watch("feedback_type")?.split(", ") || [];
  const additionalSelectedOptions = watch("additional_feedback");

  const toggleOption = (option: string) => {
    const currentOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setValue("feedback_type", currentOptions.join(", "), {
      shouldValidate: true,
    });
  };

  async function onSubmit(data: FeedbackData) {
    console.log(data);
    if (!token) {
      console.log("Token missing!");

      return;
    }

    try {
      const response = await sendFeedBack(data);
      if (response.success) {
        Alert.alert(
          "Thank you!",
          "Your feedback has been submitted successfully!",
        );
        reset();
        router.replace("/user/bottomNav");
      } else {
        Alert.alert("Something went", "Your feedback could not be submitted!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  }

  return (
    <View className=" m-4 shadow-md bg-base-200 rounded-lg h-full">
      <View>
        <Text className="text-xl text-secondary font-semibold mb-2 p-2">
          What feedback do you have?
        </Text>
        {feedbackOptions.map((option, index) => (
          <Checkbox.Item
            key={index}
            label={option}
            status={selectedOptions.includes(option) ? "checked" : "unchecked"}
            onPress={() => toggleOption(option)}
            labelStyle={{ color: Colors[colorScheme ?? "light"].secondary }}
            color={
              selectedOptions.includes(option)
                ? Colors[colorScheme ?? "light"].primary
                : undefined
            }
          />
        ))}
        {errors.feedback_type && (
          <Text className="text-error ml-2">
            {errors.feedback_type.message}
          </Text>
        )}
      </View>
      <View className="m-4">
        <Text className="text-lg font-semibold mb-2 text-secondary ">
          Anything else you'd like to share?
        </Text>
        <TextAreaInput
          className="text-secondary"
          onChangeText={(text: string) => setValue("additional_feedback", text)}
          value={additionalSelectedOptions}
        />
        {errors.additional_feedback && (
          <Text className="text-error ml-2">
            {errors.additional_feedback.message}
          </Text>
        )}
      </View>
      <View className="flex-1 mx-auto w-[49%] r mb-4">
        <PrimaryButton
          isLoading={isSubmitting}
          title="Submit Feedback"
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
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
}
