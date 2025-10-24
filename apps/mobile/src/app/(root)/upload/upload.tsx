import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function UploadPage() {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  // Function to get upload signature from your backend
  const getUploadSignature = async () => {
    try {
      // Replace with your actual backend endpoint
      const response = await fetch(
        "http://192.168.1.49:4000/v1/api/sign-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add authentication headers if needed
            // 'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            // You can pass additional parameters here if needed
            folder: "mobile_uploads",
            timestamp: Math.round(Date.now() / 1000),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get signature");
      }

      return data;
    } catch (error) {
      console.error("Signature error:", error);
      throw error;
    }
  };

  // Function to upload image with signature
  const handleSignedUpload = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    setUploading(true);

    try {
      // Get signature from backend
      const signatureData = await getUploadSignature();

      // Create FormData
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: `image_${Date.now()}.jpg`,
      });

      // Add signed parameters
      formData.append("api_key", "322325555249722"); // Your Cloudinary API Key
      formData.append("timestamp", signatureData.timestamp.toString());
      formData.append("signature", signatureData.signature);
      formData.append("folder", "mobile_uploads");

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dra2pandx/image/upload`, // Replace with your cloud name
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const uploadResult = await response.json();

      if (uploadResult.error) {
        throw new Error(uploadResult.error.message);
      }

      if (uploadResult.secure_url) {
        setUploadedImageUrl(uploadResult.secure_url);
        Alert.alert("Success", "Image uploaded successfully!");
        console.log("Upload response:", uploadResult);
      } else {
        throw new Error("Upload completed but no URL received");
      }
    } catch (error) {
      console.log("Upload error", error);
      Alert.alert("Upload Failed", error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access gallery is required!",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images", // Use string instead of enum
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ color: "#666", fontSize: 18, marginBottom: 20 }}>
        Upload Page
      </Text>

      <Button title="Pick an image" onPress={pickImage} />

      {imageUri && (
        <>
          <Image
            source={{ uri: imageUri }}
            style={{
              width: 300,
              height: 300,
              marginVertical: 20,
              borderRadius: 10,
            }}
          />

          {uploading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button
              title="Upload to Cloudinary (Signed)"
              onPress={handleSignedUpload}
            />
          )}
        </>
      )}

      {uploadedImageUrl && (
        <View style={{ marginTop: 20 }}>
          <Text>Uploaded Image:</Text>
          <Image
            source={{ uri: uploadedImageUrl }}
            style={{ width: 200, height: 200, marginTop: 10, borderRadius: 5 }}
          />
        </View>
      )}
    </View>
  );
}
