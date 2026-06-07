import { parseAsString, useQueryStates } from "nuqs";

export const useProductFilters = () => {
  return useQueryStates({
    minPrice: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
    maxPrice: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
  });
};
