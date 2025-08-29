import axios, { AxiosError, AxiosRequestConfig } from "axios";

export enum methods {
  get = "get",
  post = "post",
  delete = "delete",
  patch = "patch",
  put = "put",
}

export const api = async (
  method: methods,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
) => {
  try {
    let response: any;
    if (method === methods.get) {
      response = await axios[method](url, config);
    } else {
      response = await axios[method](url, data, config);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data, success } = error.response;
      // Handle other HTTP errors as needed
      return {
        success,
        status,
        message: data?.message || "Request failed",
        data,
      };
    } else {
      // Network error or no response received
      console.error("API Network/Error: on ", url, "error", error);
      console.log("axios", error.toJSON());
      return {
        success: false,
        status: 0,
        message: "Network error or no response received",
      };
    }
  }
};
