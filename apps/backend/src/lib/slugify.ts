import slugifylib from "slugify";

export const slugify = (name: string) =>
  slugifylib(name, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    trim: true,
  });
