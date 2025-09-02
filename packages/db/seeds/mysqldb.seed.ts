import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({path : "../.env"})

console.log("==================>",process.env.MYSQL_USER)
console.log(process.env.MYSQL_HOST)
console.log(process.env.MYSQL_PASSWORD)
console.log(process.env.MYSQL_DATABASE)


export const sql = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
