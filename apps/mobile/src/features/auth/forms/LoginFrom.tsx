import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import Purchases from "react-native-purchases";
import GoogleLogin from "@/app/(root)/google";
import { useAuthStore } from "@/features/auth/authStore";
import { queryClient, trpc } from "@/lib/trpc";
import { deviceId, platform } from "@/utils/getDeviceId";
import { setTokenRole } from "@/utils/secureStore";
import Input from "../../../components/inputs/Input";
import { type LoginFormData, loginSchema } from "../schema/loginSchema";

export default function LoginFrom() {
  const setAuthStoreToken = useAuthStore((state) => state.setToken);
  const {
    control: businessControl,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { mutate: pushTokenMutation } = useMutation(
    trpc.notificationRouter.createPushToken.mutationOptions(),
  );

  const loginMutation = useMutation(
    trpc.auth.loginMobile.mutationOptions({
      onSuccess: async (data) => {
        console.log("Data", data);

        if (data) {
          setAuthStoreToken(data?.session ?? "", data.role ?? "visiter");
          // await Purchases.logIn(data?.revanueCatToken ?? "");
          await setTokenRole(data?.session ?? "", data.role ?? "visiter");
          queryClient.invalidateQueries({
            queryKey: trpc.auth.verifyauth.queryKey(),
          });
          const pushToken = await AsyncStorage.getItem("pushToken");

          if (!pushToken) {
            console.log("No push token found in AsyncStorage");
            return;
          }

          console.log("Push token found:", pushToken);
          pushTokenMutation(
            {
              deviceId: String(deviceId),
              platform: platform,
              token: String(pushToken),
            },
            {
              onSuccess: (data) => {
                console.log("data inserted successfully=========>", data);
                // return router.back();
              },
              onError: (err) => {
                console.log("failed data insertion ====>", err);
              },
            },
          );
          // await Purchases.logIn(data?.ravanueCatId ?? "");
          // Alert.alert("Login Successfully");
          console.log("Login Successfully");

          // router.push("/(root)/(home)/home");
        }
      },
      onError: async (error) => {
        console.log("error", error);
        Alert.alert("Something Went Wrong");
      },
    }),
  );

  const onSubmit = async (data: { username: string; password: string }) => {
    console.log("data", data);
    loginMutation.mutate(data);
  };

  return (
    <View className="flex-1 justify-center py-10 w-full px-4">
      <View className="w-full">
        <View className="mb-5">
          <Text className="text-3xl font-bold text-secondary text-center mb-1">
            Welcome Back
          </Text>
          <Text className="text-sm text-secondary-content text-center">
            Login to continue
          </Text>
        </View>

        <View className="rounded-2xl bg-base-200 shadow-sm border border-gray-200 p-6 ">
          <View className="mb-4 w-full">
            <Text className="text-sm font-medium text-secondary mb-1">
              Email / Mobile Number
            </Text>
            <Controller
              control={businessControl}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className="w-full bg-base-200 text-secondary"
                  placeholder="Enter your email or mobile number"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
            />
          </View>

          <View className="mb-2 w-full">
            <Text className="text-sm font-medium text-secondary mb-1">
              Password
            </Text>
            <Controller
              control={businessControl}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className="w-full bg-base-200"
                  placeholder="Enter your password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  isPassword
                />
              )}
            />
          </View>

          <Pressable
            onPress={() => router.navigate("/forgetPassword")}
            className="self-end mt-1 mb-5"
          >
            <Text className="text-primary text-sm">Forgot password?</Text>
          </Pressable>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl items-center justify-center ${
              isSubmitting ? "bg-primary-content" : "bg-primary"
            }`}
          >
            <Text className="text-secondary text-lg font-semibold">
              {isSubmitting ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <GoogleLogin />
    </View>
  );
}
