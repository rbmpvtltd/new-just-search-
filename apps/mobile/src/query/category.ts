import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export type CategoryItem = {
  name: any;
  parent_id: any;
  id: number;
  title: string;
  photo: string;
  slug: string;
  type: number;
};

type CategoryList = CategoryItem[];

const fetchCategoryList = async (): Promise<{
  categories: CategoryList;
  subcategories: CategoryList;
}> => {
  const response = await api(methods.get, `${apiUrl}/api/categories`, {});

  return {
    categories: response.categories,
    subcategories: response.subcategories,
  };
};

export const useCategoryList = () => {
  return useSuspenseQuery({
    queryKey: ["categoryList"],
    queryFn: fetchCategoryList,
  });
};
