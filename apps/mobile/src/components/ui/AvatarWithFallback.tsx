import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, useColorScheme } from "react-native";

export default function AvatarWithFallback({
  uri,
  index = 1,
  imageClass = "w-[50px] h-[50px]",
  iconSize = 35,
  iconClass = "w[50px]",
  imageStyle,
}: {
  uri: string;
  index?: number;
  imageClass?: string;
  iconSize?: number;
  iconClass?: string;
  imageStyle?: any;
}) {
  const colorScheme = useColorScheme();
  const [hasError, setHasError] = useState(false);

  if (!uri || hasError) {
    return (
      <Ionicons
        name="person"
        size={iconSize}
        className={`${index % 2 === 0 ? "bg-base-100" : "bg-base-200"} text-center p-2 rounded-full ${iconClass}`}
        color={Colors[colorScheme ?? "light"].secondary}
      />
    );
  }

  return (
    <Image
      className={`rounded-full ${imageClass}`}
      source={{ uri }}
      onError={() => setHasError(true)}
      style={imageStyle}

    />
  );
}
