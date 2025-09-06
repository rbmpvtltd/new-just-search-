import { Alert } from "react-native";

export function showLoginAlert({
  title = "Login Required",
  message = "Please log in to continue",
  onConfirm,
}: {
  title?: string;
  message?: string;
  onConfirm: () => void;
}) {
  Alert.alert(
    title,
    message,
    [
      {
        text: "No Thanks",
        style: "cancel",
      },
      {
        text: "Login Now",
        style: "destructive",
        onPress: onConfirm,
      },
    ],
    { cancelable: false },
  );
}
