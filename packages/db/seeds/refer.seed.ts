// import { UserModel } from "../schema/auth.schema";
// import { Profile } from "@/features/user/user.model";
// import { UserRole } from "@/types/auth";
// import mongoose from "mongoose";
// import { sql } from "./mysqldb";
// import { DBConnection } from "../index";

// export const referSeed = async () => {
//   if (process.env.MONGODB_CONECTION) {
//     DBConnection(process.env.MONGODB_CONECTION);
//   } else {
//     console.error("MongoDB connection string is missing in .env");
//     process.exit(1);
//   }

//   await UserModel.deleteMany();
//   await Profile.deleteMany();

//   const [franchises] = (await sql.execute("SELECT * FROM franchises")) as any;

//   // for (const row of rows) {
//   const row = franchises[0];

//   const user = {
//     username: row.username ?? "null",
//     phoneNumber: row.phone ?? "null",
//     email: row.email ?? `temp${row.id}@gmail.com`,
//     password: row.plain_password ?? "null",
//     role: UserRole.franchises,
//     created_at: row.created_at,
//     verified: true,
//     google_id: row.google_id,
//     createdAt: row.created_at,
//     updatedAt: row.updated_at,
//   };

//   const createuser = await UserModel.create(user);

//   // const photo = await uploadOnCloudinary(`https://justsearch.net.in/assets/images/${row.photo}`)

//   await Profile.create({
//     user_Id: createuser._id,
//     first_name: row.first_name ?? "null",
//     last_name: row.last_name ?? "null",
//     gender: row.gender,
//     dob: row.dob,
//     address: row.address,
//     city: row.city,
//     state: row.state,
//     country: row.country,
//     zipcode: row.zipcode,
//     createdAt: row.created_at,
//     updatedAt: row.updated_at,
//   });

//   // }

//   console.log("all added successfully");

//   mongoose.disconnect();
//   sql.destroy();
// };
