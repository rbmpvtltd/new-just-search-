import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useHeadingStore } from "@/store/heading";
import "react-native-reanimated";
import { Platform, Text, useColorScheme, View } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import "@/global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import ErrorHandler from "@/components/layout/NativeErrorBoundry";
import AvatarWithFallback from "@/components/ui/AvatarWithFallback";
import useGoogleUpdate from "@/hooks/useUpdateApplication";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const queryClient = new QueryClient();
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useGoogleUpdate();
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const heading = useHeadingStore((state) => state.heading);

  // crashlytics().log("hello from root layout crashlytics");
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <BoundaryWrapper>
          <View className={colorScheme === "dark" ? "dark h-full" : "h-full"}>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              {/* <Drawer /> */}
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="category/[category]"
                  options={({ route }) => {
                    const { category } = route.params as { category: string };
                    const title =
                      category.charAt(0).toUpperCase() + category.slice(1);
                    return {
                      headerShown: true,
                      title,
                    };
                  }}
                />
                <Stack.Screen
                  name="chatSessions"
                  options={{ headerShown: true, title: "Chats" }}
                />

                <Stack.Screen
                  name="subcategory/[subcategory]"
                  options={({ route }) => {
                    const { subcategory } = route.params as {
                      subcategory: string;
                    };
                    const arr = subcategory.split("-");
                    let title = "";
                    if (arr.length === 1) {
                      // sirf ek word hai
                      title = `${arr[0][0].toUpperCase()}${arr[0].slice(1)}`;
                    } else if (arr.length >= 2) {
                      // do ya zyada word hain
                      title = `${arr[0][0].toUpperCase()}${arr[0].slice(1)} ${arr[1][0].toUpperCase()}${arr[1].slice(1)}`;
                    }
                    return {
                      headerShown: true,
                      title: heading,
                    };
                  }}
                />
                <Stack.Screen
                  name="hireDetail/[hiredetails]"
                  options={({ route }) => {
                    const { hiredetails } = route.params as {
                      hiredetails: string;
                    };
                    const arr = hiredetails.split("-");
                    let title = "";
                    if (arr.length === 1) {
                      // sirf ek word hai
                      title = `${arr[0][0].toUpperCase()}${arr[0].slice(1)}`;
                    } else if (arr.length >= 2) {
                      // do ya zyada word hain
                      title = `${arr[0][0].toUpperCase()}${arr[0].slice(1)} ${arr[1][0].toUpperCase()}${arr[1].slice(1)}`;
                    }

                    return {
                      headerShown: true,
                      title,
                    };
                  }}
                />

                <Stack.Screen
                  name="aboutBusiness"
                  options={() => {
                    return {
                      headerShown: true,
                      title: "About Business",
                    };
                  }}
                />
                <Stack.Screen
                  name="businessEditForms"
                  options={{
                    title: "Edit Business Listing",
                  }}
                />
                <Stack.Screen
                  name="user"
                  options={() => {
                    return {
                      headerShown: false,
                    };
                  }}
                />
                <Stack.Screen
                  name="chat"
                  options={() => {
                    return {
                      headerShown: false,
                    };
                    //
                    // headerTitle: () => (
                    //   <View className="flex-row items-center gap-4  px-4 py-2 rounded-lg sticky">
                    //     <AvatarWithFallback
                    //       uri={`https://www.justsearch.net.in/assets/images/${imageUri}`}
                    //       imageClass="w-[40px] h-[40px]"
                    //       iconSize={20}
                    //     />
                    //     <Text className="text-secondary font-semibold text-xl">
                    //       {heading
                    //         ? heading.length > 20
                    //           ? `${heading.slice(0, 20)}...`
                    //           : heading
                    //         : "Loading..."}
                    //     </Text>
                    //   </View>
                    // ),
                  }}
                />
              </Stack>
            </ThemeProvider>
          </View>
          {Platform.OS !== "web" ? null : (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </BoundaryWrapper>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
