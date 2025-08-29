import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { HIRE_DETAIL_URL } from "@/constants/apis";
import Colors from "@/constants/Colors";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useStartChat } from "@/query/startChat";
import { useAuthStore } from "@/store/authStore";
import { showLoginAlert } from "@/utils/alert";
import { dialPhone } from "@/utils/getContact";
import Review from "../forms/review";

const screenWidth = Dimensions.get("window").width;
export default function HireDetailsCard(item: any) {
  const [aspectRatio, setAspectRatio] = useState(3 / 4);

  const colorScheme = useColorScheme();
  const { mutate: startChat } = useStartChat();
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const clearToken = useAuthStore((state) => state.clearToken);

  const hiredetails = item?.item;

  const { data } = useSuspenceData(
    HIRE_DETAIL_URL.url,
    HIRE_DETAIL_URL.key,
    hiredetails,
  );

  const hireDetails = data?.data?.listing;

  const languages = useMemo(() => {
    try {
      const langParse = JSON.parse(hireDetails.languages);
      if (Array.isArray(langParse)) {
        return langParse.join(", ");
      }
    } catch (error) {
      if (typeof hireDetails.languages === "string")
        return hireDetails.languages;
    }
    return "";
  }, [hireDetails]);

  useEffect(() => {
    if (hireDetails?.photo) {
      const imgUrl = `https://www.justsearch.net.in/assets/images/${hireDetails?.photo}`;
      Image.getSize(
        imgUrl,
        (width, height) => {
          setAspectRatio(width / height);
        },
        (error) => {
          console.log("Failed to load image dimensions", error);
        },
      );
    }
  }, [hireDetails?.photo]);

  const imgUrl = hireDetails?.photo
    ? `https://www.justsearch.net.in/assets/images/${hireDetails?.photo}`
    : "https://www.justsearch.net.in/assets/images/9706277681737097544.jpg";
  if (typeof hiredetails !== "string") {
    return <Text>Invalid or missing slug</Text>;
  }

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }

    return age;
  };

  if (!data?.data?.listing) {
    Alert.alert("Not Found", data?.data?.message);
    router.back();
    return;
  }

  return (
    <ScrollView className="flex-1 px-4 h-full w-[100%] mb-8 mx-auto">
      <View className="m-2 mx-auto bg-base-200 w-full rounded-2xl p-4 shadow-md ">
        <View
          className="border m-4"
          style={{
            width: "100%",
            height: screenWidth * 0.8 * (1 / aspectRatio),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 16,
            aspectRatio,
          }}
        >
          <Image
            className=""
            source={{
              uri: imgUrl,
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-semibold text-secondary">
            {hireDetails?.name}
          </Text>
          <Text className="text-secondary">
            {hireDetails?.gender === 1 ? "M," : "F,"} AGE
            {calculateAge(hireDetails?.dob)}
          </Text>
        </View>
        <View className="flex-row gap-2 mb-2 flex-wrap">
          {hireDetails.categories && (
            <TouchableOpacity className="bg-success-content rounded-lg py-2 px-3 mb-1">
              <Text className="text-success font-semibold text-xs">
                {hireDetails.categories[0].title}
              </Text>
            </TouchableOpacity>
          )}
          {hireDetails?.subcategories?.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-error-content rounded-lg py-2 px-3 mb-1"
            >
              <Text className="text-pink-700 font-semibold text-xs">
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row items-center gap-4 mb-1">
          <Ionicons name="mail-outline" size={16} color="#888" />
          <Text className="text-lg text-secondary items-baseline">
            {hireDetails.email}
          </Text>
        </View>
        <View className="flex-row items-center gap-4 mb-2">
          <Ionicons name="call-outline" size={16} color="#888" />
          <Text className="text-lg text-secondary">
            {hireDetails.phone_number}
          </Text>
        </View>
        <View className="mb-2">
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="briefcase-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Job Type:</Text>
              <Text className="text-secondary font-normal">
                {hireDetails.job_type}
              </Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="time-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Experience:</Text>
              {hireDetails.work_experience_year} Year
              {hireDetails.work_experience_month} Month
            </Text>
          </View>
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="school-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Qualification:</Text>
              {hireDetails.highest_qualification === "2"
                ? "Graduation"
                : hireDetails.highest_qualification}
            </Text>
          </View>
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="time-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Shift: </Text>
              {hireDetails.shift === "1"
                ? "Morning"
                : hireDetails.shift === "2"
                  ? "Evening"
                  : "Night"}
            </Text>
          </View>
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="star-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Expertise:</Text>
              {hireDetails.expertise || "Unknown"}
            </Text>
          </View>
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="language-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Languages: </Text>
              <Text>{languages}</Text>
            </Text>
          </View>

          {hireDetails.skillset && (
            <View className="flex-row items-center gap-4 mb-3">
              <Ionicons name="construct-outline" size={16} color="#888" />
              <Text className="text-lg text-secondary">
                <Text className="font-semibold">Skillsets:</Text>
                <Text className="text-secondary font-light">
                  {hireDetails?.skillset}
                </Text>
              </Text>
            </View>
          )}
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="globe-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Willing to Relocate:</Text>
              {hireDetails.relocate === 1 ? "Yes" : "No"}
            </Text>
          </View>
          <View className="w-[95%] flex-row items-center gap-4 mb-3">
            <Ionicons name="location-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary w-[100%]">
              <Text className="font-semibold w-[90%]">Location:</Text>
              {hireDetails.real_address}, {data?.data?.city?.city},
              {data?.data?.state?.name}, {hireDetails.pincode}
            </Text>
          </View>
        </View>
        <View>
          <View className="flex-row w-[100%] justify-center gap-6">
            <View className="w-[45%] bg-primary rounded-lg py-2 px-4">
              <Pressable
                onPress={() => {
                  if (!isAuthenticated) {
                    showLoginAlert({
                      message: "Need to login to chat on your behalf",
                      onConfirm: () => {
                        clearToken();
                        router.push("/user/bottomNav/profile");
                      },
                    });
                  } else {
                    startChat(hireDetails.id, {
                      onSuccess: (res) => {
                        console.log("Chat started:", res.chat_session_id);

                        router.push({
                          pathname: "/chat/[chat]",
                          params: { chat: res?.chat_session_id.toString() },
                        });
                      },
                      onError: (err) => {
                        console.error("Failed to start chat:", err);
                      },
                    });
                  }
                }}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons size={18} name="chatbox-ellipses" color="#fff" />
                  <Text className="text-[#fff] font-semibold text-xl text-center ml-2">
                    Chat Now
                  </Text>
                </View>
              </Pressable>
            </View>
            <View className="w-[45%] bg-primary rounded-lg py-2 px-4">
              <Pressable onPress={() => dialPhone(hireDetails.phone_number)}>
                <View className=" text-xl text-center flex-row py-1 gap-2 justify-center">
                  <Ionicons size={20} name="call" color={"white"} />
                  <Text className="text-[#ffffff] font-semibold">
                    Contact Now
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
        <Review listingId={hireDetails.id} />
      </View>
    </ScrollView>
  );
}
