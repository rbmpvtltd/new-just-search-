import React, { useEffect, useState } from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import StarRating from "react-native-star-rating-widget";

const Review = ({ rating }: { rating: any }) => {
  // const {
  //   control,
  //   reset,
  //   handleSubmit,
  //   formState: { errors, isSubmitting },
  // } = useForm<reviewSchemaType>({
  //   resolver: zodResolver(reviewSchema),
  //   defaultValues: {
  //     listing_id: listingId,
  //     name: "",
  //     rate: 0,
  //     message: "",
  //     email: userProfile?.user?.email || "",
  //   },
  // });

  // const sortedReviews = [
  //   ...allReviews.filter((r: any) => r.user_id === userProfile.user?.id),
  //   ...allReviews.filter((r: any) => r.user_id !== userProfile.user?.id),
  // ];

  // const hasReviewed = sortedReviews.some(
  //   (r: any) => r.user_id === userProfile.user?.id,
  // );

  // const onSubmit = (formData: reviewSchemaType) => {
  //   if (!userProfile?.user?.id) {
  //     Alert.alert("Please log in to submit a review");
  //     return;
  //   }

  //   if (hasReviewed) {
  //     Alert.alert("You have already reviewed this listing");
  //     return;
  //   }
  //   mutate(
  //     {
  //       ...formData,
  //     },
  //     {
  //       onSuccess: () => {
  //         Alert.alert("Review submitted successfully");
  //         reset();
  //       },
  //     },
  //   );
  // };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        className=""
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
      >
        <View className="items-center mb-4">
          <Text className="text-2xl font-bold text-secondary">Review</Text>
        </View>

        {/* All Reviews */}
        <View className="mt-4">
          <Text className="text-xl font-semibold mb-4 text-secondary">
            All Reviews
          </Text>
          {rating?.length === 0 ? (
            <Text className="text-secondary">No reviews yet.</Text>
          ) : (
            rating?.map((review: any) => (
              <View
                key={review.id}
                className="mb-4 p-2 bg-success-content rounded-lg shadow-sm "
              >
                <Text className="font-bold text-success">
                  {review.user ?? "Unknown"}
                </Text>
                <StarRating
                  rating={review.rate ?? 0}
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
