import type React from "react";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import LoginFrom from "@/features/auth/forms/LoginFrom";
import SignupComponent from "@/features/auth/forms/SignUpForm";

const LoginComponent: React.FC = () => {
  const [alreadHaveAc, setAlreadyHaveAc] = useState<boolean>(true);

  return (
    <>
      {alreadHaveAc && <LoginFrom />}
      {!alreadHaveAc && <SignupComponent />}
      <Pressable
        className="mx-auto"
        onPress={() => setAlreadyHaveAc((pre) => !pre)}
      >
        <Text className="text-secondary-content mb-8 underline">
          {alreadHaveAc
            ? "Don't Have An account ? Signup"
            : "Already Have An account ? Login"}
        </Text>
      </Pressable>
    </>
  );
};

export default LoginComponent;
