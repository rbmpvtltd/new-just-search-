import { Text, useColorScheme, StyleProp, ViewStyle, View } from "react-native";
import React from "react";
import {
  GestureHandlerRootView,
  Pressable,
  PressableProps,
} from "react-native-gesture-handler";
import Colors from "@/constants/Colors";

interface PrimaryButtonProps extends Omit<PressableProps, "onPress"> {
  isLoading?: boolean;
  title?: string;
  loadingText?: string;
  className?: string;
  textClassName?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>; // Allow external style override
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  isLoading = false,
  title = "Submit",
  loadingText = "Processing...",
  className = "",
  textClassName = "",
  disabled,
  style,
  ...rest
}) => {
  const colorScheme = useColorScheme();

  const defaultStyle: StyleProp<ViewStyle> = {
    borderRadius: 8,
    padding: 15,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors[colorScheme ?? "light"].primary,
  };

  return (
    <GestureHandlerRootView>
      <View className={className}>
        <Pressable
          style={[defaultStyle, style]} // ✅ merge default + custom
          disabled={isLoading || disabled}
          {...rest}
        >
          <Text className={textClassName}>
            {isLoading ? loadingText : title}
          </Text>
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
};

export default PrimaryButton;
