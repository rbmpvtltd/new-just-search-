import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackInsertSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, ScrollView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import { FormField } from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { trpc } from "@/lib/trpc";

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
  const router = useRouter();
  const { mutate } = useMutation(trpc.userRouter.feedback.mutationOptions());

  const {
    control,
    handleSubmit,
    reset,
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
          Alert.alert(data.message);
          router.replace("/(root)/(home)/home");
          reset();
        }
      },
      onError: (error) => {
        Alert.alert(error.message);
      },
    });
  };

  return (
    <KeyboardAwareScrollView
      className="m-4 bg-base-200 rounded-2xl shadow-md"
      enableOnAndroid
      extraScrollHeight={80}
    >
      <ScrollView
        className="m-4 bg-base-200 rounded-2xl shadow-md"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6 pb-4 border-b border-base-300">
          <Text className="text-2xl font-semibold text-secondary">
            We value your feedback
          </Text>
          <Text className="text-sm text-secondary-content mt-2">
            Help us improve by sharing your experience
          </Text>
        </View>

        <View className="px-6 pt-6">
          <Text className="text-lg font-semibold text-secondary mb-3">
            What feedback do you have?
            <Text className="text-error"> *</Text>
          </Text>

          <FormField
            control={control}
            name="feedbackType"
            component="checkbox"
            data={feedbackOptions}
            className="m-0 p-0"
            error={errors.feedbackType?.message}
            labelHidden
            required={false}
          />

          {errors.feedbackType && (
            <Text className="text-error text-sm mt-2">
              {errors.feedbackType.message}
            </Text>
          )}
        </View>

        <View className="px-6 mt-6">
          <Text className="text-lg font-semibold text-secondary mb-2">
            Anything else you’d like to share?
          </Text>

          <FormField
            control={control}
            name="additionalFeedback"
            component="textarea"
            placeholder="Type your thoughts here..."
            labelHidden
            required={false}
            error={errors.additionalFeedback?.message}
          />
        </View>

        <View className="px-6 py-6 mt-8 border-t border-base-300">
          <PrimaryButton
            title="Submit Feedback"
            isLoading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
