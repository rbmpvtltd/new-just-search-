import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch-core";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import CustomCarousel from "@/components/Carousel/CustomCaraousel";
import { InfiniteHits } from "@/components/home/InfiniteHits";
import { SearchBox } from "@/components/home/SearchBox";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { Loading } from "@/components/ui/Loading";
import { CategoryList } from "@/features/home/show/CategorySameList";
import { UpdateModel } from "@/features/version/Component/UpdateModel";
import { searchClient } from "@/lib/algoliaClient";
import { trpc } from "@/lib/trpc";
import { useLocationStore } from "@/store/locationStore";
import { getTokenRole } from "@/utils/secureStore";
import { useAuthStore } from "@/features/auth/authStore";
import UpdateDisplayNameForm from "@/features/auth/forms/UpdateDisplay";
import UpdateDisplayNameModal from "@/features/auth/forms/UpdateDisplay";

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log(
        "Permission not granted to get push token for push notification!",
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      console.log("Project ID not found");
    }
    console.log("project id is ===>", projectId);
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      await AsyncStorage.setItem("pushToken", pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      console.log(`${e}`);
    }
  } else {
    console.log("Must use physical device for push notifications");
  }
}

export default function TabOneScreen() {
  const { data: latestVersion, isLoading } = useQuery(
    trpc.versionRouter.checkLatestVesion.queryOptions(),
  );
  const { data: userData, error: userError } = useQuery(
    trpc.userRouter.getUserDetail.queryOptions(),
  );
  const setLongitude = useLocationStore((state) => state.setLongitude);
  const setLatitude = useLocationStore((state) => state.setLatitude);
  const token = useAuthStore((state) => state.token);
  const [showDisplayNameModal, setShowDisplayNameModal] = useState(false);

  console.log("Latest virsion", latestVersion);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useEffect(() => {
    if (
      token &&
      userData &&
      (!userData.displayName || userData.displayName === "null")
    ) {
      setShowDisplayNameModal(true);
    }
  }, [token, userData]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    }

    getCurrentLocation();
  }, []);

  // if (
  //   token &&
  //   userData &&
  //   (!userData.displayName || userData.displayName === "null")
  // ) {
  //   return (
  //     <View className="w-full">
  //       <UpdateDisplayNameForm userId={Number(userData.id)} />
  //     </View>
  //   );
  // }

  if (isLoading) {
    return <Loading position="center" />;
  }
  return (
    <>
     <UpdateDisplayNameModal
        visible={showDisplayNameModal}
        userId={Number(userData?.id)}
        onClose={() => setShowDisplayNameModal(false)} // Remove this if you want to force users to set display name
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex items-center r rounded-4xl">
          <UpdateModel latestVersion={latestVersion ?? "1.0.0"} />
          <CustomCarousel />
          <InstantSearch searchClient={searchClient} indexName="all_listing">
            <SearchBox />
            <Configure hitsPerPage={5} />
            <InfiniteHits hitComponent={Hit} />
          </InstantSearch>
          <BoundaryWrapper>
            <CategoryList />
          </BoundaryWrapper>
          <CustomCarousel />
          <CustomCarousel />
          <CustomCarousel />
        </View>
      </ScrollView>
    </>
  );
}

function Hit({ hit }: { hit: any }) {
  return (
    <View className="px-4">
      <Pressable
        onPress={() => {
          if (hit.listingType === "business") {
            router.push(
              `/(root)/(home)/subcategory/aboutbusiness/${hit.objectID}`,
            );
          } else if (hit.listingType === "hire") {
            router.push(`/(root)/(hire)/hiredetail/${hit.objectID}`);
          }
          console.log("clicked on", hit.objectID);
        }}
      >
        <Text className="text-lg text-secondary-content">{hit.name}</Text>
      </Pressable>
    </View>
  );
}
