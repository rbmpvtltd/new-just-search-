import { z } from "zod";

export const addProductSchema = z.object({
  product_name: z.string().min(1, "Please Enter Product Name"),
  rate: z.string().min(1, "Please Enter Product Price"),
  category_id: z.string().min(1, {
    message: "Please select at least one category for which you are applying",
  }),
  subcategory_id: z.array(z.string()).min(1, {
    message:
      "Please select at least one sub-category for which you are applying",
  }),
  product_description: z.string().min(1, "Please Enter Product Description"),

  // image1 is now required
  image1: z.any().refine((file) => file !== undefined && file !== null, {
    message: "Image 1 is required",
  }),

  // optional images
  image2: z.any().optional(),
  image3: z.any().optional(),
  image4: z.any().optional(),
  image5: z.any().optional(),
});

export type AddProductSchemaType = z.infer<typeof addProductSchema>;
