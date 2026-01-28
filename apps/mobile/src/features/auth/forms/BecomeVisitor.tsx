// import { FormField } from "@/components/forms/formComponent";
// import PrimaryButton from "@/components/inputs/SubmitBtn";
// import { trpc } from "@/lib/trpc";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { useEffect, useId, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Alert, Pressable, Text, View } from "react-native";
// import z from "zod";
// import { useAuthStore } from "../authStore";
// import { setTokenRole } from "@/utils/secureStore";

// const becomeVisitorySchema = z.object({
//   phone: z.string().min(1),
// });
// type OTPSendSchemaType = z.infer<typeof becomeVisitorySchema>;

// const otpVerifySchema = z.object({
//   otp: z.string().length(6).regex(/^\d+$/),
// });
// type OTPVerifySchemaType = z.infer<typeof otpVerifySchema>;

// export function BecomeVisitorForm() {
//   const id = useId();

//   const [step, setStep] = useState<"send" | "verify">("send");
//   const [masked, setMasked] = useState("");
//   const [phone, setIdentifier] = useState("");
//   const [resendTimer, setResendTimer] = useState(0);
//   const {setToken,token} = useAuthStore(state => state)
//   useEffect(() => {
//     if (resendTimer <= 0) return;

//     const timer = setInterval(() => {
//       setResendTimer((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [resendTimer]);

//   const {
//     control: otpSendControl,
//     handleSubmit: handleSendOtpSend,
//     formState: { errors: sendOtpError, isSubmitting: otpIsSubmitting },
//   } = useForm<OTPSendSchemaType>({
//     resolver: zodResolver(becomeVisitorySchema),
//     defaultValues: {
//       phone: "",
//     },
//   });

//   const {
//     control: verifyControl,
//     handleSubmit: handleVerifySubmit,
//     formState: { errors: verifyError, isSubmitting: verifyIsSubmitting },
//     reset: verifyReset,
//   } = useForm<OTPVerifySchemaType>({
//     resolver: zodResolver(otpVerifySchema),
//     defaultValues: {
//       otp: "",
//     },
//   });
//   const sendOtpMutation = useMutation(trpc.auth.sendOTP.mutationOptions());

//   const verifyOtpMutation = useMutation(
//     trpc.auth.verifyVisitorBecomeOtp.mutationOptions(),
//   );

//   function onSubmitSend(values: OTPSendSchemaType) {
//     setIdentifier(values.phone);
//     sendOtpMutation.mutate(values, {
//       onSuccess: () => {
//         const id = values.phone;
//         const mask = id.includes("@")
//           ? id.replace(/(.{2}).+(@.*)/, "$1*****$2")
//           : id.replace(/.(?=.{4})/g, "*");
//         Alert.alert("Successful", `OTP sent successfully on ${mask}`);
//         setMasked(mask);
//         setStep("verify");
//       },
//       onError: (error) => {
//         if (error.data?.httpStatus === 401) {
//           Alert.alert(
//             "Already In Use",
//             "Mobile number you've try with singup is already in use! try login or use another number",
//           );
//         } else {
//           Alert.alert(
//             "Something Wents Wrong",
//             "something wents wrong couldn't send otp",
//           );
//         }
//       },
//     });
//     setResendTimer(60);
//     const interval = setInterval(() => {
//       setResendTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   }

//   function onSubmitVerify(values: OTPVerifySchemaType) {
//     verifyOtpMutation.mutate(
//       { phoneNumber: phone, otp: values.otp },
//       {
//         onSuccess: (data) => {
//           setTokenRole(token ?? "",data.role)
//           Alert.alert("Successful", "Phone Number Verified Successfully");
//           console.log("==== data in BecomeVisitory.tsx line:110 ====>", data);
//         },
//         onError: async (err) => {
//           Alert.alert("Invalid OTP", "Invalid OTP Try Again");
//         },
//       },
//     );
//   }
//   const handleResendOTP = async () => {
//     if (resendTimer > 0) return;
//     sendOtpMutation.mutate(
//       { phone },
//       {
//         onSuccess: () => {
//           const mask = phone.includes("@")
//             ? id.replace(/(.{2}).+(@.*)/, "$1*****$2")
//             : id.replace(/.(?=.{4})/g, "*");
//           Alert.alert("Successful", `OTP sent successfully on ${mask}`);
//         },
//       },
//     );
//   };
//   const handleBack = () => {
//     setStep("send");
//     verifyReset();
//   };

//   if (step === "verify") {
//     return (
//       <View className="flex min-h-screen items-center justify-center px-4">
//         <View className="w-full max-w-md space-y-6">
//           <View className="text-center space-y-2">
//             <Text className="text-3xl font-bold">Verify OTP</Text>
//             <Text className="text-sm text-muted-foreground">
//               Code was sent to {masked}
//             </Text>
//           </View>

