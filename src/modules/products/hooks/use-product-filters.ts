import {
  useQueryStates,
  parseAsString,
  parseAsArrayOf,
  parseAsStringLiteral,
} from "nuqs";
const sortValues = ["curated", "trending", "hot_and_new"] as const;
const params = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  sort: parseAsStringLiteral(sortValues).withDefault("curated"),
  minPrice: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  maxPrice: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  tags: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
};
export const useProductFilters = () => {
  return useQueryStates(params);
};
