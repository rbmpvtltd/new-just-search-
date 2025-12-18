import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import Purchases from "react-native-purchases";
import { useAuthStore } from "@/features/auth/authStore";
import { queryClient, trpc } from "@/lib/trpc";
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

  const loginMutation = useMutation(
    trpc.auth.loginMobile.mutationOptions({
      onSuccess: async (data) => {
        console.log("data isn businessHireLogin.tsx line 36", data);
        if (data) {
          console.log("data is =dfsfsfsdfsdfsdfsdf=====>", data);
          setAuthStoreToken(data?.session ?? "", data.role ?? "visiter");
          // await Purchases.logIn(data?.revanueCatToken ?? "");
          await setTokenRole(data?.session ?? "", data.role ?? "visiter");
          queryClient.invalidateQueries({
            queryKey: trpc.auth.verifyauth.queryKey(),
          });
          await Purchases.logIn(data?.ravanueCatId ?? "");
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
      <Text className="text-2xl font-bold mb-8 text-secondary">Login Now</Text>

      <View className="w-full max-w-md">
        <Text className="text-lg font-medium text-secondary mb-2">
          Email / Mobile Number :
        </Text>
        <Controller
          control={businessControl}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-secondary bg-base-200"
              placeholder="Enter your email or mobile number"
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
