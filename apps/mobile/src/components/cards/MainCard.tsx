import { memo } from "react";
import { Pressable, View } from "react-native";
import { AdvancedImage } from "cloudinary-react-native";
import { cld } from "@/lib/cloudinary";

type MainCardPropsType = {
  item: {
    id: number;
    photo: string;
  };
};

const MainCard = memo(({ item }: MainCardPropsType) => {
  const bannerImage = cld.image(item.photo);


  return (
    <Pressable className="w-full px-4 mx-4">
      <View className="rounded-lg w-[90%] m-2">
        <AdvancedImage
          className="w-full h-full rounded-tl-lg rounded-tr-lg object-cover"
          style={{ width: 300, height: 300, alignSelf: "center" }}
          cldImg={bannerImage}
        />
      </View>
    </Pressable>
  );
});

export default MainCard