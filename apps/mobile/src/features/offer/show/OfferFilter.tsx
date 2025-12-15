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
}

export function OfferProductFilters({
  isDrawerOpen,
  onToggleDrawer,
}: FiltersProps) {
  const { setUiState, indexUiState } = useInstantSearch();
  const translateX = React.useRef(new Animated.Value(DRAWER_WIDTH)).current;

  // Local state to track pending filter selections
  const [pendingFilters, setPendingFilters] = React.useState<{
    subcategories: string[];
    category: string[];
    discountPercent: string[];
    finalPrice: string[];
    price: string[];
  }>({
    subcategories: [],
    category: [],
    discountPercent: [],
    finalPrice: [],
    price: [],
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
    items: discountPercent,
    canToggleShowMore: canShowMoreDiscountPercent,
    toggleShowMore: toggleShowMoreDiscountPercent,
    isShowingMore: isShowingMoreDiscountPercent,
  } = useRefinementList({
    attribute: "discountPercent",
    limit: 2,
    showMore: true,
    showMoreLimit: 20,
  });

  const {
    items: finalPrice,
    canToggleShowMore: canShowMoreFinalPrice,
    toggleShowMore: toggleShowMoreFinalPrice,
    isShowingMore: isShowingMoreFinalPrice,
  } = useRefinementList({
    attribute: "finalPrice",
    limit: 2,
    showMore: true,
    showMoreLimit: 20,
  });

  const {
    items: price,
    canToggleShowMore: canShowMorePrice,
    toggleShowMore: toggleShowMorePrice,
    isShowingMore: isShowingMoreLanguage,
  } = useRefinementList({
    attribute: "price",
    limit: 2,
    showMore: true,
    showMoreLimit: 20,
  });
  const { refine: clear } = useClearRefinements();

  React.useEffect(() => {
    if (isDrawerOpen) {
      const current = {
        subcategories: subCategories
          .filter((s) => s.isRefined)
          .map((s) => s.value),
        category: categories.filter((c) => c.isRefined).map((c) => c.value),
        discountPercent: discountPercent
          .filter((e) => e.isRefined)
          .map((e) => e.value),
        finalPrice: finalPrice.filter((g) => g.isRefined).map((g) => g.value),
        price: price.filter((l) => l.isRefined).map((l) => l.value),
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
      product_offer_listing: {
        ...prev.product_offer_listing,
        refinementList: {
          category: pendingFilters.category,
          subcategories: pendingFilters.subcategories,
          discountPercent: pendingFilters.discountPercent,
          finalPrice: pendingFilters.finalPrice,
          price: pendingFilters.price,
        },
      },
    }));

    onToggleDrawer();
  };

  const clearAllFilters = () => {
    setPendingFilters({
      subcategories: [],
      category: [],
      discountPercent: [],
      finalPrice: [],
      price: [],
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
                Discount Percent
              </Text>
              <View className="mt-3">
                {discountPercent.map((discount) => (
                  <Pressable
                    key={discount.value}
                    style={styles.item}
                    onPress={() =>
                      togglePendingFilter("discountPercent", discount.value)
                    }
                  >
                    <Text
                      className={`${isPendingFilter("discountPercent", discount.value) ? "text-primary font-extrabold" : "text-secondary font-normal"} text-lg`}
                    >
                      {discount.label}
                    </Text>
                    <View className="bg-primary rounded-3xl py-2 px-4">
                      <Text className="text-white font-bold">
                        {discount.count}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              {canShowMoreDiscountPercent && (
                <Pressable
                  onPress={toggleShowMoreDiscountPercent}
                  className="mt-3"
                >
                  <Text className="text-primary text-center">
                    {isShowingMoreDiscountPercent ? "Show less" : "Show more"}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Gender */}
            <View className="mb-7">
              <Text className="text-xl font-semibold mb-3 text-secondary">
                Final Price
              </Text>
              <View className="mt-3">
                {finalPrice.map((finPrice) => (
                  <Pressable
                    key={finPrice.value}
                    style={styles.item}
                    onPress={() =>
                      togglePendingFilter("finalPrice", finPrice.value)
                    }
                  >
                    <Text
                      className={`${isPendingFilter("finalPrice", finPrice.value) ? "text-primary font-extrabold" : "text-secondary font-normal"} text-lg`}
                    >
                      {finPrice.label}
                    </Text>
                    <View className="bg-primary rounded-3xl py-2 px-4">
                      <Text className="text-white font-bold">
                        {finPrice.count}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              {canShowMoreFinalPrice && (
                <Pressable onPress={toggleShowMoreFinalPrice} className="mt-3">
                  <Text className="text-primary text-center">
                    {isShowingMoreFinalPrice ? "Show less" : "Show more"}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Languages */}
            <View className="mb-7">
              <Text className="text-xl font-semibold mb-3 text-secondary">
                Price
              </Text>
              <View className="mt-3">
                {price.map((pri) => (
                  <Pressable
                    key={pri.value}
                    style={styles.item}
                    onPress={() => togglePendingFilter("price", pri.value)}
                  >
                    <Text
                      className={`${isPendingFilter("price", pri.value) ? "text-primary font-extrabold" : "text-secondary font-normal"} text-lg`}
                    >
                      {pri.label}
                    </Text>
                    <View className="bg-primary rounded-3xl py-2 px-4">
                      <Text className="text-white font-bold">{pri.count}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              {canShowMorePrice && (
                <Pressable onPress={toggleShowMorePrice} className="mt-3">
                  <Text className="text-primary text-center">
                    {isShowingMoreLanguage ? "Show less" : "Show more"}
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
