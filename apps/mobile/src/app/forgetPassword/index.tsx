import { Stack } from "expo-router";
import ForgetPasswordForm from "@/components/forms/forgetPasswordForm";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";

export default function ForgetPassword() {
  return (
    <BoundaryWrapper>
      <ForgetPasswordForm />
    </BoundaryWrapper>
  );
}
