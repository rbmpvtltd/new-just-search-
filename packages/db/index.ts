import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const database = process.env.PGDATABASE ?? "mydb";

const pool = new Pool({
  connectionString: database,
});
const db = drizzle({ client: pool });

const result = await db.execute("select 1");

console.log(result);
