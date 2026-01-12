import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { useAuthStore } from "@/features/auth/authStore";
import { MemoizedDetailCard } from "@/features/business/show/DetailCard";
import { trpc } from "@/lib/trpc";

function FavouritesBusinesses() {
  const { data, error } = useQuery(
    trpc.businessrouter.favouritesShops.queryOptions(),
  );

  const isAuthenticated = useAuthStore((state) => state.authenticated);
  console.log("Is Authenticated", isAuthenticated);
  if (!isAuthenticated) {
    router.push("/");
  }
  console.log(
    "data is =================================================================>",
    data,
  );

  console.log(`${JSON.stringify(error, null, 2)}`);
  // if (error?.error?.shape?.data?.httpStatus === 401) {
  //   redirect("/login");
  // }

  if (data?.data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-secondary text-2xl">No Favourites Found</Text>
      </View>
    );
  }

  return (
    <View>
      {data?.data?.map((item, i) => (
        <View key={i.toString()}>
          <MemoizedDetailCard
            navigationId={item.shop[0]?.id}
            item={item.shop[0]}
            type={1}
            category={item.category ?? ""}
            subcategory={item.subcategories}
            rating={item.rating}
          />
        </View>
      ))}
    </View>
  );
}

export default FavouritesBusinesses;
