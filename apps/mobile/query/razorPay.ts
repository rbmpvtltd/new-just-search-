import { useMutation } from "@tanstack/react-query";
import { api, methods } from "@/lib/api";
import { getJsonAuthHeader } from "@/constants/authHeader";

interface initiateRazorPayRequest {
  plan_id: number;
}

interface initiateRazorPayResponse {
  success: boolean;
  status: number;
  order_id: string;
  key: string;
  amount: number;
  currency: string;
  order_number: string;
  title: string;
  description: string;
}

export const useInitiateRazorPay = () => {
  return useMutation({
    mutationFn: async ({
      plan_id,
    }: initiateRazorPayRequest): Promise<initiateRazorPayResponse> => {
      const response = await api(
        methods.post,
        `https://justsearch.net.in/api/razorpay/initiate`,
        {
          plan_id,
        },
        getJsonAuthHeader(),
      );
      console.log(plan_id);

      return response;
    },
  });
};

interface IverityRazorPayRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_number: string;
  plan_id: number;
  currency_id: number;
  method: "Razorpay";
  days: 30;
}

interface IverityRazorPayResponse {
  status: number;
  success: boolean;
  message: string;
}

export const useVerityRazorPay = () => {
  return useMutation({
    mutationFn: async (
      data: IverityRazorPayRequest,
    ): Promise<IverityRazorPayResponse> => {
      const response = await api(
        methods.post,
        `https://justsearch.net.in/api/razorpay/verify`,
        data,
        getJsonAuthHeader(),
      );
      return response;
    },
  });
};
