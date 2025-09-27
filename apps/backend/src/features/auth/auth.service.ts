import { db } from "@repo/db";

const getUserByUserName = async (username: string) => {
  const user = await db.query.users.findFirst({
    where: (user, { eq, or }) =>
      or(eq(user.email, username), eq(user.phoneNumber, username)),
  });
  return user;
};

const getUserById = async (id: number) => {
  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  });
  return user;
};

const checkPasswordGetUser = async (username: string, password: string) => {
  const user = await getUserByUserName(username);
  if (!user) {
    return false;
  }
  // TODO: get hash password;
  if (user.password !== password) {
    return false;
  }
  return user;
};

export { getUserByUserName, getUserById, checkPasswordGetUser };
