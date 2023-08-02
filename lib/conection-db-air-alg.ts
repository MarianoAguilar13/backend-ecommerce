import Airtable from "airtable";
import algoliasearch from "algoliasearch";

export let baseAirtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base("appy80saWEF0ooYoM");

const client = algoliasearch(
  process.env.ALGOLIA_API_KEY,
  process.env.ALGOLIA_APP_ID
);
export const productIndex = client.initIndex("products");
