// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { trpc } from "@/lib/trpc";
// import * as Updates from "expo-updates";
// import { Alert, Text, View } from "react-native";
// import { router } from "expo-router";
// import { FormField } from "@/components/forms/formComponent";
// import PrimaryButton from "@/components/inputs/SubmitBtn";

// const schema = z.object({
//   displayName: z.string().min(1, "Required"),
// });
// type UpdateDisplaySchema = z.infer<typeof schema>;

// export default function UpdateDisplayNameForm({ userId }: { userId: number }) {
//   const { mutate } = useMutation(trpc.auth.updateDisplayName.mutationOptions());
//   const {
//     control,
//     formState: { errors, isSubmitting },
//     handleSubmit,
//   } = useForm<UpdateDisplaySchema>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       displayName: "",
//     },
//   });

//   const onSubmit = (values: UpdateDisplaySchema) => {
//     mutate(
//       { userId, displayName: values.displayName },
//       {
//         onSuccess: async (data) => {
//           Alert.alert("Successful", "Phone Number Verified Successfully", [
//             {
//               text: "OK",
//               onPress: async () => {
//                 router.push("/(root)/(home)/home");
//                 await Updates.reloadAsync();
//               },
//             },
//           ]);
//         },
//         onError: async (error) => {
//           Alert.alert("Oops...", "Something wents wrong!");
//           console.log("oops error while seding otp", error);
//         },
//       },
//     );
//   };

//   return (
//     <View className="min-h-screen items-center px-5 bg-base-100 py-5">
//       <View className="w-full max-w-md">
//         {/* Header Section */}
//         <View className="mb-8">
//           <Text className="text-3xl font-bold text-secondary text-center mb-3">
//             Welcome! 👋
//           </Text>
//           <Text className="text-base text-secondary text-center opacity-70">
//             Let's personalize your account
//           </Text>
//         </View>

//         {/* Card Container */}
//         <View className="bg-base-200 rounded-2xl p-8 border border-gray-200">
//           {/* Icon or Avatar Placeholder */}
//           <View className="items-center mb-6">
//             <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-4">
//               <Text className="text-4xl">👤</Text>
//             </View>
//             <Text className="text-lg font-semibold text-secondary mb-2">
//               Enter Display Name
//             </Text>
//             <Text className="text-sm text-secondary opacity-60 text-center">
//               This is how others will see you
//             </Text>
//           </View>

//           {/* Display Name Input */}
//           <View className="mb-6">
//             <FormField
//               labelHidden
//               required={false}
//               control={control}
//               name="displayName"
//               label="Enter Your Display Name"
//               component="input"
//               placeholder="Example: John Doe"
//               keyboardType="default"
//               className="bg-base-100 rounded-xl text-center text-lg font-medium"
//               error={errors.displayName?.message}
//             />
//           </View>

//           {/* Update Button */}
//           <View className="mb-4">
//             <PrimaryButton
//               title="Continue"
//               disabled={isSubmitting}
//               className="w-full rounded-xl py-4"
//               onPress={handleSubmit(onSubmit)}
//             />
//           </View>
//         </View>

//         {/* Bottom Info */}
//         <View className="mt-6 px-4">
//           <Text className="text-xs text-secondary text-center opacity-60">
//             You can change this anytime in settings
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// }


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import * as Updates from "expo-updates";
import { Alert, Text, View, Modal, Pressable } from "react-native";
import { router } from "expo-router";
import { FormField } from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";

const schema = z.object({
  displayName: z.string().min(1, "Required"),
});
type UpdateDisplaySchema = z.infer<typeof schema>;

export default function UpdateDisplayNameModal({ 
  visible, 
  userId,
  onClose 
}: { 
  visible: boolean;
  userId: number;
  onClose?: () => void;
}) {
  const { mutate } = useMutation(trpc.auth.updateDisplayName.mutationOptions());
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<UpdateDisplaySchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
    },
  });

  const onSubmit = (values: UpdateDisplaySchema) => {
    mutate(
      { userId, displayName: values.displayName },
      {
        onSuccess: async (data) => {
          Alert.alert("Successful", "Display Name Updated Successfully", [
            {
              text: "OK",
              onPress: async () => {
                await Updates.reloadAsync();
              },
            },
          ]);
        },
        onError: async (error) => {
          Alert.alert("Oops...", "Something went wrong!");
          console.log("oops error while updating display name", error);
        },
      },
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <View className="w-full max-w-md">
          {/* Card Container */}
          <View className="bg-base-200 rounded-2xl p-8 border border-gray-200">
            {/* Icon or Avatar Placeholder */}
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-4">
                <Text className="text-4xl">👤</Text>
              </View>
              <Text className="text-2xl font-bold text-secondary mb-2">
                Welcome! 👋
              </Text>
              <Text className="text-lg font-semibold text-secondary mb-2">
                Enter Display Name
              </Text>
              <Text className="text-sm text-secondary opacity-60 text-center">
                This is how others will see you
              </Text>
            </View>

            {/* Display Name Input */}
            <View className="mb-6">
              <FormField
                labelHidden
                required={false}
                control={control}
                name="displayName"
                label="Enter Your Display Name"
                component="input"
                placeholder="Example: John Doe"
                keyboardType="default"
                className="bg-base-100 rounded-xl text-center text-lg font-medium"
                error={errors.displayName?.message}
              />
            </View>

            {/* Update Button */}
            <View className="mb-4">
              <PrimaryButton
                title="Continue"
                disabled={isSubmitting}
                className="w-full rounded-xl py-4"
                onPress={handleSubmit(onSubmit)}
              />
            </View>

            {/* Skip Option - Optional, remove if you want to force users to set display name */}
            {onClose && (
              <Pressable onPress={onClose} className="py-2">
                <Text className="text-center text-sm text-secondary opacity-60">
                  Skip for now
                </Text>
              </Pressable>
            )}
          </View>

          {/* Bottom Info */}
          <View className="mt-4 px-4">
            <Text className="text-xs text-white/80 text-center">
              You can change this anytime in settings
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}