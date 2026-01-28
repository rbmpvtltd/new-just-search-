import { db, type UserRole } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import { logger } from "@repo/logger";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

// const businessListings = schemas.business.businessListings;

export const fakeSeed = async () => {
  try {
    logger.info("adding fake admin");
    await seedRealUser("admin@gmail.com", "admin@123", "admin");
    await seedRealUser("ranjeet@gmail.com", "admin@123", "admin");
    await seedRealUser("ritik@gmail.com", "admin@123", "admin");
    await seedRealUser("meekail@gmail.com", "admin@123", "admin");
    await seedRealUser("salonimam@gmail.com", "admin@123", "visitor");
    await seedRealUser("visitor@gmail.com", "visitor@123", "visitor");
    await seedRealUser("visitor@rbm.com", "rbm.justsearch@123", "visitor");
    await seedRealUser("business@rbm.com", "rbm.justsearch@123", "business");
    await seedRealUser("hire@rbm.com", "rbm.justsearch@123", "hire");

    logger.info("added fake admin");
    return;
  } catch (error) {
    console.error("Error in fakeSeed:", error);
    throw error;
  }
};

export const getFakeBusinessUser = async () => {
  const [fakeUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, "business@rbm.com"));
  return fakeUser;
};

export const getFakeHireUser = async () => {
  const [fakeUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, "hire@rbm.com"));
  return fakeUser;
};

const seedRealUser = async (
  email: string,
  password: string,
  role: UserRole,
) => {
  try {
    logger.info("....start");
    // Pehle associated business listings delete karo
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      logger.info(existingUser);

      return;
    }
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
    const hashPassword = await bcrypt.hash(password, salt);

    logger.info("....start ...");
    const [insertedAdmin] = await db
      .insert(users)
      .values({
        displayName: email,
        phoneNumber: "fake",
        email: email,
        password: hashPassword,
        role: role,
        googleId: "fake",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return insertedAdmin;
  } catch (error) {
    console.error("Error in seedFakeUser:", error);
    throw error;
  }
};
