// import type React from "react";
// import {
//   type StyleProp,
//   Text,
//   useColorScheme,
//   View,
//   type ViewStyle,
// } from "react-native";
// import {
//   GestureHandlerRootView,
//   Pressable,
//   type PressableProps,
// } from "react-native-gesture-handler";
// import Colors from "@/constants/Colors";

// interface PrimaryButtonProps extends Omit<PressableProps, "onPress"> {
//   isLoading?: boolean;
//   title?: string;
//   loadingText?: string;
//   className?: string;
//   textClassName?: string;
//   onPress?: () => void;
//   style?: StyleProp<ViewStyle>; // Allow external style override
// }

// const PrimaryButton: React.FC<PrimaryButtonProps> = ({
//   isLoading = false,
//   title = "Submit",
//   loadingText = "Processing...",
//   className = "",
//   textClassName = "",
//   disabled,
//   style,
//   ...rest
// }) => {
//   const colorScheme = useColorScheme();

//   const defaultStyle: StyleProp<ViewStyle> = {
//     borderRadius: 8,
//     padding: 15,
//     minWidth: 100,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors[colorScheme ?? "light"].primary,
//   };

//   return (
//     <GestureHandlerRootView>
//       <View className={className}>
//         <Pressable
//           style={[defaultStyle, style]} // ✅ merge default + custom
//           disabled={isLoading || disabled}
//           {...rest}
//         >
//           <Text className={textClassName}>
//             {isLoading ? loadingText : title}
//           </Text>
//         </Pressable>
//       </View>
//     </GestureHandlerRootView>
//   );
// };

// export default PrimaryButton;

import type React from "react";
import {
  ActivityIndicator,
  type StyleProp,
  Text,
  type TextStyle,
  useColorScheme,
  View,
  type ViewStyle,
} from "react-native";
import {
  GestureHandlerRootView,
  Pressable,
  type PressableProps,
} from "react-native-gesture-handler";
import Colors from "@/constants/Colors";

interface PrimaryButtonProps extends Omit<PressableProps, "onPress"> {
  isLoading?: boolean;
  title: string;
  loadingText?: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  isLoading = false,
  title,
  loadingText = "Processing...",
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const backgroundColor =
    variant === "primary"
      ? theme.primary
      : variant === "secondary"
        ? theme.secondary
        : "transparent";

  const borderColor = variant === "outline" ? theme.primary : "transparent";

  const textColor =
    variant === "outline"
      ? theme.primary
      : variant === "secondary"
        ? theme["secondary-content"]
        : "#fff";

  return (
    <GestureHandlerRootView>
      <Pressable
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[
          {
            height: 52,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor,
            borderWidth: variant === "outline" ? 1.5 : 0,
            borderColor,
            opacity: disabled ? 0.7 : 1,
          },
          style,
        ]}
        {...rest}
      >
        {isLoading ? (
          <View className="flex-row items-center">
            <ActivityIndicator
              size="small"
              color={variant === "outline" ? theme.primary : "#fff"}
              style={{ marginRight: 8 }}
            />
            <Text
              style={[
                {
                  color: textColor,
                  fontSize: 16,
                  fontWeight: "600",
                },
                textStyle,
              ]}
            >
              {loadingText}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              {
                color: textColor,
                fontSize: 16,
                fontWeight: "600",
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </Pressable>
    </GestureHandlerRootView>
  );
};

export default PrimaryButton;
