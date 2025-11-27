import { zodResolver } from "@hookform/resolvers/zod";
import { router, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import {
  sendForgetPasswordOtp,
  verifyForgetPasswordOtp,
} from "@/query/forgetPassword";
import { fetchVisitorData } from "@/query/sendVisitorOtp";
import {
  type ForgetPasswordFormData,
  forgetPasswordSchema,
} from "@/schemas/loginSchema";
import { useAuthStore } from "@/store/authStore";
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
      await setTokenRole(response.token,response.role);
      return router.navigate("/(root)/profile");
    }
    Alert.alert(response.message);
  };

  return (
    <View className="flex-1  p-4 w-full">
      <Text className="text-2xl font-bold mb-8 text-secondary">
        Forget Password
      </Text>

      <View className="w-full max-w-md">
        <Text className="text-lg font-medium text-secondary mb-2">
          Mobile Number :
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
          className={`w-full mt-5 p-4 rounded-lg flex items-center justify-center ${
            isSubmitting ? "bg-primary-content" : "bg-primary"
          }`}
        >
          <Text className="text-secondary text-lg font-semibold">
            {isSubmitting ? "Sending..." : "Send OTP"}
          </Text>
        </TouchableOpacity>

        <Text className="text-lg font-medium text-secondary-content mb-2">
          OTP :
        </Text>
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
          <Text className="text-error text-sm mb-4">{errors.otp.message}</Text>
        )}

        <Text className="text-lg font-medium text-secondary-content mb-2">
          Enter New Password :
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

        <TouchableOpacity
          onPress={() => onSubmit({ mobile_no, otp, password })}
          disabled={isSubmitting}
          className={`w-full mt-5 p-4 rounded-lg flex items-center justify-center ${
            isSubmitting ? "bg-primary-content" : "bg-primary"
          }`}
        >
          <Text className="text-secondary text-lg font-semibold">
            {isSubmitting ? "Loading..." : " Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
