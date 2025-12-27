import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import type React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { z } from "zod";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/features/auth/authStore";
import TermsAndConditions from "@/features/terms-and-conditions/TermConditions";
import { setTokenRole } from "@/utils/secureStore";
import Input from "../../../components/inputs/Input";
import { trpc } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";

// Form schemas
const formSchema = z
  .object({
    displayName: z
      .string()
      .min(3, "Display name must be at least 3 characters long.")
      .max(20, "Display name must be at most 20 characters long."),
    mobileNumber: z
      .string()
      .regex(/^\d+$/, "Mobile must be digits only")
      .min(10, "Mobile number must be 10 digits")
      .max(10, "Mobile number must be 10 digits"),
    email: z.string().optional().or(z.literal("")),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and confirm password do not match",
  });

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be digits only"),
});

const SignUpComponent: React.FC = () => {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [otp, setOTP] = useState<string>("");
  const setAuthStoreToken = useAuthStore((state) => state.setToken);
  const [tempFormData, setTempFormData] = useState<any>(null);
  const colorScheme = useColorScheme();
  const { mutate, isPending } = useMutation(
    trpc.auth.sendOTP.mutationOptions(),
  );
  const { mutate: verifyOTP } = useMutation(
    trpc.auth.verifyOTP.mutationOptions(),
  );
  const [resendTimer, setResendTimer] = useState(0);
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      mobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const sendOTP = async (identifier: string) => {
    try {
      mutate(
        { identifier },
        {
          onSuccess: async () => {
            console.log("otp sended successfully");
          },
          onError: async (error) => {
            Alert.alert("Error", "Could Not Send OTP");
            console.log("oops error while seding otp", error);
          },
        },
      );

      // Start resend timer (60 seconds)
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return true;
    } catch (err) {
      return false;
    }
  };

  // Handle registration form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setTempFormData(data);
    if (data.email) {
      const success = await sendOTP(data.email);
      if (success) {
        setStep("verify");
      }
    } else {
      const success = await sendOTP(String(data.mobileNumber));
      if (success) {
        setStep("verify");
      }
    }
  };

  // Handle OTP verification
  const onVerifyOTP = async (data: z.infer<typeof otpSchema>) => {
    if (data.otp.length !== 6) {
      Alert.alert("Successfull", "OTP send Successfully");

      return;
    }
    console.log("====================> execution comes here");
    try {
      console.log("verifying otp");

      // Prepare the payload, making email optional if not provided
      const verificationPayload: any = {
        phoneNumber: tempFormData.mobileNumber,
        displayName: tempFormData.displayName,
        password: tempFormData.password,
        otp: data.otp,
      };

      // Only include email if it exists and is valid
      if (tempFormData.email && tempFormData.email.trim() !== "") {
        verificationPayload.email = tempFormData.email.trim();
      }

      console.log("Verification payload:", verificationPayload);

      verifyOTP(verificationPayload, {
        onSuccess: async (data) => {
          Alert.alert("Successfull", "OTP send Successfully");

          setAuthStoreToken(data?.session ?? "", data.role ?? "visiter");
          // await Purchases.logIn(data?.revanueCatToken ?? "");
          await setTokenRole(data?.session ?? "", data.role ?? "visiter");
          console.log("registration sucessfully");
          router.push("/");
        },
        onError: async (err) => {
          console.error("OTP verification failed:", err);
          Alert.alert("Error", "Could Not Send OTP");
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    if (tempFormData.email) {
      await sendOTP(tempFormData.email);
    }
    await sendOTP(tempFormData.mobileNumber);
  };

  // Handle back to registration
  const handleBack = () => {
    setStep("register");
    otpForm.reset();
  };

  // OTP Verification Screen
  if (step === "verify") {
    return (
      <View className="flex-1 w-[80%] py-2">
        <View className="">
          <View className="text-center mb-6 w-full">
            <Text className="text-3xl font-bold text-secondary text-center mb-2">
              Verify Your Phone
            </Text>
            <Text className="text-sm text-secondary-content text-center">
              We've sent a 6-digit code to{" "}
              <Text className="font-semibold">
                *******
                {tempFormData?.mobileNumber.slice(7, 10)}
              </Text>
            </Text>
          </View>

          <View className="rounded-2xl bg-base-200 shadow-sm border border-secondary-content p-6 ">
            <View>
              <Text className="text-sm font-medium text-secondary mb-2">
                Enter OTP
              </Text>
              <Controller
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <View>
                    <Input
                      placeholder="000000"
                      maxLength={6}
                      className="rounded-xl text-center text-2xl tracking-widest bg-base-300 text-secondary"
                      value={field.value}
                      onChangeText={(text) => {
                        field.onChange(text);
                        setOTP(text);
                      }}
                      keyboardType="number-pad"
                    />
                    {otpForm.formState.errors.otp && (
                      <Text className="text-error text-sm mt-2">
                        {otpForm.formState.errors.otp.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Pressable
                className=" rounded-xl py-3 font-semibold bg-primary mt-5 items-center justify-center"
                onPress={() => {
                  onVerifyOTP({ otp });
                }}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                ) : (
                  <Text className="text-secondary text-lg font-semibold">
                    Verify OTP
                  </Text>
                )}
              </Pressable>
            </View>

            <View className="mt-6 items-center">
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={resendTimer > 0 || isPending}
                className={resendTimer > 0 ? "opacity-50" : ""}
              >
                <Text
                  className={`text-sm ${
                    resendTimer > 0 ? "text-gray-400" : "text-primary"
                  }`}
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleBack} className="mt-3">
                <Text className="text-sm text-gray-500">
                  ← Back to registration
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Registration Screen
  return (
    <ScrollView className="flex-1 w-full px-4 bg-base-100">
      <View className="flex-1 items-center justify-center py-10">
        <View className="w-full ">
          <View className="text-center mb-6">
            <Text className="text-3xl font-bold text-secondary text-center mb-2">
              Create your account
            </Text>
            <Text className="text-sm text-secondary-content text-center">
              Join <Text className="font-semibold">Just Search</Text> and start
              exploring today
            </Text>
          </View>

          <View className="rounded-2xl bg-base-200 shadow-sm border border-gray-200 p-6">
            <View>
              {/* Display Name */}
              <Controller
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <View className="mb-5">
                    <Text className="text-sm font-medium text-secondary mb-2">
                      Display Name <Text className="text-error">*</Text>
                    </Text>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="rounded-xl bg-base-300 text-secondary"
                      onChangeText={field.onChange}
                      value={field.value}
                    />
                    {form.formState.errors.displayName && (
                      <Text className="text-error text-sm mt-2">
                        {form.formState.errors.displayName.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Mobile Number */}
              <Controller
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <View className="mb-5">
                    <Text className="text-sm font-medium text-secondary mb-2">
                      Mobile Number <Text className="text-error">*</Text>
                    </Text>
                    <Input
                      {...field}
                      placeholder="98765 43210"
                      className="rounded-xl bg-base-300 text-secondary"
                      onChangeText={field.onChange}
                      value={field.value}
                      keyboardType="number-pad"
                    />
                    {form.formState.errors.mobileNumber && (
                      <Text className="text-error text-sm mt-2">
                        {form.formState.errors.mobileNumber.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Email */}
              <Controller
                control={form.control}
                name="email"
                render={({ field }) => (
                  <View className="mb-5">
                    <Text className="text-sm font-medium text-secondary mb-2">
                      Email
                    </Text>
                    <Input
                      {...field}
                      placeholder="example@email.com"
                      className="rounded-xl bg-base-300 text-secondary"
                      onChangeText={field.onChange}
                      value={field.value}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {form.formState.errors.email && (
                      <Text className="text-error text-sm mt-2">
                        {form.formState.errors.email.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Password */}
              <Controller
                control={form.control}
                name="password"
                render={({ field }) => (
                  <View className="mb-5">
                    <Text className="text-sm font-medium text-secondary mb-2">
                      Password <Text className="text-error">*</Text>
                    </Text>
                    <Input
                      {...field}
                      placeholder="••••••••"
                      className="rounded-xl bg-base-300 text-secondary"
                      onChangeText={field.onChange}
                      value={field.value}
                      isPassword
                      autoCapitalize="none"
                    />
                    {form.formState.errors.password && (
                      <Text className="text-error text-sm mt-2">
                        {form.formState.errors.password.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Confirm Password */}
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <View className="mb-5">
                    <Text className="text-sm font-medium text-secondary mb-2">
                      Confirm Password <Text className="text-error">*</Text>
                    </Text>
                    <Input
                      {...field}
                      placeholder="••••••••"
                      className="rounded-xl bg-base-300 text-secondary"
                      onChangeText={field.onChange}
                      value={field.value}
                      isPassword
                      autoCapitalize="none"
                    />
                    {form.formState.errors.confirmPassword && (
                      <Text className="text-error text-sm mt-2">
                        {form.formState.errors.confirmPassword.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <TouchableOpacity
                onPress={form.handleSubmit(onSubmit)}
                className="w-full rounded-xl py-4 font-semibold bg-primary items-center justify-center"
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                ) : (
                  <Text className="text-secondary text-lg font-semibold">
                    Continue
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUpComponent;
