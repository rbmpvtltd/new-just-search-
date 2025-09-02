import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
  schema: "./schema/**/*.schema.ts", // 👈 schema files ka path
  out: "./drizzle", // migration folder
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.PGHOST ?? "localhost",
    user: process.env.PGUSER ?? "postgres",
    password: process.env.PGPASSWORD ?? "12345678",
    database: process.env.PGDATABASE ?? "justsearch",
    port: Number(process.env.PGPORT || 5432),

    ssl: false,
  },
});
