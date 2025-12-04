import type React from "react";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import BusinessHireLogin from "../../../components/forms/businessHireLogin";
import SignupComponent from "../../../components/forms/signup";

const LoginComponent: React.FC = () => {
  const [alreadHaveAc, setAlreadyHaveAc] = useState<boolean>(true);

  return (
    <>
      {alreadHaveAc && <BusinessHireLogin />}
      {!alreadHaveAc && <SignupComponent />}
      <Pressable
        className="mx-auto"
        onPress={() => setAlreadyHaveAc((pre) => !pre)}
      >
        <Text className="text-secondary-content mb-8">
          {alreadHaveAc
            ? "Don't Have An account ? signup"
            : "Already Have An account ? signin"}
        </Text>
      </Pressable>
    </>
  );
};

export default LoginComponent;
