import { uploadOnCloudinary } from "@repo/cloudinary";
import { db } from "@repo/db";
import { recentViewProducts } from "@repo/db/dist/schema/product.schema";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { users } from "../db/src/schema/auth.schema";
import { businessListings } from "../db/src/schema/business.schema";
import {
  categories,
  cities,
  subcategories,
} from "../db/src/schema/not-related.schema";
import {
  productPhotos,
  productReviews,
  productSubCategories,
  products,
} from "../db/src/schema/product.schema";
// import { fakeBusinessSeed, fakeSeed, fakeUserSeed } from "./fake.seed";
import { sql } from "./mysqldb.seed";
import { clouadinaryFake } from "./seeds";

dotenv.config();
export const productSeed = async () => {
  await clearAllTablesBusiness();
  await addProduct();
  await addProductReviews();
  await addProductSubCategroy();
  // await addRecentViewProduct();
};

export const clearAllTablesBusiness = async () => {
  await db.execute(
    `TRUNCATE TABLE product_subcategories RESTART IDENTITY CASCADE;`,
  );
  await db.execute(`TRUNCATE TABLE product_reviews RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE products RESTART IDENTITY CASCADE;`);
  console.log(" All tables cleared successfully!");
};

// 1. Product
export const addProduct = async () => {
  const [ProductRows]: any[] = await sql.execute("SELECT * FROM products");
  for (const row of ProductRows) {
    const [business] = await db
      .select()
      .from(businessListings)
      .where(eq(businessListings.id, row.listing_id));

    if (!business) {
      console.log("business not found", row.id);
      continue;
    }

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, row.category_id));

    if (!category) {
      console.log("category not found", row.id);
      continue;
    }

    const liveProductsImageUrl = `https://justsearch.net.in/assets/images/image1`;
    const uploaded = await uploadOnCloudinary(
      liveProductsImageUrl,
      "Products",
      clouadinaryFake,
    );

    const [productCreated] = await db
      .insert(products)
      .values({
        id: row.id,
        mainImage: uploaded,
        status: true,
        businessId: business.id,
        categoryId: category.id,
        productName: row.product_name,
        productSlug: row.product_slug,
        rate: row.rate,
        discountPercent: row.discount_percent,
        finalPrice: row.final_price,
        productDescription: row.product_description,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })
      .returning();

    if (!productCreated) {
      console.log("product not found", row.id);
      throw new Error("product not found");
    }

    // Product Photos
    const images = ["image2", "image3", "image4", "image5"];
    for (const image of images) {
      if (row[image]) {
        const liveProductsImageUrl = `https://justsearch.net.in/assets/images/${row[image]}`;
        const uploaded = await uploadOnCloudinary(
          liveProductsImageUrl,
          "Products",
          clouadinaryFake,
        );
        const photoUrl = uploaded;

        if (photoUrl) {
          await db.insert(productPhotos).values({
            productId: productCreated.id,
            photo: photoUrl,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          });
        }
      }
    }
  }
  console.log("successfully seed of product and product photo");
};

// 2. products_reviews
const addProductReviews = async () => {
  const [review]: any[] = await sql.execute("SELECT  * FROM products_reviews");

  for (const row of review) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, row.user_id));

    if (!user) {
      console.log(`user not found ${row.id} using faKe user`);
      continue;
    }

    const [business] = await db
      .select()
      .from(businessListings)
      .where(eq(businessListings.id, row.listing_id));

    if (!business) {
      console.log(`business not found ${row.id} using faKe business`);
      continue;
    }

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, row.product_id));
    if (!product) {
      console.log("Product not found", row.id);
      continue;
    }
    await db.insert(productReviews).values({
      id: row.id,
      userId: user.id,
      businessId: business.id,
      productId: product.id,
      name: row.name,
      email: row.email,
      message: row.message,
      rate: row.rate,
      status: true,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  // console.log('successfully seed of productReviews')
};

// 4.ProductSubcCategroy
const addProductSubCategroy = async () => {
  const [subCategory]: any[] = await sql.execute(
    "SELECT * FROM product_subcategory",
  );
  for (const row of subCategory) {
    const [Product] = await db
      .select()
      .from(products)
      .where(eq(products.id, row.product_id));
    if (!Product) {
      console.log("Product not found", row.id);
      continue;
    }

    const [subCategory] = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.id, row.subcategory_id));
    if (!subCategory) {
      console.log("subCategory not found", row.id);
      continue;
    }

    await db.insert(productSubCategories).values({
      productId: Product.id,
      subcategoryId: subCategory.id,
    });
  }
  console.log("succcessfully seed of product_subcategory");
};

// NOTE: recent_views_listings TABLE NOT FOUND
// 5. recent_views_product
// const addRecentViewProduct = async () => {
//   const [recentViews]: any[] = await sql.execute(
//     "SELECT * FROM recent_views_listings",
//   );
//   for (const row of recentViews) {
//     const [Product] = await db
//       .select()
//       .from(products)
//       .where(eq(products.id, row.listing_id));
//     if (!Product) {
//       console.log("Product not found", row.id);
//       continue;
//     }
//
//     await db.insert(recentViewProducts).values({
//       productId: Product.id,
//       device: row.device,
//       browser: row.browser,
//       operatingSystem: row.operating_system,
//       createdAt: row.created_at,
//       updatedAt: row.updated_at,
//     });
//   }
//   console.log("succcessfully seed of recent_views_listings");
// };
