import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({ path: ".env" });

export const sql = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || '12341234',
  database: process.env.MYSQL_DATABASE || 'justsearch',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
