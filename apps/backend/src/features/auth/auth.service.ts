const getUserByEmail = (email: string) => {
  // TODO: get it form db
  if (email !== "otherritik000@gmail.com") {
    return false;
  }
  return {
    userId: 10,
    email: "otherritik000@gmail.com",
    password: "12345678",
  };
};

interface Session {
  id: string;
  secretHash: Uint8Array;
  createdAt: Date;
}

const checkUserPassword = (email: string, password: string) => {
  const user = getUserByEmail(email);
  if (!user) {
    return false;
  }
  // TODO: get hash password;
  if (user.password !== password) {
    return false;
  }
  return user;
};

export { type getUserByEmail, checkUserPassword };
