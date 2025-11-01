import type { UserRole } from "@repo/db";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "token";
const ROLE_KEY = "role";

type Token = {
  token: string | null;
  role: UserRole | null;
};

export const getTokenRole = async (): Promise<Token> => {
  if (Platform.OS === "web") {
    return {
      token: localStorage.getItem(TOKEN_KEY),
      role: localStorage.getItem(ROLE_KEY) as UserRole,
    };
  } else {
    const [token, role] = await Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(ROLE_KEY) as Promise<UserRole>,
    ]);
    return { token, role };
  }
};

export const setTokenRole = async (token: string, role: UserRole): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  } else {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, token),
      SecureStore.setItemAsync(ROLE_KEY, role),
    ]);
  }
};

export const deleteTokenRole = async (): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  } else {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(ROLE_KEY),
    ]);
  }
};