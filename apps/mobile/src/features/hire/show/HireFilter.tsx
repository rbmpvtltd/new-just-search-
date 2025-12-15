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
  useRefinementList,
} from "react-instantsearch-core";
import { useInstantSearch } from "react-instantsearch-core";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.7;

interface FiltersProps {
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
}

export function HireFilters({ isDrawerOpen, onToggleDrawer }: FiltersProps) {
  const { setUiState, indexUiState } = useInstantSearch();
  const translateX = React.useRef(new Animated.Value(DRAWER_WIDTH)).current;

  // Local state to track pending filter selections
  const [pendingFilters, setPendingFilters] = React.useState<{
    subcategories: string[];
    category: string[];
    expectedSalary: string[];
    gender: string[];
    languages: string[];
    workExp: string[];
  }>({
    subcategories: [],
    category: [],
    expectedSalary: [],
    gender: [],
    languages: [],
    workExp: [],
  });

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isDrawerOpen ? 0 : DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDrawerOpen]);

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

  const {
    items: languages,
    canToggleShowMore: canShowMoreLanguage,
    toggleShowMore: toggleShowMoreLanguage,
    isShowingMore: isShowingMoreLanguage,
  } = useRefinementList({
    attribute: "languages",
    limit: 2,
    showMore: true,
    showMoreLimit: 20,
  });

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

  // Initialize pending filters from current refinements when drawer opens
  React.useEffect(() => {
    if (isDrawerOpen) {
      const current = {
        subcategories: subCategories
          .filter((s) => s.isRefined)
          .map((s) => s.value),
        category: categories.filter((c) => c.isRefined).map((c) => c.value),
        expectedSalary: expectedSalary
          .filter((e) => e.isRefined)
          .map((e) => e.value),
        gender: gender.filter((g) => g.isRefined).map((g) => g.value),
        languages: languages.filter((l) => l.isRefined).map((l) => l.value),
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
      hire_listing: {
        ...prev.hire_listing,
        refinementList: {
          category: pendingFilters.category,
          subcategories: pendingFilters.subcategories,
          expectedSalary: pendingFilters.expectedSalary,
          gender: pendingFilters.gender,
          languages: pendingFilters.languages,
          workExp: pendingFilters.workExp,
        },
      },
    }));

    onToggleDrawer();
  };

  // Clear all pending filters
  const clearAllFilters = () => {
    setPendingFilters({
      subcategories: [],
      category: [],
      expectedSalary: [],
      gender: [],
      languages: [],
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
                <Pressable onPress={toggleShowMoreCategories} className="mt-3">
                  <Text className="text-primary text-center">
                    {isShowingMoreCategories ? "Show less" : "Show more"}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Subcategories */}
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

            {/* Expected Salary */}
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

            {/* Gender */}
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
                      <Text className="text-white font-bold">{gen.count}</Text>
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

            {/* Languages */}
            <View className="mb-7">
              <Text className="text-xl font-semibold mb-3 text-secondary">
                Languages
              </Text>
              <View className="mt-3">
                {languages.map((language) => (
                  <Pressable
                    key={language.value}
                    style={styles.item}
                    onPress={() =>
                      togglePendingFilter("languages", language.value)
                    }
                  >
                    <Text
                      className={`${isPendingFilter("languages", language.value) ? "text-primary font-extrabold" : "text-secondary font-normal"} text-lg`}
                    >
                      {language.label}
                    </Text>
                    <View className="bg-primary rounded-3xl py-2 px-4">
                      <Text className="text-white font-bold">
                        {language.count}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              {canShowMoreLanguage && (
                <Pressable onPress={toggleShowMoreLanguage} className="mt-3">
                  <Text className="text-primary text-center">
                    {isShowingMoreLanguage ? "Show less" : "Show more"}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Work Experience */}
            <View className="mb-7">
              <Text className="text-xl font-semibold mb-3 text-secondary">
                Work Experience
              </Text>
              <View style={styles.list}>
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
                      <Text className="text-white font-bold">{exp.count}</Text>
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
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f8f9fa",
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 28,
    color: "#666",
    padding: 5,
  },
  container: {
    padding: 18,
    backgroundColor: "#ffffff",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  list: {
    marginTop: 8,
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
  filterListButtonContainer: {
    flexDirection: "row",
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#f8f9fa",
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
  filtersButtonText: {
    fontSize: 18,
    textAlign: "center",
  },
});
