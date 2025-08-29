import { queryClient } from "@/app/_layout";
import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

const fetchWishlist = async (): Promise<any> => {
  const response = await api(
    methods.get,
    `${apiUrl}/api/wishlist`,
    {},
    {
      headers: getAuthHeader(),
    },
  );
  return response;
};
export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });
};
// -------------------------------------------------
const toggleWishlist = async (data: any): Promise<any> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/wishlist-toggle?listing_id=${data.listing_id}`,
    data,
    {
      headers: getAuthHeader(),
    },
  );

  if (!response?.success) {
    throw new Error(response?.message || "Failed to toggle favorite");
  }

  return response.data;
};

export const useToggleWishlist = () => {
  return useMutation({
    mutationFn: toggleWishlist,
    onSuccess: () => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });
};
