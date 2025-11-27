import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { AdvancedImage } from "cloudinary-react-native";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import LoginComponent from "@/features/user/profile/login";
import VisitorLoginForm from "@/features/user/profile/visitorLoginForm";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { Loading } from "@/components/ui/Loading";
import Colors from "@/constants/Colors";
import { cld } from "@/lib/cloudinary";
import { trpc } from "@/lib/trpc";
import { useAuthStore } from "@/store/authStore";

export default function TabOneScreen() {
  const isAuthenticated = useQuery(trpc.auth.verifyauth.queryOptions());

  const colorScheme = useColorScheme();
  const [renderForm, setRenderForm] = useState<string>("");
  const role = useAuthStore((state) => state.role);
  const {
    data: userData,
    isLoading: userDataLoading,
    isError: userDataIsError,
    error: userDataError,
  } = useQuery(trpc.userRouter.getUserProfile.queryOptions());

  // if (userDataIsError) {
  //   return <Text className="text-secondary">{userDataError.message + " Hiiii "}</Text>;
  // }
  if (userDataLoading) {
    return <Loading position="center" />;
  }

  return (
    <ScrollView>
      <View className="flex-1 items-center justify-center  rounded-3xl w-[100%] ">
        <BoundaryWrapper>
          {!isAuthenticated.isSuccess ? (
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
            </>
          ) : (
            <View className=" bg-base-100 py-8 w-[90%] rounded-lg">
              <View className="flex-row items-center relative justify-around w-[100%] gap-4 px-8">
                <View className="relative">
                  <View className="w-28 h-28 rounded-lg">
                    <AdvancedImage
                      cldImg={cld.image(userData?.profileImage || "")}
                      className="w-[100%] h-[100%] rounded-full border-2 border-secondary"
                    />
                  </View>
                </View>
                <View className="w-[80%] ">
                  <View className=" w-[90%] flex-row items-center">
                    <View className="w-[80%]">
                      <Text className="text-secondary text-2xl p-2 font-semibold w-full">
                        {userData?.firstName
                          ? `${userData.firstName} ${userData.lastName}`
                          : "Guest"}
                      </Text>
                    </View>
                    <View className="w-[20%]">
                      {/* {data?.verify && (
                        <Ionicons
                          name="checkmark-circle"
                          size={36}
                          color="green"
                        />
                      )} */}
                    </View>
                  </View>
                  <View className="w-[80%]">
                    <Text className="w-full mx-2 text-secondary-content text-[16px]  mt-2">
                      {role}
                    </Text>

                    <Text className="w-full mx-2 text-secondary-content text-[16px] ">
                      {userData?.email ? userData.email : `+91 1234567890`}
                    </Text>
                  </View>
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
                    {userData?.area
                      ? userData.area
                      : (userData?.address ?? "No Address")}
                  </Text>
                </View>
                <View className="flex-row gap-4 mb-6 w-[100%] items-center">
                  <Text className="font-semibold text-lg text-secondary">
                    Activated Plan :
                  </Text>
                  <Text className="text-secondary w-[80%] break-words ">
                    {/* {data?.plan?.title ?? "Free"} */}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => router.navigate("/(root)/profile/edit-profile")}
              >
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
