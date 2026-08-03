import {
  createLoader,
  parseAsString,
  parseAsArrayOf,
  parseAsStringLiteral,
} from "nuqs/server"; // gonna use it on the server to prefetch the data based on the filter on the server before sending the html to the client so the data will be ready
export const sortValues = ["curated", "trending", "hot_and_new"] as const;

const params = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  sort: parseAsStringLiteral(sortValues).withDefault("curated"),
  minPrice: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  maxPrice: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  tags: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
};

// Parses raw searchParams through the schema to sanitize, apply defaults, and return typed filter values on the server
export const loadProductFilters = createLoader(params);
