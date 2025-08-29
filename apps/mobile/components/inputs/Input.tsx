import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  useColorScheme,
} from "react-native";
import Colors from "@/constants/Colors";

// Extend TextInputProps to accept all standard props + optional custom ones
type InputProps = TextInputProps & {
  isPassword?: boolean;
  customStyle?: object;
};

const Input: React.FC<InputProps> = ({
  customStyle,
  isPassword = false,
  editable = true,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TextInput
        editable={editable}
        style={[
          {
            height: 50,
            padding: 10,
            borderWidth: 2,
            borderRadius: 8,
            fontSize: 16,
            color: Colors[colorScheme ?? "light"]["secondary"],
            paddingRight: isPassword ? 55 : 10,
          },
          customStyle,
        ]}
        placeholderTextColor={
          Colors[colorScheme ?? "light"]["base-300"] ??
          Colors["light"]["base-300"]
        }
        secureTextEntry={isPassword && !showPassword}
        {...rest}
      />
      {isPassword && (
        <Pressable
          onPress={() => setShowPassword((prev) => !prev)}
          className="absolute right-10 top-3.5"
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color={Colors[colorScheme ?? "light"]["secondary"]}
          />
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
};

export default Input;
