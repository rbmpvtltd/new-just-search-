import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import { fetchChangePassword } from "@/query/auth";
import {
  type ChangePasswordData,
  changePasswordSchema,
} from "@/schemas/changePasswordSchema";
import { useAuthStore } from "@/store/authStore";
import Input from "../inputs/Input";
import LableText from "../inputs/LableText";
import PrimaryButton from "../inputs/SubmitBtn";
import ErrorText from "../ui/ErrorText";

export default function ChangePassForm() {
  const token = useAuthStore((state) => state.token); //
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      cpass: "",
      newpass: "",
      renewpass: "",
    },
  });

  const onSubmit = async (data: ChangePasswordData) => {
    setLoading(true);

    if (!token) {
      console.log("Token missing!");
      return;
    }
    const response = await fetchChangePassword(data);
    if (response.success) {
      Alert.alert("Password Changed Successfully");
      reset();
    } else {
      Alert.alert("Password not changed");
    }
    setLoading(false);
    console.log(response);
  };

  return (
    <View className="m-4 shadow-md bg-base-200 rounded-lg h-full">
      <Text className="text-secondary text-4xl font-semibold mx-8 my-2">
        Change Password
      </Text>

      <LableText title="Old Password" />
      <Controller
        control={control}
        name="cpass"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            className="bg-base-200 w-[90%] mx-auto"
            placeholder="Current Password"
            // secureTextEntry
            isPassword
          />
        )}
      />
      {errors.cpass && <ErrorText title={errors.cpass.message} />}

      <LableText title="New Password" />
      <Controller
        control={control}
        name="newpass"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            className="bg-base-200 w-[90%] mx-auto"
            placeholder="New Password"
            // secureTextEntry
            isPassword
          />
        )}
      />
      {errors.newpass && <ErrorText title={errors.newpass.message} />}

      <LableText title="Confirm Password" />
      <Controller
        control={control}
        name="renewpass"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            className="bg-base-200 w-[90%] mx-auto"
            placeholder="Confirm New Password"
            // secureTextEntry
            isPassword
          />
        )}
      />
      {errors.renewpass && <ErrorText title={errors.renewpass.message} />}

      <View className="flex-1 mb-4 m-auto w-[49%] mt-4">
        <PrimaryButton
          isLoading={isSubmitting}
          title="Submit"
          loadingText="Submitting..."
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          textClassName="text-secondary text-lg font-semibold"
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
}
