import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "@/features/auth/authStore";
import { trpc } from "@/lib/trpc";
import { useStartChat } from "@/query/startChat";
import { showLoginAlert } from "@/utils/alert";
import { dialPhone } from "@/utils/getContact";
import { Loading } from "../../../components/ui/Loading";

const screenWidth = Dimensions.get("window").width;
export default function HireDetailsCard(item: any) {
  const [aspectRatio, setAspectRatio] = useState(3 / 4);

  // const colorScheme = useColorScheme();
  const { mutate: startChat } = useStartChat();
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const clearToken = useAuthStore((state) => state.clearToken);

  const hiredetails = item?.item;
  const { data, isLoading } = useQuery(
    trpc.hirerouter.singleHire.queryOptions({ hireId: Number(hiredetails) }),
  );
  if (isLoading) {
    return <Loading position="center" size={"large"} />;
  }
  console.log("data is ===========>", JSON.stringify(data, null, 2));
  // return <Text className="text-secondary text-3xl">for test purpose {hiredetails}</Text>

  // useEffect(() => {
  //   if (hireDetails?.photo) {
  //     const imgUrl = `https://www.justsearch.net.in/assets/images/${hireDetails?.photo}`;
  //     Image.getSize(
  //       imgUrl,
  //       (width, height) => {
  //         setAspectRatio(width / height);
  //       },
  //       (error) => {
  //         console.log("Failed to load image dimensions", error);
  //       },
  //     );
  //   }
  // }, [hireDetails?.photo]);

  const calculateAge = (dob: string | null): number => {
    const birthDate = new Date(String(dob));
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

  if (!data?.data?.id) {
    Alert.alert("Not Found", "Listing Not Found");
    router.back();
    return;
  }

  return (
    <ScrollView className="flex-1 px-4 h-full w-[100%]  mx-auto">
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
              uri: "https://www.justsearch.net.in/assets/images/9706277681737097544.jpg",
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
            {data.data?.name}
          </Text>
          <Text className="text-secondary">
            {data?.data?.gender}, AGE=
            {calculateAge(data?.data?.dob)}
          </Text>
        </View>
        <View className="flex-row gap-2 mb-2 flex-wrap">
          <TouchableOpacity className="bg-success-content rounded-lg py-2 px-3 mb-1">
            <Text className="text-success font-semibold text-xs">
              {data?.data?.category ?? "Fake Category"}
            </Text>
          </TouchableOpacity>
          {data?.data?.subcategories?.map((item, i) => (
            <TouchableOpacity
              key={i.toString()}
              className="bg-error-content rounded-lg py-2 px-3 mb-1"
            >
              <Text className="text-pink-700 font-semibold text-xs">
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row items-center gap-4 mb-1">
          <Ionicons name="mail-outline" size={16} color="#888" />
          <Text className="text-lg text-secondary items-baseline">
            {data?.data?.email}
          </Text>
        </View>
        <View className="flex-row items-center gap-4 mb-2">
          <Ionicons name="call-outline" size={16} color="#888" />
          <Text className="text-lg text-secondary">
            {data?.data?.mobileNo ?? "9087654321"}
          </Text>
        </View>
        <View className="mb-2">
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="briefcase-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Job Type:</Text>
              <Text className="text-secondary font-normal">
                {data?.data?.jobType?.[0] ?? "Fake Job"}
              </Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="time-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Experience:</Text>
              {data?.data?.yearOfExp} Year
              {data?.data?.monthOfExp} Month
            </Text>
          </View>
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="school-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Qualification:</Text>
              {data?.data?.qualification === 2
                ? "Graduation"
                : data?.data?.qualification}
            </Text>
          </View>
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="time-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Shift: </Text>
              {data?.data?.workingShift?.join(",")}
              {!data?.data?.workingShift.length && "Morning Shift"}
            </Text>
          </View>
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="star-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Expertise:</Text>
              {data?.data?.expertise || "Unknown"}
            </Text>
          </View>
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="language-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Languages: </Text>
              <Text>{data?.data?.languages?.join(",")}</Text>
              {data?.data?.languages?.length && <Text>Hindi</Text>}
            </Text>
          </View>

          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="construct-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Skillsets:</Text>
              <Text className="text-secondary font-light">
                {data?.data?.skillSet}
              </Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-4 mb-3">
            <Ionicons name="globe-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary">
              <Text className="font-semibold">Willing to Relocate:</Text>
              {Number(data?.data?.relocate) === 1 ? "Yes" : "No"}
            </Text>
          </View>
          <View className="w-[95%] flex-row items-center gap-4 mb-3">
            <Ionicons name="location-outline" size={16} color="#888" />
            <Text className="text-lg text-secondary w-[100%]">
              <Text className="font-semibold w-[90%]">Location:</Text>
              {data?.data?.area}, {data?.data?.city},{data?.data?.state},{" "}
              {data?.data?.pincode}
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
                        router.push("/(root)/profile");
                      },
                    });
                  } else {
                    startChat(String(data?.data?.id), {
                      onSuccess: (res) => {
                        console.log("Chat started:", res.chat_session_id);

                        router.push({
                          pathname: "/(root)/(home)/chat", // TODO: add real chats redirect
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
              <Pressable
                onPress={() => dialPhone(String(data?.data?.mobileNo))}
              >
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
        {/* <Review listingId={data?.data?.id} /> */}
      </View>
    </ScrollView>
  );
}
