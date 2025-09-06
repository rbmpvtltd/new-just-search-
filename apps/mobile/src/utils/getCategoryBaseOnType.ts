import { CategoryItem, useCategoryList } from "@/query/category";

export const useFilterCategoryList = (type: number) => {
  const { data: categoryList, ...rest } = useCategoryList();
  const filteredList: CategoryItem[] =
    categoryList.categories.filter((list) => list.type == type) || [];

  return {
    list: filteredList,
    ...rest,
  };
};
