import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";

export const usersColumns = {
  // status: subcategories.status,
  id: users.id,
  // category: categories.title,
  // subcategory_name: subcategories.name,
  // slug: subcategories.slug,
  // status: subcategories.status,
};

export const usersGlobalFilterColumns = [
  // subcategories.name, categories.title
];
export const usersAllowedSortColumns = [
  // "title",
  // "name",
  "id",
  // "status",
  // "created_at",
];

export const generateReferCode = async (
  lastAssignCode: number,
  prifix: string,
): Promise<{ newReferCode: string; nextNumber: number }> => {
  const nextNumber = lastAssignCode + 1;
  const fullCode = nextNumber.toString().padStart(4, "0");
  const newReferCode = `${prifix}${fullCode}`;

  const isNewReferCodeExist = await db.query.salesmen.findFirst({
    where: (salesman, { eq }) => eq(salesman.referCode, newReferCode),
  });

  if (isNewReferCodeExist) {
    return generateReferCode(nextNumber, prifix);
  }
  return { newReferCode, nextNumber };
};
