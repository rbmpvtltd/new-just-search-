const getUserById = (email: string) => {
  if (email !== "otherritik000@gmail.com") {
    return false;
  }
  return {
    email: "hackritik000@gmail.com",
    password: "12345678",
  };
};

const checkUserPassword = (email: string, password: string) => {
  const user = getUserById(email);
  if (!user) {
    return false;
  }
  if (user.password !== password) {
    return false;
  }
  return true;
};

const generateToken = () => {
  return "asldfjaqffj4o4jlkjfoajhfae";
};

export { getUserById, checkUserPassword, generateToken };
