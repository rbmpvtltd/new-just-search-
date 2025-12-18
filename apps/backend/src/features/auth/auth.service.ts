import { db } from "@repo/db";
import bcrypt from "bcryptjs";

const getUserByUserName = async (username: string) => {
  console.log("========> getUserByUserName", username);

  try {
    const user = await db.query.users.findFirst({
      where: (user, { eq, or }) =>
        or(eq(user.email, username), eq(user.phoneNumber, username)),
    });

    console.log("USER FOUND:", user);
    return user;
  } catch (err) {
    console.error("DB ERROR:", err);
    throw err;
  }
};

const getUserById = async (id: number) => {
  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  });
  return user;
};

const checkPasswordGetUser = async (username: string, password: string) => {
  const user = await getUserByUserName(username);
  console.log("===========> and execution comes in service file", user);
  if (!user || !user.password) {
    return false;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return false;
  }
  return user;
};

export { getUserByUserName, getUserById, checkPasswordGetUser };
