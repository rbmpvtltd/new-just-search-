import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import type React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import Colors from "@/constants/Colors";
import { fetchLogin, fetchVerifyAuth } from "@/query/auth";
import { sendOtp } from "@/query/sendOtp";
import { verifyBusinessOtp } from "@/query/verifyBusiness";
import { type VerifyOtpData, verifyOtp } from "@/query/verifyOtp";
import { type SignupFormData, signupSchema } from "@/schemas/signupSchema";
import { useAuthStore } from "@/store/authStore";
import { setToken } from "@/utils/secureStore";
import Input from "../inputs/Input";

// import { Pressable } from 'react-native-gesture-handler';

const SignupComponent: React.FC = () => {
  const { setToken: setAuthStoreToken } = useAuthStore(); // Get setToken from Zustand
  const [agree, setAgree] = useState(false);
  const colorScheme = useColorScheme();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      mobile_no: "",
      otp: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [mobile_no, otp, password] = watch(["mobile_no", "otp", "password"]);

  const onSubmit = async (data: VerifyOtpData) => {
    const response = await verifyBusinessOtp(data);
    if (response.success) {
      setAuthStoreToken(response.token, response.role);
      await setToken(response.token);
      return router.back();
    }
    Alert.alert(response.message);
  };

  return (
    <View className="flex-1 justify-center items-center p-4 w-full">
      <Text className="text-3xl font-bold mb-8 text-secondary">Register</Text>

      <View className="w-full max-w-md">
        <Text className="text-lg font-medium text-secondary mb-2">
          Phone Number:
        </Text>
        <Controller
          control={control}
          name="mobile_no"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-secondary bg-base-200 mb-2"
              placeholder="Enter your mobile no"
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
            const response = await sendOtp({ mobile_no });
            console.log(response);
            if (response.success) {
              console.log("opt sended successfully");
              Alert.alert("Successfull", "OTP Sended Successfully", [
                { text: "Got It" },
              ]);
            } else {
              console.log("something went wrong");
              Alert.alert(response?.data?.message);
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

        <Text className="text-lg font-medium text-secondary mb-2">OTP:</Text>
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-secondary bg-base-200 mb-2"
              placeholder="Enter Your OTP"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          )}
        />
        {errors.otp && (
          <Text className="text-error text-sm mb-4">{errors.otp.message}</Text>
        )}

        <Text className="text-lg font-medium text-secondary mb-2">Email:</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-secondary bg-base-200 mb-2"
              placeholder="Enter your Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text className="text-error text-sm mb-4">
            {errors.email.message}
          </Text>
        )}
        <Text className="text-lg font-medium text-secondary mb-2">
          Password:
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-secondary bg-base-200 mb-2"
              placeholder="Enter Your Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              isPassword
              autoCapitalize="none"
            />
          )}
        />
        {errors.password && (
          <Text className="text-error text-sm mb-4">
            {errors.password.message}
          </Text>
        )}

        <Text className="text-lg font-medium text-secondary mb-2">
          Confirm Password:
        </Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-secondary bg-base-200 mb-2"
              placeholder="Confirm Your Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              isPassword
              autoCapitalize="none"
            />
          )}
        />
        {errors.confirmPassword && (
          <Text className="text-error text-sm mb-4">
            {errors.confirmPassword.message}
          </Text>
        )}
        <View>
          <Checkbox.Item
            label={"I have read and agree with the above "}
            status={agree ? "checked" : "unchecked"}
            onPress={() => setAgree(!agree)}
            labelStyle={{ color: Colors[colorScheme ?? "light"].secondary }}
            color={agree ? Colors[colorScheme ?? "light"].primary : undefined}
          />
          <Pressable
            onPress={() => {
              router.navigate("/user/termCondition");
            }}
          >
            <Text className="px-5 -mt-4 font-semibold underline text-primary">
              Term and Conditions
            </Text>
          </Pressable>
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={!agree || isSubmitting}
          className={`w-full mt-5 p-4 rounded-lg flex items-center justify-center ${
            isSubmitting || !agree ? "bg-primary-content " : "bg-primary "
          }`}
        >
          <Text className="text-secondary text-lg font-semibold">
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupComponent;
