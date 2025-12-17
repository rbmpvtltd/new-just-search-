import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import {
  useClearRefinements,
  useInstantSearch,
  useRefinementList,
} from "react-instantsearch-core";

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
  const { setUiState } = useInstantSearch();
  const translateX = React.useRef(new Animated.Value(DRAWER_WIDTH)).current;

  // Local state to track pending filter selections
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
    setUiState((prev) => ({
      ...prev,
      all_listing: {
        ...prev.all_listing,
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
    }));

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
    clear();
    onToggleDrawer();
  };

  const totalPendingFilters = Object.values(pendingFilters).reduce(
    (acc, arr) => acc + arr.length,
    0,
  );

  if (!isDrawerOpen) {
    return (
      <Pressable style={styles.filtersButton} onPress={onToggleDrawer}>
        <Text className="text-center text-xl text-secondary-content">
          Filters
        </Text>
        {totalPendingFilters > 0 && (
          <View style={styles.itemCount}>
            <Text style={styles.itemCountText}>{totalPendingFilters}</Text>
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
          style={[
            styles.backdrop,
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
        className={"bg-base-200"}
      >
        <ScrollView className="flex-1">
          <View className="flex-row justify-between items-center p-6 border-b-[1px] border-b-secondary bg-base-200">
            <Text className="text-2xl text-secondary">Filters</Text>
            <Pressable onPress={onToggleDrawer}>
              <Text className="text-3xl text-secondary p-2">✕</Text>
            </Pressable>
          </View>

          <View className="p-6 bg-base-200">
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
                      style={styles.item}
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
                      style={styles.item}
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
                      style={styles.item}
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
                      style={styles.item}
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
                      style={styles.item}
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
                      style={styles.item}
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
                      style={styles.item}
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
          <View className="flex-row p-5 border-t-[1px] border-t-secondary bg-base-200">
            <View style={styles.filterListButton}>
              <Button
                title="Clear all"
                color="#252b33"
                disabled={totalPendingFilters === 0}
                onPress={clearAllFilters}
              />
            </View>
            <View style={styles.filterListButton}>
              <Button
                onPress={applyFilters}
                title="See results"
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
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    zIndex: 998,
  },
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#ffffff",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  itemCount: {
    backgroundColor: "#252b33",
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 4,
  },
  itemCountText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  filterListButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  filtersButton: {
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
