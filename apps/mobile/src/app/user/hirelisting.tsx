import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import HireListingCard from "@/components/hirePageComp/HireListingCard";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import { MY_HIRE_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";

export default function HireListing() {
  const router = useRouter();
  const {
    data: myhire,
    isLoading,
    isError,
  } = useSuspenceData(MY_HIRE_URL.url, MY_HIRE_URL.key);

  if (isLoading) return <ActivityIndicator />;
  if (isError) return <SomethingWrong />;

  return (
    <View>
      {myhire?.data?.data?.length === 0 ? (
        <View className="px-4 mt-4">
          <Pressable
            className="bg-primary py-3 rounded-xl w-full flex-row items-center justify-center shadow-sm"
            onPress={() => router.push("/hirelistingforms")}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text className="text-secondary ml-2 font-semibold">
              Add Hire Listing
            </Text>
          </Pressable>
        </View>
      ) : (
        myhire?.data?.data?.[0] && (
          <HireListingCard
            item={myhire.data.data[0]}
            isVerify={myhire?.verify ?? ""}
          />
        )
      )}
    </View>
  );
}
