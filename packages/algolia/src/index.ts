// packages/algolia/src/serverClient.ts
import { liteClient as algoliasearch } from "algoliasearch/lite";
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log(process.env.ALGOLIA_APP_ID)
export const serverAlgolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);
