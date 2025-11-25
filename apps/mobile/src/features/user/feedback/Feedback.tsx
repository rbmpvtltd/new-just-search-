import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackInsertSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
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
          reset();
        }
      },
      onError: (error) => {
        Alert.alert(error.message);
      },
    });
  };

  return (
    <View className="m-4 shadow-md bg-base-200 rounded-lg h-full">
      <View>
        <Text className="text-xl text-secondary font-semibold p-2">
          What feedback do you have?
        </Text>
        <FormField
          control={control}
          name="feedbackType"
          component="checkbox"
          data={feedbackOptions}
          className="mt-0 m-0 p-0"
          error={errors.feedbackType?.message}
          labelHidden
        />
      </View>
      <View className="m-4">
        <Text className="text-lg font-semibold mb-2 text-secondary ">
          Anything else you'd like to share?
        </Text>
        <FormField
          control={control}
          label=""
          name="additionalFeedback"
          component="textarea"
          placeholder="Type here..."
          labelHidden
          error={errors.additionalFeedback?.message}
        />
      </View>
      <View className="flex-row justify-between w-[90%] self-center mt-6 mb-12">
        <View className="w-[45%] mx-auto">
          <PrimaryButton
            title="Next"
            isLoading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </View>
  );
}
