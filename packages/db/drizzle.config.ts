// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./dist/schema/**/*.schema.js", "./dist/enum/**/*.enum.js"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.PGHOST ?? "localhost",
    user: process.env.PGUSER ?? "myuser",
    password: process.env.PGPASSWORD ?? "mypassword",
    database: process.env.PGDATABASE ?? "mydb",
    port: Number(process.env.PGPORT) ?? 5432,
    ssl: false,
  },
});
