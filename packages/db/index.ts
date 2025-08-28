import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const database = process.env.PGDATABASE ?? "mydb";

const pool = new Pool({
  connectionString: database,
});
export const db = drizzle({ client: pool });

