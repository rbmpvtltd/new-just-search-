import Link from "next/link";
import { Button } from "@/components/ui/button"; // assuming shadcn/ui or similar
import MyProduct from "@/features/product/show/MyProduct";

export default function page() {
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Products</h1>
        <Link href="/user/product/add">
          <Button>Add Product</Button>
        </Link>
      </div>

      <MyProduct />
    </div>
  );
}
