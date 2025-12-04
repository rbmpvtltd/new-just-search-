// packages/algolia/src/serverClient.ts
import { liteClient as algoliasearch } from "algoliasearch/lite";

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
);

export { algoliaClient };
// const record = { objectID: "object-1", name: "test record" };

// Add record to an index

// // Search for "test"
// const { results } = await client.search({
//   requests: [
//     {
//       indexName,
//       query: "test",
//     },
//   ],
// });

// console.log(JSON.stringify(results));
