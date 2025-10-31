import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "token";

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  } else {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }
};

export const setToken = async (value: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, value);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, value);
  }

  console.log( "token in secureStore seted ",await getToken())
};

export const deleteToken = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};
