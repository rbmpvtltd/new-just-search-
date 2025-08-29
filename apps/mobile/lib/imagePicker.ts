import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

const requestPermissions = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need camera permissions to make this work!");
    return false;
  }
  return true;
};

const MAX_SIZE_BYTES = 1024 * 1024;

export const pickImage = async (fromCamera = false, MAX_SIZE_MB = 1) => {
  if (fromCamera) {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
  }

  const result = await (fromCamera
    ? ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        quality: 0.2,
        allowsEditing: true,
      })
    : ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 0.2,
        allowsEditing: true,
      }));

  if (!result.canceled) {
    const imageUri = result.assets[0].uri;
    const fileInfo = await FileSystem.getInfoAsync(imageUri);

    if (fileInfo.exists && fileInfo.size > MAX_SIZE_BYTES * MAX_SIZE_MB) {
      Alert.alert(
        "Image size is too large",
        "Please select an image with a size less than 2MB",
        [{ text: "OK" }],
        { cancelable: false }
      )
      }

    return imageUri;
  }
};
