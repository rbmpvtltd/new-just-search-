import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
	host: process.env.PGHOST ?? "localhost",
	user: process.env.PGUSER ?? "postgres",
	password: process.env.PGPASSWORD ?? "12345678",
	database: process.env.PGDATABASE ?? "justsearch",
	port: Number(process.env.PGPORT) ?? 5432,
});

import * as not_related from "./schema/not-related.schema";
import * as auth from "./test/auth.schema";
import * as business from "./test/business.schema";
import * as hire from "./test/hire.schema";
import * as offer from "./test/offer.schema";
import * as plan from "./test/plan.schema";
import * as product from "./test/product.shema";
import * as user from "./test/user.schema";

export const schemas = {
	auth,
	business,
	hire,
	not_related,
	offer,
	plan,
	product,
	user,
};

export const db = drizzle({
	client: pool,
	schema: {
		...auth,
		...business,
		...hire,
		...not_related,
		...offer,
		...plan,
		...product,
		...user,
	},
});
