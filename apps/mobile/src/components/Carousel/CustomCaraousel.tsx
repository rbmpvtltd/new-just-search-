// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   FlatList,
//   Dimensions,
//   StyleSheet,
// } from 'react-native';
// import MainCard from '../cards/MainCard';
// import { useQuery } from '@tanstack/react-query';
// import { trpc } from '@/lib/trpc';

// const { width: screenWidth } = Dimensions.get('window');
// const ITEM_WIDTH = 320;
// const ITEM_SPACING = 16;

// const Carousel = () => {
//   const flatListRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const { data: carouselData } = useQuery(
//     trpc.banners.getBannerData.queryOptions({ type: 1 })
//   );

//   useEffect(() => {
//     if (!carouselData || carouselData.length === 0) return;

//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => {
//         const nextIndex =
//           prevIndex + 1 < carouselData.length ? prevIndex + 1 : 0;

//         flatListRef.current?.scrollToIndex({
//           index: nextIndex,
//           animated: true,
//         });

//         return nextIndex;
//       });
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [carouselData]);

//   const renderItem = ({ item }) => (
//     <View style={[styles.slide, { width: ITEM_WIDTH }]}>
//       <MainCard item={item} />
//     </View>
//   );

//   return (
//     <View className='items-center mt-5 h-[300px]'>
//       <FlatList
//         ref={flatListRef}
//         data={carouselData || []}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         snapToInterval={ITEM_WIDTH + ITEM_SPACING}
//         decelerationRate="normal"
//         bounces={false}
//         ItemSeparatorComponent={() => <View style={{ width: ITEM_SPACING }} />}
//         contentContainerStyle={{
//           paddingHorizontal: (screenWidth - ITEM_WIDTH) / 2,
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//   },
//   slide: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Carousel;

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import MainCard from "../cards/MainCard";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

const { width: screenWidth } = Dimensions.get("window");
const ITEM_WIDTH = 320;
const ITEM_SPACING = 16;

const Carousel = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  const { data: carouselData } = useQuery(
    trpc.banners.getBannerData.queryOptions({ type: 1 }),
  );

  // ✅ Update index when user scrolls manually
  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (ITEM_WIDTH + ITEM_SPACING));
    setCurrentIndex(index);
  };

  // ✅ Auto-scroll (pauses during user interaction)
  useEffect(() => {
    if (!carouselData || carouselData.length === 0) return;

    if (isInteracting) return; // pause auto-scroll while user is swiping

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex =
          prevIndex + 1 < carouselData.length ? prevIndex + 1 : 0;

        const offset =
          nextIndex * (ITEM_WIDTH + ITEM_SPACING) +
          (screenWidth - ITEM_WIDTH) / 2; // ✅ add instead of subtract

        flatListRef.current?.scrollToOffset({
          offset: offset - screenWidth / 8,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselData, isInteracting]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.slide, { width: ITEM_WIDTH }]}>
      <MainCard item={item} />
    </View>
  );

  return (
    <View className="items-center mt-5 h-[300px]">
      <FlatList
        ref={flatListRef}
        data={carouselData || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="normal"
        bounces={false}
        ItemSeparatorComponent={() => <View style={{ width: ITEM_SPACING }} />}
        contentContainerStyle={{
          paddingHorizontal: (screenWidth - ITEM_WIDTH) / 2,
        }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={() => setIsInteracting(true)} // pause when user starts dragging
        onScrollEndDrag={() => {
          // resume after small delay (user stopped interaction)
          setTimeout(() => setIsInteracting(false), 2500);
        }}
        onScrollToIndexFailed={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Carousel;
