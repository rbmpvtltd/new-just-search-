import dotenv from "dotenv";
import { DBConnection } from "@/config/dbConnections";

dotenv.config();

export const startDB = async () => {
  if (process.env.MONGODB_CONECTION) {
    await DBConnection(process.env.MONGODB_CONECTION);
  } else {
    console.error("MongoDB connection string is missing in .env");
    process.exit(1);
  }
};

export const seedAsyncHandler = (requestHandler: any) => {
  return () => {
    Promise.resolve(requestHandler()).catch((err) => console.error(err));
  };
};

export const readData = (index: number, data: string = "") => {
  if (index % 500 === 0) {
    console.log("readData in", data, index);
  }
};

// export const parseDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1;
//   const day = date.getDate();
//   const hour = date.getHours();
//   const minute = date.getMinutes();
//   const second = date.getSeconds();
//   return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
// };
