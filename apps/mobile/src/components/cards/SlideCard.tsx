import { View, Image } from "react-native";

type CardProps = {
  item: {
    photo: string;
  };
};

export default function SlideCard<T>({ item }: CardProps) {
  return (
    <View className="p-2">
      <Image
        className="h-[100%] w-[100%] rounded "
        source={{
          uri: `https://justsearch.net.in/assets/images/banners/${item.photo}`,
        }}
        resizeMode="cover"
      />
    </View>
  );
}
