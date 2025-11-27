// import React, { useRef } from 'react';
// import { View, FlatList, Dimensions, ViewToken } from 'react-native';

// const { width } = Dimensions.get('window');

// type CarouselProps = {
//   data: any[];
//   renderItem: ({ item, index }: { item: any; index: number }) => JSX.Element;
//   itemWidth?: number; // allow custom item width
// };

// export default function Carousel({ data, renderItem, itemWidth = width * 0.8 }: CarouselProps) {
//   const flatListRef = useRef<FlatList>(null);
//   const spacerWidth = (width - itemWidth) / 2;

//   // Duplicate data for infinite effect
//   const extendedData = [
//     ...data.slice(-2), // last 2
//     ...data,
//     ...data.slice(0, 2), // first 2
//   ];

//   const handleScrollEnd = (e: any) => {
//     const offsetX = e.nativeEvent.contentOffset.x;
//     const index = Math.round(offsetX / itemWidth);
//     const actualLength = data.length;

//     // Reset position to simulate infinite
//     if (index === 1) {
//       flatListRef.current?.scrollToOffset({ offset: actualLength * itemWidth, animated: false });
//     } else if (index === actualLength + 2) {
//       flatListRef.current?.scrollToOffset({ offset: itemWidth * 2, animated: false });
//     }
//   };

import { useFocusEffect } from "@react-navigation/native";
//   return (
//     <FlatList
//       ref={flatListRef}
//       data={extendedData}
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       snapToInterval={itemWidth}
//       decelerationRate="fast"
//       bounces={false}
//       contentContainerStyle={{ paddingHorizontal: spacerWidth }}
//       onMomentumScrollEnd={handleScrollEnd}
//       renderItem={renderItem}
//       keyExtractor={(_, index) => index.toString()}
//       getItemLayout={(_, index) => ({
//         length: itemWidth,
//         offset: itemWidth * index,
//         index,
//       })}
//       initialScrollIndex={data.length}
//     />
//   );
// }
// ------------------------------------------------------------------

import React, { useCallback, useState,useMemo, useRef } from "react";
import { Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

type CarouselProps = {
  data: {
    id: number;
    photo: string | null;
    name?: string;
    area?: string | null;
    streetName?: string | null;
    buildingName?: string | null;
    rating?: string[];
    subcategories?: string[];
    category?: string | null;
  }[] | undefined;
  renderItem: ({ item, index }: { item: any; index: number }) => JSX.Element;
  itemWidth?: number;
  height?: number;
  mode: any;
};

export default function CarouselCompo({
  data,
  renderItem,
  height,
  mode,
}: CarouselProps) {
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsAutoPlay(true);
      return () => setIsAutoPlay(false);
    }, []),
  );

  const getModeConfig = () => {
    switch (mode) {
      case "parallax":
        return {
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 80,
        };
      case "horizontal-stack":
        return {
          stackInterval: 30,
          scaleInterval: 0.08,
        };
      case "vertical-stack":
        return {
          stackInterval: 40,
          scaleInterval: 0.1,
        };
      default:
        return {};
    }
  };

  return (
    <Carousel
      loop={true}
      width={width}
      height={height}
      autoPlay={false} 
      data={data ?? []}
      scrollAnimationDuration={1000}
      style={{ flexGrow: 0 }}
      pagingEnabled
      mode={mode}
      modeConfig={getModeConfig()}
      onConfigurePanGesture={(gestureChain) =>
        gestureChain.activeOffsetX([-1, 1])
      }
      renderItem={({ item, index }) => {
        console.log("render item in Carousel.tsx file")
        return renderItem({ item, index })
      }}
    />
  );
}
