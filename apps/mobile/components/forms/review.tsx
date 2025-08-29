import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import StarRating from "react-native-star-rating-widget";
import { queryClient } from "@/app/_layout";
import {
  MY_BUSINESS_LIST_URL,
  MY_LISTING_URL,
  PROFILE_URL,
} from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import { reviewApi, useReviewMutation } from "@/query/review";
import { reviewSchema, type reviewSchemaType } from "@/schemas/reviewSchema";
import Input from "../inputs/Input";
import LableText from "../inputs/LableText";
import PrimaryButton from "../inputs/SubmitBtn";
import TextAreaInput from "../inputs/TextAreaInput";
import ErrorText from "../ui/ErrorText";

const Review = ({ listingId }: { listingId: number }) => {
  const { data: listingData } = useSuspenceData(
    MY_LISTING_URL.url,
    MY_LISTING_URL.key,
    String(listingId),
  );

  const { data: userProfile, isLoading: profileLoading } = useSuspenceData(
    PROFILE_URL.url,
    PROFILE_URL.key,
  );

  const { mutate, isError, isPending } = useReviewMutation();

  const isOwner = listingData?.data?.listing?.user_id === userProfile?.user?.id;

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<reviewSchemaType>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      listing_id: listingId,
      name: "",
      rate: 0,
      message: "",
      email: userProfile?.user?.email || "",
    },
  });

  const allReviews = listingData.data.reviews;

  const sortedReviews = [
    ...allReviews.filter((r: any) => r.user_id === userProfile.user?.id),
    ...allReviews.filter((r: any) => r.user_id !== userProfile.user?.id),
  ];

  const hasReviewed = sortedReviews.some(
    (r: any) => r.user_id === userProfile.user?.id,
  );

  const onSubmit = (formData: reviewSchemaType) => {
    if (!userProfile?.user?.id) {
      Alert.alert("Please log in to submit a review");
      return;
    }

    if (hasReviewed) {
      Alert.alert("You have already reviewed this listing");
      return;
    }
    mutate(
      {
        ...formData,
      },
      {
        onSuccess: () => {
          Alert.alert("Review submitted successfully");
          reset();
        },
      },
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        className="bg-white"
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
      >
        <View className="items-center mb-4">
          <Text className="text-2xl font-bold text-secondary">Review</Text>
        </View>

        {/* Review Form */}
        {isOwner ? (
          <Text className="text-secondary text-lg font-medium mb-4">
            You cannot review your own listing.
          </Text>
        ) : !hasReviewed ? (
          <>
            <Text className="text-lg text-secondary text-center mb-2">
              Drop Your Review
            </Text>

            <View className="flex-row justify-center gap-10">
              <Controller
                control={control}
                name="rate"
                render={({ field: { onChange, value } }) => (
                  <StarRating
                    rating={value}
                    onChange={onChange}
                    animationConfig={{ scale: 1.2, duration: 200 }}
                    enableHalfStar={false}
                  />
                )}
              />
            </View>
            {errors.rate && <ErrorText title={errors.rate.message} />}

            <View className="space-y-4 mb-4">
              <LableText title="Name" />
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter Your Name"
                    className="bg-base-200 w-[100%] mx-auto"
                  />
                )}
              />
              {errors.name && <ErrorText title={errors.name.message} />}

              <LableText title="Email" />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter Your Email"
                    className="bg-base-200 w-[100%] mx-auto"
                    keyboardType="email-address"
                  />
                )}
              />
              {errors.email && <ErrorText title={errors.email.message} />}

              <LableText title="Your Review" />
              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, value } }) => (
                  <TextAreaInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Write your review here..."
                    className="bg-base-200 w-[100%] mx-auto"
                  />
                )}
              />
              {errors.message && <ErrorText title={errors.message.message} />}
            </View>

            <View className="w-[45%] mx-auto m-4">
              <PrimaryButton
                isLoading={isSubmitting}
                disabled={isPending}
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
                textClassName="text-[#ffffff] text-lg font-semibold"
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </>
        ) : (
          <Text className="text-secondary text-lg font-medium mb-4">
            You have already submitted a review.
          </Text>
        )}

        {/* All Reviews */}
        <View className="mt-4">
          <Text className="text-xl font-semibold mb-4 text-secondary">
            All Reviews
          </Text>
          {sortedReviews?.length === 0 ? (
            <Text className="text-secondary">No reviews yet.</Text>
          ) : (
            sortedReviews.map((review: any) => (
              <View
                key={review.id}
                className="mb-4 p-2 bg-success-content rounded-lg shadow-sm "
              >
                <Text className="font-bold text-success">{review.name}</Text>
                <StarRating
                  rating={review.rate}
                  onChange={() => {}}
                  starSize={18}
                  enableSwiping={false}
                />
                <Text className="mt-2 text-success">{review.message}</Text>
                <Text className="text-xs text-success mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Review;
