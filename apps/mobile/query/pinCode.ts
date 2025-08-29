import { useMutation } from "@tanstack/react-query";
import { api, methods } from "@/lib/api";

export const usePincodeCityState = () => {
  return useMutation({
    mutationFn: async (
      pincode: string | number,
    ): Promise<{ city: string; state: string }> => {
      const response = await api(
        methods.get,
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const apiData = response?.[0];
      if (apiData.Status !== "Success") {
        throw new Error("pincode not found");
      }
      const postOffice = apiData?.PostOffice?.[0];

      return {
        city: postOffice?.District,
        state: postOffice?.State,
      };
    },
    onSuccess: (data) => {
      console.log("city and state fetched successfully", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });
};
