import { liteClient as algoliasearch } from "algoliasearch/lite";
import { algoliaAppId, algoliaSearchApiKey } from "@/constants/Variable";
export const searchClient = algoliasearch(algoliaAppId, algoliaSearchApiKey);
