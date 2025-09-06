import { Linking } from "react-native";

export const dialPhone = (phoneNumber: string) => {
  Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
    console.error("Error opening dialer", err),
  );
};
