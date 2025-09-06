import { useRouter } from "expo-router";
import { Image, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

type MainCardPropsType = {
  item: {
    id: any;
    photo: string;
  };
};
function MainCard({ item }: MainCardPropsType) {
  return (
    <Pressable>
      <View className=" rounded-lg w-[90%] m-2r">
        {/* Image Section */}
        <View className="">
          <Image
            className="w-full h-full rounded-tl-lg rounded-tr-lg"
            style={{ resizeMode: "contain" }}
            source={{
              uri: `https://www.justsearch.net.in/assets/images/banners/${item.photo}`,
            }}
          />
        </View>
      </View>
    </Pressable>
  );
}

export default MainCard;
