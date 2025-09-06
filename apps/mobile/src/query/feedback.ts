import { api, methods } from "@/lib/api";
import { getAuthHeader } from "@/constants/authHeader";
import { FeedbackData } from "@/schemas/feedbackSchema";
import { apiUrl } from "@/constants/Variable";

export const sendFeedBack = async (data: FeedbackData): Promise<any> => {
  const response = await api(methods.post, `${apiUrl}/api/feedback`, data, {
    headers: getAuthHeader(),
  });
  return response;
};
