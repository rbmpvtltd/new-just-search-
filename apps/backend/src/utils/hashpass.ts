import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
  return await bcrypt.hash(password, salt);
};
