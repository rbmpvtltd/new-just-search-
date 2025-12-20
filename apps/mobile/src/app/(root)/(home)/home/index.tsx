import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useEffect, useState } from "react";
import {
  Button,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomCarousel from "@/components/Carousel/CustomCaraousel";
// import Banner1 from "@/features/home/show/Banner1";
// import Banner2 from "@/features/home/show/Banner2";
// import Banner3 from "@/features/home/show/Banner3";
// import Banner4 from "@/features/home/show/Banner4";
import { CategoryList } from "@/features/home/show/CategorySameList";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
// import { Loading } from "@/components/ui/Loading";
// import { trpc } from "@/lib/trpc";
import { searchClient } from "@/lib/algoliaClient";
import {
  InstantSearch,
  Index,
  useHits,
  Configure,
} from "react-instantsearch-core";
import { SearchBox } from "@/components/home/SearchBox";
import { InfiniteHits } from "@/components/home/InfiniteHits";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import Banner1 from "@/components/home/Banner1";
// import Banner2 from "@/components/home/Banner2";
// import Banner3 from "@/components/home/Banner3";
// import Banner4 from "@/components/home/Banner4";
// import { CategoryList } from "@/components/home/CategorySameList";
// import BoundaryWrapper from "@/components/layout/BoundaryWrapper";

// async function Banners() {
//   const firstBanner = await bannersFirst();
//   console.log("banner in banner fn",firstBanner)
//   return firstBanner;
// }

// async function sendPushNotification(expoPushToken: string) {
//   console.log("sending notification===");
//   const message = {
//     to: expoPushToken,
//     sound: "default",
//     title: "Original Title",
//     body: "And here is the body!",
//     data: { someData: "goes here" },
//   };

//   const response = await fetch("https://exp.host/--/api/v2/push/send", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Accept-encoding": "gzip, deflate",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(message),
//   });
//   const res = await response.json();
//   console.log(res);
// }

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
  // const data = Banners();
  // console.log("==============data from trpc============",data)
  //
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

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

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="flex items-center r rounded-4xl">
        {/* <Button
          title="Press to Send Notification"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        /> */}
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
  );
}

function Hit({ hit }: { hit: any }) {
  return (
    <View className="px-4">
      <Pressable
        onPress={() => {
          if (hit.listingType === "business") {
            router.push(
              `/(root)/(home)/subcategory/aboutBusiness/${hit.objectID}`,
            );
          } else if (hit.listingType === "hire") {
            router.push(`/(root)/(hire)/hireDetail/${hit.objectID}`);
          }
          console.log("clicked on", hit.objectID);
        }}
      >
        <Text className="text-lg text-secondary-content">{hit.name}</Text>
      </Pressable>
    </View>
  );
}
