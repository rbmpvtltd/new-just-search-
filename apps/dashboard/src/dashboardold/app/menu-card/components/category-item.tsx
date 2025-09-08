"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

export interface CategoryItemInterface {
  id: number;
  category_name: string;
  image_url: string;
}

export const CategoryItem = ({ item }: { item: CategoryItemInterface }) => {
  return (
    <div className="p-4 select-none">
      <Card
        onClick={() => {
          console.log("hi");
        }}
        className="flex flex-col justify-center items-center"
      >
        <CardContent>
          <p>{item.image_url}</p>
        </CardContent>
        <CardFooter>
          <p>{item.category_name}</p>
        </CardFooter>
      </Card>
    </div>
  );
};
