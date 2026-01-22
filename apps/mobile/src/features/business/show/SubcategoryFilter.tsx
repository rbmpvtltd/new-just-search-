import Slider from "@react-native-community/slider";
import React, { useEffect, useState } from "react";
import {
  useClearRefinements,
  useInstantSearch,
  useRefinementList,
} from "react-instantsearch-core";
import {
  Animated,
  Button,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useLocationStore } from "@/store/locationStore";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.7;

interface FiltersProps {
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  indexName?: string; // Optional: for dynamic index name
}

export function SubcategoryFilters({
  isDrawerOpen,
  onToggleDrawer,
  indexName = "business_listing",
}: FiltersProps) {
  const { setUiState, uiState } = useInstantSearch();
  const translateX = React.useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const latitude = useLocationStore((state) => state.latitude);
  const longitude = useLocationStore((state) => state.longitude);
  // Distance filter state
  const [pendingRadiusKm, setPendingRadiusKm] = React.useState<number>(2000);

  console.log(
    `========== latitude is ${latitude} and longitude is ${longitude} ==========`,
  );

  const [pendingFilters, setPendingFilters] = React.useState<{
    category: string[];
    subcategories: string[];
    expectedSalary: string[];
    gender: string[];
    languages: string[];
    rating: string[];
    workExp: string[];
  }>({
    category: [],
    subcategories: [],
    expectedSalary: [],
    gender: [],
    languages: [],
    rating: [],
    workExp: [],
  });

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isDrawerOpen ? 0 : DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDrawerOpen]);

  // Category filter
  const {
    items: categories,
    canToggleShowMore: canShowMoreCategories,
    toggleShowMore: toggleShowMoreCategories,
    isShowingMore: isShowingMoreCategories,
  } = useRefinementList({
    attribute: "category",
    limit: 2,
    showMore: true,
    showMoreLimit: 20,
  });

  // Subcategories filter
  const {
    items: subCategories,
    canToggleShowMore: canShowMoreSubCategories,
    toggleShowMore: toggleShowMoreSubCategories,
    isShowingMore: isShowingMoreSubCategories,
  } = useRefinementList({
    attribute: "subcategories",
    limit: 2,
    showMore: true,
    showMoreLimit: 20,
  });

  // Expected Salary filter
  const {
    items: expectedSalary,
    canToggleShowMore: canShowMoreExpectedSalary,
    toggleShowMore: toggleShowMoreExpectedSalary,
    isShowingMore: isShowingMoreExpectedSalary,
  } = useRefinementList({
    attribute: "expectedSalary",
    limit: 2,
    showMore: true,
    showMoreLimit: 20,
  });

  // Gender filter
  const {
    items: gender,
    canToggleShowMore: canShowMoreGender,
    toggleShowMore: toggleShowMoreGender,
    isShowingMore: isShowingMoreGender,
  } = useRefinementList({
    attribute: "gender",
    limit: 2,
    showMore: true,
    showMoreLimit: 20,
  });

  // Languages filter
  const {
    items: languages,
    canToggleShowMore: canShowMoreLanguages,
    toggleShowMore: toggleShowMoreLanguages,
    isShowingMore: isShowingMoreLanguages,
  } = useRefinementList({
    attribute: "languages",
    limit: 2,
    showMore: true,
    showMoreLimit: 20,
  });

  // Rating filter
  const {
    items: rating,
    canToggleShowMore: canShowMoreRating,
    toggleShowMore: toggleShowMoreRating,
    isShowingMore: isShowingMoreRating,
  } = useRefinementList({
    attribute: "rating",
    limit: 2,
    showMore: true,
    showMoreLimit: 20,
  });

  // Work Experience filter
  const {
    items: workExp,
    canToggleShowMore: canShowMoreWorkExp,
    toggleShowMore: toggleShowMoreWorkExp,
    isShowingMore: isShowingMoreWorkExp,
  } = useRefinementList({
    attribute: "workExp",
    limit: 2,
    showMore: true,
    showMoreLimit: 20,
  });

  const { refine: clear } = useClearRefinements();

  React.useEffect(() => {
    if (isDrawerOpen) {
      const current = {
        category: categories.filter((c) => c.isRefined).map((c) => c.value),
        subcategories: subCategories
          .filter((s) => s.isRefined)
          .map((s) => s.value),
        expectedSalary: expectedSalary
          .filter((e) => e.isRefined)
          .map((e) => e.value),
        gender: gender.filter((g) => g.isRefined).map((g) => g.value),
        languages: languages.filter((l) => l.isRefined).map((l) => l.value),
        rating: rating.filter((r) => r.isRefined).map((r) => r.value),
        workExp: workExp.filter((w) => w.isRefined).map((w) => w.value),
      };
      setPendingFilters(current);

      const currentRadius = uiState[indexName]?.configure?.aroundRadius;
      if (currentRadius !== undefined) {
        setPendingRadiusKm(Number(currentRadius) / 1000); // Convert meters to km
      }
    }
  }, [isDrawerOpen]);

  // Helper function to toggle filter in local state
  const togglePendingFilter = (
    attribute: keyof typeof pendingFilters,
    value: string,
  ) => {
    setPendingFilters((prev) => {
      const current = prev[attribute];
      const isSelected = current.includes(value);
      return {
        ...prev,
        [attribute]: isSelected
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  // Helper function to check if a filter is pending
  const isPendingFilter = (
    attribute: keyof typeof pendingFilters,
    value: string,
  ) => {
    return pendingFilters[attribute].includes(value);
  };

  // Apply all pending filters
  const applyFilters = () => {
    const newUiState: any = {
      ...uiState,
      [indexName]: {
        ...uiState[indexName],
        refinementList: {
          category: pendingFilters.category,
          subcategories: pendingFilters.subcategories,
          expectedSalary: pendingFilters.expectedSalary,
          gender: pendingFilters.gender,
          languages: pendingFilters.languages,
          rating: pendingFilters.rating,
          workExp: pendingFilters.workExp,
        },
      },
    };

    // Add geo search parameters if user location is available
    if (latitude && longitude) {
      newUiState[indexName] = {
        ...newUiState[indexName],
        configure: {
          ...uiState[indexName]?.configure,
          aroundLatLng: `${latitude}, ${longitude}`,
          aroundRadius: pendingRadiusKm * 1000, // Convert km to meters
        },
      };
    }
    setUiState(newUiState);
    onToggleDrawer();
  };

  const clearAllFilters = () => {
    setPendingFilters({
      category: [],
      subcategories: [],
      expectedSalary: [],
      gender: [],
      languages: [],
      rating: [],
      workExp: [],
    });
    setPendingRadiusKm(2000);
    clear();
    setUiState((prev) => {
      const newState = { ...prev };
      if (newState[indexName]?.configure) {
        const { aroundLatLng, aroundRadius, ...restConfigure } =
          newState[indexName].configure;
        newState[indexName] = {
          ...newState[indexName],
          configure: restConfigure,
        };
      }
      return newState;
    });
    onToggleDrawer();
  };

  const totalPendingFilters = Object.values(pendingFilters).reduce(
    (acc, arr) => acc + arr.length,
    0,
  );

  if (!isDrawerOpen) {
    return (
      <Pressable
        className="py-5 flex-row justify-center items-center"
        onPress={onToggleDrawer}
      >
        <Text className="text-center text-xl text-secondary-content">
          Filters
        </Text>
        {totalPendingFilters > 0 && (
          <View className="bg-primary rounded-3xl py-1 px-2 ml-1">
            <Text className="text-secondary font-extrabold">
              {totalPendingFilters}
            </Text>
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onToggleDrawer}>
        <Animated.View
          className={"absolute top-0 right-0 bottom-0 left-0 bg-base-100 z-40"}
          style={[
            {
              opacity: translateX.interpolate({
                inputRange: [0, DRAWER_WIDTH],
                outputRange: [0.5, 0],
              }),
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX }],
          },
        ]}
        className={`bg-base-200 absolute top-0 right-0 bottom-0 z-50 shadow-base-200 shadow-sm`}
      >
        <ScrollView className="flex-1 ">
          <View className="flex-row justify-between items-center p-6 border-b-[1px] border-b-secondary bg-base-200">
            <Text className="text-2xl text-secondary">Filters</Text>
            <Pressable onPress={onToggleDrawer}>
              <Text className="text-3xl text-secondary p-2">✕</Text>
            </Pressable>
          </View>

          <View className="p-6 bg-base-200">
            {latitude && longitude && (
              <View className="mb-7">
                <Text className="text-xl font-semibold mb-3 text-secondary">
                  Distance
                </Text>
                <View className="mt-3">
                  <Slider
                    className="w-full h-12"
                    minimumValue={0}
                    maximumValue={2000}
                    step={1}
                    value={pendingRadiusKm}
                    onValueChange={setPendingRadiusKm}
                    minimumTrackTintColor="#ff7821"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#ff7821"
                  />
                  <Text className="text-base mt-2 text-secondary">
                    {pendingRadiusKm} km
                  </Text>
                </View>
              </View>
            )}
            {/* Categories */}
            {categories.length > 0 && (
              <View className="mb-7">
                <Text className="text-xl font-semibold mb-3 text-secondary">
                  Categories
                </Text>
                <View className="mt-3">
                  {categories.map((category) => (
                    <Pressable
                      key={category.value}
                      className="py-3 flex-row justify-between border-b-[1px] border-base-300 items-center"
                      onPress={() =>
                        togglePendingFilter("category", category.value)
                      }
                    >
                      <Text
                        className={`${isPendingFilter("category", category.value) ? "text-primary font-extrabold" : "text-secondary font-normal"} text-lg`}
                      >
                        {category.label}
                      </Text>
                      <View className="bg-primary rounded-3xl py-2 px-4">
                        <Text className="text-white font-bold">
                          {category.count}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
                {canShowMoreCategories && (
                  <Pressable
                    onPress={toggleShowMoreCategories}
                    className="mt-3"
                  >
                    <Text className="text-primary text-center">
                      {isShowingMoreCategories ? "Show less" : "Show more"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Subcategories */}
            {subCategories.length > 0 && (
              <View className="mb-7">
                <Text className="text-xl font-semibold mb-3 text-secondary">
                  Subcategories
                </Text>
                <View className="mt-3">
                  {subCategories.map((subcategory) => (
                    <Pressable
                      key={subcategory.value}
                      className="py-3 flex-row justify-between border-b-[1px] border-base-300 items-center"
                      onPress={() =>
                        togglePendingFilter("subcategories", subcategory.value)
                      }
                    >
                      <Text
                        className={`${isPendingFilter("subcategories", subcategory.value) ? "text-primary font-extrabold" : "text-secondary font-normal"} text-lg`}
                      >
                        {subcategory.label}
                      </Text>
                      <View className="bg-primary rounded-3xl py-2 px-4">
                        <Text className="text-white font-bold">
                          {subcategory.count}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
                {canShowMoreSubCategories && (
                  <Pressable
                    onPress={toggleShowMoreSubCategories}
                    className="mt-3"
                  >
                    <Text className="text-primary text-center">
                      {isShowingMoreSubCategories ? "Show less" : "Show more"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Expected Salary */}
            {expectedSalary.length > 0 && (
              <View className="mb-7">
                <Text className="text-xl font-semibold mb-3 text-secondary">
                  Expected Salary
                </Text>
                <View className="mt-3">
                  {expectedSalary.map((salary) => (
                    <Pressable
                      key={salary.value}
                      className="py-3 flex-row justify-between border-b-[1px] border-base-300 items-center"
                      onPress={() =>
                        togglePendingFilter("expectedSalary", salary.value)
                      }
                    >
                      <Text
                        className={`${isPendingFilter("expectedSalary", salary.value) ? "text-primary font-extrabold" : "text-secondary font-normal"} text-lg`}
                      >
                        {salary.label}
                      </Text>
                      <View className="bg-primary rounded-3xl py-2 px-4">
                        <Text className="text-white font-bold">
                          {salary.count}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
                {canShowMoreExpectedSalary && (
                  <Pressable
                    onPress={toggleShowMoreExpectedSalary}
                    className="mt-3"
                  >
                    <Text className="text-primary text-center">
                      {isShowingMoreExpectedSalary ? "Show less" : "Show more"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Gender */}
            {gender.length > 0 && (
              <View className="mb-7">
                <Text className="text-xl font-semibold mb-3 text-secondary">
                  Gender
                </Text>
                <View className="mt-3">
                  {gender.map((gen) => (
                    <Pressable
                      key={gen.value}
                      className="py-3 flex-row justify-between border-b-[1px] border-base-300 items-center"
                      onPress={() => togglePendingFilter("gender", gen.value)}
                    >
                      <Text
                        className={`${isPendingFilter("gender", gen.value) ? "text-primary font-extrabold" : "text-secondary font-normal"} text-lg`}
                      >
                        {gen.label}
                      </Text>
                      <View className="bg-primary rounded-3xl py-2 px-4">
                        <Text className="text-white font-bold">
                          {gen.count}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
                {canShowMoreGender && (
                  <Pressable onPress={toggleShowMoreGender} className="mt-3">
                    <Text className="text-primary text-center">
                      {isShowingMoreGender ? "Show less" : "Show more"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <View className="mb-7">
                <Text className="text-xl font-semibold mb-3 text-secondary">
                  Languages
                </Text>
                <View className="mt-3">
                  {languages.map((lang) => (
                    <Pressable
                      key={lang.value}
                      className="py-3 flex-row justify-between border-b-[1px] border-base-300 items-center"
                      onPress={() =>
                        togglePendingFilter("languages", lang.value)
                      }
                    >
                      <Text
                        className={`${isPendingFilter("languages", lang.value) ? "text-primary font-extrabold" : "text-secondary font-normal"} text-lg`}
                      >
                        {lang.label}
                      </Text>
                      <View className="bg-primary rounded-3xl py-2 px-4">
                        <Text className="text-white font-bold">
                          {lang.count}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
                {canShowMoreLanguages && (
                  <Pressable onPress={toggleShowMoreLanguages} className="mt-3">
                    <Text className="text-primary text-center">
                      {isShowingMoreLanguages ? "Show less" : "Show more"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Rating */}
            {rating.length > 0 && (
              <View className="mb-7">
                <Text className="text-xl font-semibold mb-3 text-secondary">
                  Rating
                </Text>
                <View className="mt-3">
                  {rating.map((rate) => (
                    <Pressable
                      key={rate.value}
                      className="py-3 flex-row justify-between border-b-[1px] border-base-300 items-center"
                      onPress={() => togglePendingFilter("rating", rate.value)}
                    >
                      <Text
                        className={`${isPendingFilter("rating", rate.value) ? "text-primary font-extrabold" : "text-secondary font-normal"} text-lg`}
                      >
                        {rate.label}
                      </Text>
                      <View className="bg-primary rounded-3xl py-2 px-4">
                        <Text className="text-white font-bold">
                          {rate.count}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
                {canShowMoreRating && (
                  <Pressable onPress={toggleShowMoreRating} className="mt-3">
                    <Text className="text-primary text-center">
                      {isShowingMoreRating ? "Show less" : "Show more"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Work Experience */}
            {workExp.length > 0 && (
              <View className="mb-7">
                <Text className="text-xl font-semibold mb-3 text-secondary">
                  Work Experience
                </Text>
                <View className="mt-3">
                  {workExp.map((exp) => (
                    <Pressable
                      key={exp.value}
                      className="py-3 flex-row justify-between border-b-[1px] border-base-300 items-center"
                      onPress={() => togglePendingFilter("workExp", exp.value)}
                    >
                      <Text
                        className={`${isPendingFilter("workExp", exp.value) ? "text-primary font-extrabold" : "text-secondary font-normal"} text-lg`}
                      >
                        {exp.label}
                      </Text>
                      <View className="bg-primary rounded-3xl py-2 px-4">
                        <Text className="text-white font-bold">
                          {exp.count}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
                {canShowMoreWorkExp && (
                  <Pressable onPress={toggleShowMoreWorkExp} className="mt-3">
                    <Text className="text-primary text-center">
                      {isShowingMoreWorkExp ? "Show less" : "Show more"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row py-4 border-t-[1px] border-t-secondary bg-base-200 mb-16">
            <View className="flex-1 mx-2">
              <Button
                title="Clear all"
                color="#252b33"
                disabled={totalPendingFilters === 0}
                onPress={clearAllFilters}
              />
            </View>
            <View className="flex-1 mx-4">
              <Button
                onPress={applyFilters}
                title="Show Results"
                color="#252b33"
              />
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  drawer: {
    width: DRAWER_WIDTH,
    elevation: 5,
  },
});
