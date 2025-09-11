import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
// import jwt, { type SignOptions } from "jsonwebtoken";
export enum UserRole {
  visiter = "visiter",
  admin = "admin",
  hire = "hire",
  business = "business",
  franchises = "franchises",
  salesman = "salesman",
}

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  password: text("password"),
  role: varchar("role", { length: 50 }).$type<UserRole>().notNull(),
  googleId: varchar("google_id", { length: 255 }),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
});

// UserSchema.pre<IUser>("save", async function (next) {
//   if (!this.isModified("password") || this.password?.startsWith("$2b$")) {
//     return next();
//   }

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// 🔐 Pre-save hook for password hashing
// UserSchema.pre<IUser>("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// ✅ Method to check password
// UserSchema.methods.isPasswordCorrect = async function (
//   this: IUser,
//   password: string,
// ): Promise<boolean> {
//   return bcrypt.compare(password, this.password);
// };

// // 🔑 Method to generate Access Token
// UserSchema.methods.generateAccessToken = function (this: IUser): string {
//   const payload = {
//     _id: this._id,
//     email: this.email,
//     username: this.username,
//     role: this.role,
//   };

//   const secret = process.env.USER_ACCESS_TOKEN_SECRET;
//   const expiresIn = process.env.USER_ACCESS_TOKEN_EXPIRY || "1h";

//   if (!secret) throw new Error("USER_ACCESS_TOKEN_SECRET is not defined");

//   const options: SignOptions = {
//     expiresIn: expiresIn as SignOptions["expiresIn"],
//   };

//   return jwt.sign(payload, secret, options);
// };

// // 🔁 Method to generate Refresh Token
// UserSchema.methods.generateRefreshToken = function (this: IUser): string {
//   const payload = { _id: this._id };

//   const secret = process.env.USER_REFRESH_TOKEN_SECRET;
//   const expiresIn = process.env.USER_REFRESH_TOKEN_EXPIRY || "7d";

//   if (!secret) throw new Error("USER_REFRESH_TOKEN_SECRET is not defined");

//   const options: SignOptions = {
//     expiresIn: expiresIn as SignOptions["expiresIn"],
//   };

//   return jwt.sign(payload, secret, options);
// };

// const UserModel: Model<IUser> = mongoose.model<IUser>("Users", UserSchema);
// export { UserModel };
// export type { IUser };