//           <FormField
//             control={verifyControl}
//             name="otp"
//             component="input"
//             error={verifyError.otp?.message}
//           />

//           <PrimaryButton
//             title="Send OTP"
//             disabled={verifyIsSubmitting}
//             className="w-full"
//             onPress={handleVerifySubmit(onSubmitVerify)}
//           />

//           <View className="mt-6 space-y-3 text-center text-sm">
//             <Pressable
//               onPress={handleResendOTP}
//               disabled={resendTimer > 0 || sendOtpMutation.isPending}
//               className={`text-primary hover:underline disabled:text-muted-foreground disabled:no-underline ${resendTimer > 0 ? "cursor-not-allowed" : ""}`}
//             >
//               {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
//             </Pressable>

//             <View>
//               <Pressable
//                 onPress={handleBack}
//                 className="text-muted-foreground hover:text-primary hover:underline"
//               >
//                 ← You Didn't Get OTP On {masked}? Edit Your Number
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     // <View className="flex gap-6 m-4 p-4">
//       <View className="w-full shadow-xl border border-gray-300 rounded-md mx-auto">
//         <View>
//           <View className="flex gap-6">
//             <View className="text-center">
//               <Text className="text-2xl text-secondary font-bold">
//                 Verify Your Number To Become A Visitor
//               </Text>
//               <Text className="text-secondary text-sm mt-2">
//                 Enter your phone number to receive an OTP.
//               </Text>
//             </View>

//             <FormField
//               control={otpSendControl}
//               name="phone"
//               component="input"
//               error={sendOtpError.phone?.message}
//             />

//             <PrimaryButton
//               title="Send OTP"
//               disabled={otpIsSubmitting}
//               className="w-full"
//               onPress={handleSendOtpSend(onSubmitSend)}
//             />
//           </View>
//         </View>
//       </View>
//     // </View>
//   );
// }

import { FormField } from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";
import z from "zod";
import { useAuthStore } from "../authStore";
import { setTokenRole } from "@/utils/secureStore";
import { router } from "expo-router";
import * as Updates from 'expo-updates';

const becomeVisitorySchema = z.object({
  phone: z.string().min(1),
});
type OTPSendSchemaType = z.infer<typeof becomeVisitorySchema>;

const otpVerifySchema = z.object({
  otp: z.string().length(6).regex(/^\d+$/),
});
type OTPVerifySchemaType = z.infer<typeof otpVerifySchema>;

