// import { StyleSheet, Text, View } from "react-native";

// export const SomethingWrong = () => {
//   return (
//     <View>
//       <Text>Something went wrong</Text>
//     </View>
//   );
// };

// import React from "react";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// export const SomethingWrong = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.icon}>⚠️</Text>
//       <Text style={styles.title}>Something went wrong</Text>
//       <Text style={styles.subtitle}>
//         Please try again later or check your connection.
//       </Text>

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Retry</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8FAFC", // light background
//     padding: 20,
//   },
//   icon: {
//     fontSize: 60,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#1E293B", // dark text
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#64748B", // grayish
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#EF4444", // red
//     paddingHorizontal: 30,
//     paddingVertical: 12,
//     borderRadius: 8,
//     elevation: 3, // android shadow
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Colors from "@/constants/Colors";

export const SomethingWrong = () => {
  const colorScheme = useColorScheme();

  return (
    <View className="flex-1 justify-center items-center bg-base-100 p-5">
      <Text className="text-6xl mb-2">⚠️</Text>
      <Text className="text-xl font-bold text-slate-800 mb-2">
        Something went wrong
      </Text>
      <Text className="text-base text-slate-500 text-center mb-5">
        Please try again later or check your connection.
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: Colors[colorScheme ?? "light"]["primary-content"],
        }}
        className="px-8 py-3 rounded-lg shadow"
      >
        <Pressable onPress={() => router.replace("/user/bottomNav")}>
          <Text className="text-secondary bg-base-100 font-bold">
            Go To Home
          </Text>
        </Pressable>
      </TouchableOpacity>
    </View>
  );
};
