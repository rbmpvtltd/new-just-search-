import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductReviewSchema } from "@repo/db/dist/schema/product.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import type z from "zod";
import { trpc } from "@/lib/trpc";

type ReviewFormValues = z.infer<typeof insertProductReviewSchema>;

function ProductReviewForm({
  productId,
  businessId,
}: {
  productId: number;
  businessId: number;
}) {
  const [submittedData, setSubmittedData] = useState<any>(null);
  const { mutate, isPending } = useMutation(
    trpc.productrouter.createProductReview.mutationOptions(),
  );
  const { data: submitted } = useQuery(
    trpc.productrouter.productReviewSubmitted.queryOptions({
      productId: Number(productId ?? 0),
    }),
  );

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(insertProductReviewSchema),
    defaultValues: {
      businessId: businessId,
      productId: productId,
      message: "",
      rate: 5,
      email: "",
      name: "Guest",
      status: true,
    },
  });

  function onSubmit(data: ReviewFormValues) {
    mutate(data, {
      onSuccess: (responseData) => {
        console.log("Review submitted successfully:", responseData);
        setSubmittedData(true);
        Alert.alert("Successful", "Review Submitted Successfully");
        form.reset();
      },
      onError: (err) => {
        Alert.alert("Oop's", "Could Not Submit Your Review");
        console.error("Error submitting review:", err);
      },
    });
  }

  if (submitted?.submitted) {
    return (
      <View className="bg-green-50 rounded-xl border border-green-200 p-4 mx-4 my-2">
        <View className="flex-row gap-3">
          <View className="bg-green-100 rounded-full w-11 h-11 justify-center items-center">
            <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-lg font-semibold text-green-900">
              Review Already Submitted
            </Text>
            <Text className="text-sm text-green-700 leading-5">
              Thank you for sharing your feedback! You've already submitted a
              review for this business.
            </Text>
          </View>
        </View>
      </View>
    );
  }
  const watchRating = form.watch("rate");

  return (
    <View className="p-10 m-4 rounded-lg bg-base-300">
      <View className="mb-6">
        <Text className="text-3xl font-bold mb-2 text-primary">
          Write a Review
        </Text>
        <Text className="text-base text-secondary-content">
          Share your experience with this business
        </Text>
      </View>

      {submittedData && (
        <View className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <Text className="text-green-800 font-medium">
            ✓ Review submitted successfully!
          </Text>
        </View>
      )}
      {/* ======MESSAGE SECTION===== */}
      <View className="mb-6">
        <Text className="font-medium text-secondary mb-2">Rating</Text>
        <Controller
          control={form.control}
          name="rate"
          render={({ field: { onChange, value } }) => (
            <View>
              <View className="flex-row gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Pressable
                    key={rating}
                    onPress={() => onChange(rating)}
                    className="p-1"
                  >
                    <Ionicons
                      name={rating <= (value ?? 0) ? "star" : "star-outline"}
                      size={32}
                      color={rating <= (value ?? 0) ? "#facc15" : "#d1d5db"}
                    />
                  </Pressable>
                ))}
              </View>
              <Text className="text-sm text-secondary-content mt-2">
                Tap on the stars to rate (1-5)
              </Text>
            </View>
          )}
        />
        {form.formState.errors.rate && (
          <Text className="text-sm text-error mt-1">
            {form.formState.errors.rate.message}
          </Text>
        )}
      </View>
      <View className="mb-6">
        <Text className="text-base font-medium text-primary mb-2">
          Your Name
        </Text>
        <Controller
          control={form.control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3  text-base text-secondary"
              placeholder="Tell us about your experience..."
              placeholderTextColor="#9ca3af"
              multiline
              textAlignVertical="top"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Text className="text-sm text-secondary-content mt-2">
          Write at least 10 characters (max 500)
        </Text>
        {form.formState.errors.name && (
          <Text className="text-sm text-error mt-1">
            {form.formState.errors.name.message}
          </Text>
        )}
      </View>
      <View className="mb-6">
        <Text className="text-base font-medium text-primary mb-2">
          Your Email
        </Text>
        <Controller
          control={form.control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base text-secondary"
              placeholder="e.g example@gmail.com"
              placeholderTextColor="#9ca3af"
              multiline
              textAlignVertical="top"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Text className="text-sm text-secondary-content mt-2">
          Write at least 10 characters (max 500)
        </Text>
        {form.formState.errors.email && (
          <Text className="text-sm text-error mt-1">
            {form.formState.errors.email.message}
          </Text>
        )}
      </View>
      <View className="mb-6">
        <Text className="text-base font-medium text-primary mb-2">
          Your Review
        </Text>
        <Controller
          control={form.control}
          name="message"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 min-h-[120px] text-base text-secondary"
              placeholder="Tell us about your experience..."
              placeholderTextColor="#9ca3af"
              multiline
              textAlignVertical="top"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Text className="text-sm text-secondary-content mt-2">
          Write at least 10 characters (max 500)
        </Text>
        {form.formState.errors.message && (
          <Text className="text-sm text-error mt-1">
            {form.formState.errors.message.message}
          </Text>
        )}
      </View>
      <Pressable
        className={`rounded-lg py-4 px-4 items-center justify-center ${
          isPending || submittedData ? "bg-primary-content" : "bg-primary"
        }`}
        onPress={form.handleSubmit(onSubmit, (errors) => {
          console.log("========> error is ", errors);
        })}
        // onPress={() => {
        //   console.log("clicked on review submit");
        // }}
        disabled={submittedData || isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">
            {isPending ? "Submitting..." : "Submit Review"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export { ProductReviewForm };