export function BecomeVisitorForm() {
  const id = useId();

  const [step, setStep] = useState<"send" | "verify">("send");
  const [masked, setMasked] = useState("");
  const [phone, setIdentifier] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const { setToken, token } = useAuthStore((state) => state);
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const {
    control: otpSendControl,
    handleSubmit: handleSendOtpSend,
    formState: { errors: sendOtpError, isSubmitting: otpIsSubmitting },
  } = useForm<OTPSendSchemaType>({
    resolver: zodResolver(becomeVisitorySchema),
    defaultValues: {
      phone: "",
    },
  });

  const {
    control: verifyControl,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyError, isSubmitting: verifyIsSubmitting },
    reset: verifyReset,
  } = useForm<OTPVerifySchemaType>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      otp: "",
    },
  });
  const sendOtpMutation = useMutation(trpc.auth.sendOTP.mutationOptions());

  const verifyOtpMutation = useMutation(
    trpc.auth.verifyVisitorBecomeOtp.mutationOptions(),
  );

  function onSubmitSend(values: OTPSendSchemaType) {
    setIdentifier(values.phone);
    sendOtpMutation.mutate(values, {
      onSuccess: () => {
        const id = values.phone;
        const mask = id.includes("@")
          ? id.replace(/(.{2}).+(@.*)/, "$1*****$2")
          : id.replace(/.(?=.{4})/g, "*");
        Alert.alert("Successful", `OTP sent successfully on ${mask}`);
        setMasked(mask);
        setStep("verify");
      },
      onError: (error) => {
        if (error.data?.httpStatus === 401) {
          Alert.alert(
            "Already In Use",
            "Mobile number you've try with singup is already in use! try login or use another number",
          );
        } else {
          Alert.alert(
            "Something Wents Wrong",
            "something wents wrong couldn't send otp",
          );
        }
      },
    });
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
  }

  function onSubmitVerify(values: OTPVerifySchemaType) {
    verifyOtpMutation.mutate(
      { phoneNumber: phone, otp: values.otp },
      {
        onSuccess: (data) => {
          setTokenRole(token ?? "", data.role);
          Alert.alert("Successful", "Phone Number Verified Successfully",[
          {
            text: "OK",
            onPress: async () => {
              router.push("/(root)/(home)/home");
              // Reload the app
              await Updates.reloadAsync();
            },
          },
        ]);
          router.push("/(root)/(home)/home")
          console.log("==== data in BecomeVisitory.tsx line:110 ====>", data);
        },
        onError: async (err) => {
          Alert.alert("Invalid OTP", "Invalid OTP Try Again");
        },
      },
    );
  }
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    sendOtpMutation.mutate(
      { phone },
      {
        onSuccess: () => {
          const mask = phone.includes("@")
            ? id.replace(/(.{2}).+(@.*)/, "$1*****$2")
            : id.replace(/.(?=.{4})/g, "*");
          Alert.alert("Successful", `OTP sent successfully on ${mask}`);
        },
      },
    );
  };
  const handleBack = () => {
    setStep("send");
    verifyReset();
  };

  if (step === "verify") {
    return (
      <View className="min-h-screen items-center px-5 bg-base-100 py-10">
        <View className="w-full max-w-md">
          {/* Header Section */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-secondary text-center mb-3">
              Verify OTP
            </Text>
            <Text className="text-base text-secondary text-center opacity-70">
              Code was sent to{" "}
              <Text className="font-semibold text-primary">{masked}</Text>
            </Text>
          </View>

          {/* Card Container */}
          <View className="bg-base-200 rounded-2xl p-4 border border-gray-200">
            {/* OTP Input */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-secondary mb-3">
                What feedback do you have?
                <Text className="text-error"> * </Text>
              </Text>

              <FormField
                labelHidden
                required={false}
                control={verifyControl}
                name="otp"
                label="Phone Number"
                component="input"
                placeholder="000000"
                keyboardType="numeric"
                className="text-center text-2xl tracking-widest font-bold"
                error={verifyError.otp?.message}
              />
            </View>

            {/* Verify Button */}
            <View className="mb-6">
              <PrimaryButton
                title="Verify Your Number"
                disabled={verifyIsSubmitting}
                className="w-full rounded-xl "
                onPress={handleVerifySubmit(onSubmitVerify)}
              />
            </View>

            {/* Footer Actions */}
            <View>
              {/* Resend OTP */}
              <Pressable
                onPress={handleResendOTP}
                disabled={resendTimer > 0 || sendOtpMutation.isPending}
                className="py-3"
              >
                <Text
                  className={`text-center text-base font-semibold ${
                    resendTimer > 0 || sendOtpMutation.isPending
                      ? "text-gray-400"
                      : "text-primary underline"
                  }`}
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </Text>
              </Pressable>

              {/* Divider */}
              <View className="h-px bg-gray-300 my-2" />

              {/* Back Button */}
              <Pressable onPress={handleBack} className="py-3">
                <Text className="text-center text-sm text-secondary opacity-80">
                  ← You Didn't Get OTP On{" "}
                  <Text className="font-semibold text-primary">{masked}</Text>?
                  {"\n"}
                  <Text className="text-primary underline font-medium">
                    Edit Your Number
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Bottom Info */}
          <View className="mt-6 px-4">
            <Text className="text-xs text-secondary text-center opacity-60">
              Please check your messages for the verification code
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="min-h-screen items-center px-5 bg-base-100 py-10">
      <View className="w-full max-w-lg">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-secondary text-center mb-3">
            Verify Your Number
          </Text>
          <Text className="text-2xl font-semibold text-primary text-center mb-4">
            Become A Visitor
          </Text>
          <Text className="text-base text-secondary text-center opacity-70">
            Enter your phone number to receive an OTP
          </Text>
        </View>

        <View className="bg-base-200 rounded-2xl p-8 border border-gray-200">
          <View className="mb-6">
            
            <FormField
              control={otpSendControl}
              name="phone"
              label="Phone Number "
              component="input"
              placeholder="9876543210"
              keyboardType="numeric"
              className="bg-base-100 rounded-xl"
              error={sendOtpError.phone?.message}
            />
          </View>

          <View className="mb-6">
            <PrimaryButton
              title="Send OTP"
              disabled={otpIsSubmitting}
              className=" rounded-xl py-4"
              onPress={handleSendOtpSend(onSubmitSend)}
            />
          </View>
          <View className="h-px bg-gray-300 my-4" />
        </View>
        <View className="mt-6 px-4">
          <Text className="text-xs text-secondary text-center opacity-60">
            By continuing, you agree to receive SMS verification codes
          </Text>
        </View>
      </View>
    </View>
  );
}
