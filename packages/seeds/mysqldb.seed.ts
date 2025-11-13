import mysql from "mysql2/promise";

const connect = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "12341234",
  database: process.env.MYSQL_DATABASE || "justsearch",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
export const sql = mysql.createPool(connect);
