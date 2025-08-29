import { getFormAuthHeader } from "@/constants/authHeader";
import { api, methods } from "@/lib/api";

export const initiatePlan = async (plan_id: any, price: any): Promise<any> => {
  //   console.log('plan_id', typeof plan_id, plan_id, 'price', typeof price, price);

  const response = api(
    methods.post,
    "https://justsearch.net.in/api/razorpay/initiate",
    {
      plan_id,
      price,
    },
    getFormAuthHeader(),
  );
  return response;
};
