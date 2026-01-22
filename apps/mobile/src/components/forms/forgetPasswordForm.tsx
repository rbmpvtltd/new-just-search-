import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/features/auth/authStore";
import {
  type ForgetPasswordFormData,
  forgetPasswordSchema,
} from "@/features/auth/schema/loginSchema";
import {
  sendForgetPasswordOtp,
  verifyForgetPasswordOtp,
} from "@/query/forgetPassword";
import { setTokenRole } from "@/utils/secureStore";
import Input from "../inputs/Input";

export default function ForgetPasswordForm() {
  const {
    control,
    handleSubmit,
    watch,
    getValues,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      mobile_no: "",
      otp: "",
      password: "",
    },
  });
  const setAuthStoreToken = useAuthStore((state) => state.setToken);

  const [mobile_no, otp, password] = watch(["mobile_no", "otp", "password"]);

  const onSubmit = async (data: ForgetPasswordFormData) => {
    const response = await verifyForgetPasswordOtp(data);

    if (response.success) {
      setAuthStoreToken(response.token, response.role);
      await setTokenRole(response.token, response.role);
      return router.navigate("/(root)/profile");
    }
    Alert.alert(response.message);
  };

  return (
    <View className="flex-1 w-full px-4">
      <View className="w-full">
        <View className="mb-5 pt-4">
          <Text className="text-2xl font-bold text-secondary text-center mb-1">
            Reset your password
          </Text>
        </View>
        <View className="rounded-2xl bg-base-200 shadow-sm border border-gray-200 p-6 ">
          <View className="mb-4 w-full">
            <Text className="text-sm font-medium text-secondary mb-1">
              Mobile Number
            </Text>
            <Controller
              control={control}
              name="mobile_no"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className="text-secondary bg-base-200"
                  placeholder="Enter your mobile number"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.mobile_no && (
              <Text className="text-error text-sm mb-4">
                {errors.mobile_no.message}
              </Text>
            )}
          </View>
          <View className="mb-5 w-full">
            <TouchableOpacity
              onPress={async () => {
                const mobileNo = getValues("mobile_no");

                clearErrors("mobile_no");
                if (!mobileNo || !/^\d{10}$/.test(mobileNo)) {
                  control.setError("mobile_no", {
                    type: "manual",
                    message: "Please enter a valid 10-digit mobile number",
                  });
                  return;
                }

                const response = await sendForgetPasswordOtp({
                  mobile_no: mobileNo,
                });
                if (response.success) {
                  Alert.alert("OTP sent successfully");
                } else {
                  console.log(response);
                  Alert.alert("Something went wrong");
                }
              }}
              disabled={isSubmitting}
              className={`w-full mt-6 py-4 rounded-xl items-center justify-center ${
                isSubmitting ? "bg-primary-content" : "bg-primary"
              }`}
            >
              <Text className="text-secondary text-lg font-semibold">
                {isSubmitting ? "Sending..." : "Send OTP"}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mb-2 w-full">
            <Text className="text-sm font-medium text-secondary mb-1">OTP</Text>
            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className="text-secondary bg-base-200"
                  placeholder="Enter OTP"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.otp && (
              <Text className="text-error text-sm mb-4">
                {errors.otp.message}
              </Text>
            )}
          </View>

          <View className="mb-2 w-full">
            <Text className="text-sm font-medium text-secondary mb-1">
              New Password
            </Text>
            <Controller
              control={control}
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
          </View>

          <TouchableOpacity
            onPress={() => onSubmit({ mobile_no, otp, password })}
            disabled={isSubmitting}
            className={`w-full mt-6 py-4 rounded-xl items-center justify-center ${
              isSubmitting ? "bg-primary-content" : "bg-primary"
            }`}
          >
            <Text className="text-secondary text-lg font-semibold">
              {isSubmitting ? "Loading..." : " Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
