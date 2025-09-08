import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CategoryItem, type CategoryItemInterface } from "./category-item";

const categories: CategoryItemInterface[] = [
  {
    id: 1,
    category_name: "cat1",
    image_url: "hi",
  },
  {
    id: 2,
    category_name: "cat2",
    image_url: "hi",
  },
  {
    id: 3,
    category_name: "cat3",
    image_url: "hi",
  },
  {
    id: 4,
    category_name: "cat4",
    image_url: "hi",
  },
  {
    id: 5,
    category_name: "cat5",
    image_url: "hi",
  },
  {
    id: 6,
    category_name: "cat6",
    image_url: "hi",
  },
];

export default function CategoryCardComponent() {
  return (
    <Carousel opts={{ dragFree: true }}>
      <CarouselContent className=" -ml-4">
        {categories.map((item) => (
          <CarouselItem className="basis-1/3" key={item.id}>
            <CategoryItem item={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
