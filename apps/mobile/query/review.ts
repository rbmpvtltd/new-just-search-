import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { queryClient } from "@/app/_layout";
import { MY_BUSINESS_LIST_URL, MY_LISTING_URL } from "@/constants/apis";
import { getFormAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const reviewApi = async (data: any) => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/submit-review`,
    data,
    getFormAuthHeader(),
  );

  return response;
};

export const useReviewMutation = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      return reviewApi(data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [MY_LISTING_URL.key],
      });

      // queryClient.invalidateQueries({
      //   queryKey: [PROFILE_URL.key],
      // });
    },
    onError: (error: any) => {
      console.log("error", error);

      if (error?.status === 401 || error?.response?.status === 401) {
        Alert.alert("Please log in to submit a review");
        return;
      }

      Alert.alert(error?.response?.data?.message || "Something went wrong");
    },
  });
};
