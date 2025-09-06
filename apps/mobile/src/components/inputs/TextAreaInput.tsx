import Colors from "@/constants/Colors";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TextInputProps,
  useColorScheme,
} from "react-native";

type TextAreaInputProps = TextInputProps & {
  customStyle?: object;
  className?: string;
};

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  customStyle,
  className = "",
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const [height, setHeight] = useState<number>(120);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TextInput
        className={`${className}`}
        multiline={true}
        textAlignVertical="top"
        onContentSizeChange={(e) => {
          setHeight(e.nativeEvent.contentSize.height);
        }}
        style={[
          {
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            borderWidth: 2,
            lineHeight: 24,
            minHeight: Math.max(height, 120),
            color: Colors[colorScheme ?? "light"]["secondary-content"],
          },
          customStyle,
        ]}
        placeholderTextColor={
          Colors[colorScheme ?? "light"]["base-300"] ??
          Colors["light"]["base-300"]
        }
        {...rest}
      />
    </KeyboardAvoidingView>
  );
};

export default TextAreaInput;
