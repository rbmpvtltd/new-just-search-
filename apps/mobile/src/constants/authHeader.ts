// src/utils/authHeader.ts
import { useAuthStore } from "@/features/auth/authStore";

export const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return {
    Authorization: token ? `Bearer ${token}` : "",
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};
export const getFormAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  };
};

export const getJsonAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
};
