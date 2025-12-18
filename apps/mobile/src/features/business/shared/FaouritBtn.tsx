import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { IoMdHeart } from "react-icons/io";
import { Alert, Pressable, useColorScheme } from "react-native";
import Swal from "sweetalert2";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/features/auth/authStore";
import { trpc } from "@/lib/trpc";

function Favourite({
  businessId,
  initialFav,
}: {
  businessId: number;
  initialFav: boolean;
}) {
  const [isFavourite, setIsFavourite] = useState<boolean>(initialFav);
  const colorScheme = useColorScheme();
  const authenticated = useQuery(trpc.auth.verifyauth.queryOptions());

  const mutation = useMutation(
    trpc.businessrouter.toggleFavourite.mutationOptions({
      onSuccess: (data) => {
        setIsFavourite(data.status === "added");
      },
      onError: (err) => {
        setIsFavourite((prev) => !prev);
        if (err.shape?.data.httpStatus === 401) {
          Alert.alert("Login Required", "Need To Login For Add In Favourite", [
            {
              text: "Cancel",
              onPress: () => router.push("/(root)/profile"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        }
      },
    }),
  );

  const handleToggle = () => {
    if (!authenticated.data) {
      Alert.alert(
        "Login Required",
        "Need To Login For Add In Your Favourites",
        [
          { text: "No Thanks", onPress: () => console.log("OK Pressed") },
          {
            text: "Login Now",
            onPress: () => router.push("/(root)/profile"),
            style: "cancel",
          },
        ],
      );
      return;
    }
    setIsFavourite((prev) => !prev);
  };

  const handleClick = () => {
    if (!authenticated.data) {
      return;
    }
    mutation.mutate({ businessId });
  };

  return (
    <Pressable onPress={handleClick}>
      <Ionicons
        size={30}
        color={isFavourite ? "red" : Colors[colorScheme ?? "light"].secondary}
        onPress={handleToggle}
        name={isFavourite ? "heart" : "heart-outline"}
      />
    </Pressable>
  );
}

export default Favourite;
