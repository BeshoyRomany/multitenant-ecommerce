import { Category } from "@/payload-types";

// Omit the original complex subcategories from Category,
// then override it with undefined | null to prevent nested levels (depth > 1)
export type SubCategory = Omit<Category, "subcategories"> & {
  subcategories: undefined | null;
};
// ⚠️ WARNING: using (&) does NOT override fields — it merges them (intersection).
// If Category already has `subcategories`, using & without Omit will produce:
// subcategories: { docs?, hasNextPage?, totalDocs? } & SubCategory[]
// Solution: Omit the field first, then redefine it cleanly.
// Omit the original complex subcategories from Category,
// then override it with a flat SubCategory[] (no nesting, no Payload pagination wrapper)
export type CustomCategory = Omit<Category, "subcategories"> & {
  subcategories: SubCategory[];
};
export type CategoryItem = CustomCategory | SubCategory;
/*
Note: 
    if i did this->

    type SubCategory = Omit<Category, "subcategories"> & {
    subcategories: undefined | null;
    };

    //HERE: is the problem because it will merge the original subcategories:{ docs?, hasNextPage?, totalDocs? } & SubCategory[]
    
    export type CustomCategory = Category & {
    subcategories: SubCategory[];
    };

*/
