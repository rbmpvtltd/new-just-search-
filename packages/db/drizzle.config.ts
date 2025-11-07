import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./dist/schema/**/*.schema.js", // 👈 schema files ka path
  out: "./drizzle", // migration folder
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
