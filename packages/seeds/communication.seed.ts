// import dotenv from "dotenv";
// import { eq } from "drizzle-orm";
// import { db } from "@repo/db";
// import { users } from "@repo/db/dist/schema/auth.schema";
// import { sql } from "./mysqldb.seed";

// dotenv.config();

// export const communicationSeed = async () => {
//   await addChatMessage();
//   // await addNotifications();
// };

// // 1.chat_messages
// const addChatMessage = async () => {
//   const [chat]: any[] = await sql.execute("SELECT * FROM chat_messages");
//   for (const row of chat) {
//     const user = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, row.sender_id));

//     if (!user) {
//       console.log("user not found", row.id);
//       continue;
//     }

//     const userReceiver = await sql.execute("SELECT * FROM user_subscriptions")
//     if (!userReceiver) {
//       console.log("userReceiver not found", row.id);
//       continue;
//     }
//     console.log(userReceiver)

//     const chatMessage = {
//       mysql_id: row.id,
//       sender_id: user._id,
//       receiver_id: "dfj",
//       message: row.message,
//       createdAt: row.created_at,
//       updatedAt: row.updated_at,
//     };
//   }
// };

// // // 2.notifications
// // const addNotifications = async () => {
// //   // await Notification.deleteMany();

// //   const [notifications]: any[] = await sql.execute(
// //     "SELECT * FROM notifications",
// //   );

// //   for (const row of notifications) {
// //     const user = await UserModel.findOne({ mysql_user_id: row.user_id });
// //     if (!user) {
// //       console.log("user not found", row.id);
// //       continue;
// //     }

// //     const Notifications = {
// //       user_id: user._id,
// //       is_read: Boolean(row.is_read),
// //       message: row.message,
// //       read_at: row.read_at,
// //       // router : row
// //     };

// //     // const notificationsCreate = await Notification.create(Notifications);
// //   }
// // };

// // // table not available
// // // 3. comments

// // // table not available
// // // 4. chat_image

// // // table not available
// // // 5. chat_messages_admin

// // // table not available
// // // 6. admin_user_image
