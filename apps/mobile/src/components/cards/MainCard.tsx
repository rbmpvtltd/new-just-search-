import { useRouter } from "expo-router";
import { Image, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { sepia } from "@cloudinary/url-gen/actions/effect";
import { AdvancedImage } from 'cloudinary-react-native';
import { Cloudinary } from "@cloudinary/url-gen";
import { cld } from "@/lib/cloudinary";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";

type MainCardPropsType = {
  item: {
    id: any;
    photo: string;
  };
};
function MainCard({ item }: MainCardPropsType) {
  const bannerImage = cld.image(item.photo);
  bannerImage.effect(sepia()).resize(thumbnail().width(150).height(150))  // Crop the image, focusing on the face.
  .roundCorners(byRadius(20));
  return (
    <Pressable>
      <View className=" rounded-lg w-[90%] m-2r">
        {/* Image Section */}
        <View className="">
          <AdvancedImage
            className="w-full h-full rounded-tl-lg rounded-tr-lg"
            style={{ resizeMode: "contain" }}
            // style={{ width: 200, height: 200, alignSelf: 'center'}}
            cldImg={bannerImage}
          />
        </View>
      </View>
    </Pressable>
  );
}

export default MainCard;
