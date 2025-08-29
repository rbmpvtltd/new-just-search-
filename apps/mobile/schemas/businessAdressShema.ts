import { z } from "zod";

export const businessAddressSchema = z.object({
  building_name: z.string().min(5, "building name must be 5 characters"),

  street_name: z
    .string()
    .min(5, "colony must be 5 character")
    .max(100, "colony should not be 100 or above character"),

  landmark: z
    .string()
    .min(5, "landmark must be 5 character")
    .max(25, "landmark should not be 25 or above character"),

  area: z
    .string()
    .min(10, "Address must be at least 10 characters long")
    .max(100, "Address must be at most 100 characters long"),

  latitude: z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, "Invalid latitude format (e.g., 26.9124)")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num >= -90 && num <= 90;
      },
      {
        message: "Latitude must be between -90 and 90",
      },
    ),

  longitude: z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, "Invalid longitude format (e.g., 75.7873)")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num >= -180 && num <= 180;
      },
      {
        message: "Longitude must be between -180 and 180",
      },
    ),

  pincode: z
    .string()
    .length(6, "Pincode must be exactly 6 digits")
    .regex(/^[1-9][0-9]{5}$/, "Invalid pincode format"),

  state: z.number().min(1, "Please select a state"),

  city: z.number().min(1, "Please select a city"),
});

export type BusinessAddressData = z.infer<typeof businessAddressSchema>;
