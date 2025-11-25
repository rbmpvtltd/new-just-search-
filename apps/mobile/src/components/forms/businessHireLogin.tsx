import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { trpc } from "@/lib/trpc";
import {
  type LoginBusinessFormData,
  loginBusinesSchema,
} from "@/schemas/loginSchema";
import { useAuthStore } from "@/store/authStore";
import { setTokenRole } from "@/utils/secureStore";
import Input from "../inputs/Input";

export default function BusinessHireLogin() {
  const setAuthStoreToken = useAuthStore((state) => state.setToken);
  const {
    control: businessControl,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginBusinessFormData>({
    resolver: zodResolver(loginBusinesSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: async (data) => {
        console.log("data isn businessHireLogin.tsx line 36", data);
        if (data) {
          console.log("data is =dfsfsfsdfsdfsdfsdf=====>", data);
          setAuthStoreToken(data?.session ?? "", data.role ?? "visiter"); // TODO : set role as the response comes in future
          await setTokenRole(data?.session ?? "", data.role ?? "visiter");
          Alert.alert("Login Successfully");
          // router.push("/(root)/(home)/home");
          return router.back();
        }
      },
      onError: async (error) => {
        console.log("error", error);
        Alert.alert("Something Went Wrong");
      },
    }),
  );

  const onSubmit = async (data: { username: string; password: string }) => {
    loginMutation.mutate(data);
  };

  return (
    <View className="flex-1 justify-center items-center p-4 w-full">
      <Text className="text-2xl font-bold mb-8 text-secondary">
        Login As Business/Hire
      </Text>

      <View className="w-full max-w-md">
        <Text className="text-lg font-medium text-secondary mb-2">
          Mobile Number :
        </Text>
        <Controller
          control={businessControl}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-secondary bg-base-200"
              placeholder="Enter your mobile number"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
            />
          )}
        />
        {errors.username && (
          <Text className="text-error text-sm mb-4">
            {errors.username.message}
          </Text>
        )}

        <Text className="text-lg font-medium text-secondary-content mb-2">
          Password :
        </Text>
        <Controller
          control={businessControl}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="bg-base-200"
              placeholder="Enter your password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              // secureTextEntry
              isPassword
            />
          )}
        />
        {errors.password && (
          <Text className="text-error text-sm mb-4">
            {errors.password.message}
          </Text>
        )}

        {/* Forget Password */}
        <Pressable onPress={() => router.navigate("/forgetPassword")}>
          <Text className="text-primary text-md mt-4">Forgot Password?</Text>
        </Pressable>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`w-full mt-5 p-4 rounded-lg flex items-center justify-center ${
            isSubmitting ? "bg-primary-content" : "bg-primary"
          }`}
        >
          <Text className="text-secondary text-lg font-semibold">
            {isSubmitting ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
