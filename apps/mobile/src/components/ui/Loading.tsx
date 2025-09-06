import { ActivityIndicator, View } from "react-native";

export const Loading = ({
  position = "none",
  size = "large",
}: {
  position?: "none" | "center";
  size?: "large" | "small" | number;
}) => {
  return (
    <View
      className={`${position === "center" ? "flex-1 justify-center items-center" : ""} `}
    >
      <ActivityIndicator size={size} />
    </View>
  );
};
