import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import LoginComponent from "@/components/forms/login";
import VisitorLoginForm from "@/components/forms/visitorLoginForm";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import AvatarWithFallback from "@/components/ui/AvatarWithFallback";
import { Loading } from "@/components/ui/Loading";
import { PROFILE_URL } from "@/constants/apis";
import Colors from "@/constants/Colors";
import { apiUrl } from "@/constants/Variable";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useAuthStore } from "@/store/authStore";

export default function TabOneScreen() {
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const colorScheme = useColorScheme();
  const [renderForm, setRenderForm] = useState<string>("");
  const role = useAuthStore((state) => state.role);
  const { data, isLoading, refetch } = useSuspenceData(
    PROFILE_URL.url,
    PROFILE_URL.key,
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
      setRenderForm("");
    }, [refetch]),
  );

  if (isLoading) {
    return <Loading position="center" />;
  }

  return (
    <ScrollView>
      <View className="flex-1 items-center justify-center  rounded-3xl w-[100%] ">
        <BoundaryWrapper>
          {!isAuthenticated ? (
            <>
              {!renderForm && (
                <View className="mt-36 flex-1 justify-center items-center w-full gap-8">
                  <Pressable
                    onPress={() => {
                      setRenderForm("business-hire");
                    }}
                    className="bg-primary py-4 px-8 rounded-lg w-[80%]"
                  >
                    <Text className="mx-auto text-[#fff] text-xl">
                      Login As Business/Hire
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setRenderForm("visitor");
                    }}
                    className="bg-primary py-4 px-8 rounded-lg w-[80%]"
                  >
                    <Text className="mx-auto text-[#fff] text-xl">
                      Login As A Visitor
                    </Text>
                  </Pressable>
                </View>
              )}

              {!!renderForm && (
                <View className="w-full">
                  {renderForm === "visitor" && <VisitorLoginForm />}
                  {renderForm === "business-hire" && <LoginComponent />}
                  <Pressable
                    onPress={() => setRenderForm("")}
                    className="mx-auto"
                  >
                    <Ionicons
                      name="arrow-back-circle-outline"
                      color={Colors[colorScheme ?? "light"]["secondary"]}
                      size={50}
                    />
                  </Pressable>
                </View>
              )}
              {/* {!!renderForm && ( */}

              {/* )} */}
            </>
          ) : (
            <View className=" bg-base-200 py-8 w-[90%] rounded-lg">
              <View className="flex-row items-center relative justify-around w-[100%] gap-4 px-8">
                <View className="relative">
                  <AvatarWithFallback
                    uri={`${apiUrl}/assets/images/${data?.user?.photo}`}
                    imageClass="w-[80px] h-[80px] rounded-full border-2 border-secondary"
                    iconClass="p-6 rounded-full border-2 border-secondary flex items-center justify-center"
                  />
                </View>
                <View className="w-[80%] ">
                  <View className=" w-[95%] flex-row items-center ">
                    <View className="w-[80%]">
                      <Text className="text-secondary text-2xl p-2 font-semibold w-full">
                        {data?.user?.name ? data?.user?.name : "Guest"}
                      </Text>
                    </View>
                    <View className="w-[20%]">
                      {data?.verify && (
                        <Ionicons
                          name="checkmark-circle"
                          size={36}
                          color="green"
                        />
                      )}
                    </View>
                  </View>

                  <Text className="w-full  text-secondary-content text-[12px]  mt-2">
                    {role}
                  </Text>

                  <Text className="w-full text-secondary-content text-[12px]  mt-2">
                    {data?.user?.email
                      ? data?.user?.email
                      : `+91 ${data?.user?.phone}`}
                  </Text>
                </View>
              </View>

              <View className="mx-10 mt-8 w-[100%]">
                <View className="flex-row gap-4 mb-6 items-center">
                  <Text className="font-semibold text-lg text-secondary">
                    Profile Type :
                  </Text>
                  <Text className="text-secondary">{role}</Text>
                </View>
                <View className="flex-row gap-4 mb-6 w-[100%] items-start">
                  <Text className="font-semibold text-lg text-secondary">
                    Address :
                  </Text>
                  <Text className="text-secondary break-words w-[200px]">
                    {data?.user?.area
                      ? data?.user?.area
                      : "C74 abcd, city, state India"}
                  </Text>
                </View>
                <View className="flex-row gap-4 mb-6 w-[100%] items-center">
                  <Text className="font-semibold text-lg text-secondary">
                    Activated Plan :
                  </Text>
                  <Text className="text-secondary w-[80%] break-words ">
                    {data?.plan?.title ?? "Free"}
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => router.navigate("/user")}>
                <View className="mx-10">
                  <View className="flex-row gap-4 bg-primary p-4 rounded-lg w-full items-center justify-center">
                    <Text className="text-secondary text-center">
                      Profile Setting
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          )}
        </BoundaryWrapper>
      </View>
    </ScrollView>
  );
}
