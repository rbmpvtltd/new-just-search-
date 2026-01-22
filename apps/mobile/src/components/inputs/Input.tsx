import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef } from "react";
import {
  Pressable,
  TextInput,
  type TextInputProps,
  useColorScheme,
  View,
} from "react-native";
import Colors from "@/constants/Colors";

type InputProps = TextInputProps & {
  isPassword?: boolean;
  customStyle?: object;
};

const Input = forwardRef<TextInput, InputProps>(
  ({ customStyle, isPassword = false, editable = true, ...rest }, ref) => {
    const colorScheme = useColorScheme();
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <View className="relative">
        <TextInput
          returnKeyType="done"
          ref={ref}
          editable={editable}
          style={[
            {
              height: 50,
              padding: 10,
              borderWidth: 2,
              borderRadius: 8,
              fontSize: 16,
              color: Colors[colorScheme ?? "light"]["secondary"],
              paddingRight: isPassword ? 50 : 10,
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
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color={Colors[colorScheme ?? "light"]["secondary"]}
            />
          </Pressable>
        )}
      </View>
    );
  },
);

export default Input;
