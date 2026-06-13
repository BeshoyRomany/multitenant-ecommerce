import { DEFAULT_PAGINATION_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SearchParams } from "nuqs/server";

interface Props {
  params: Promise<{
    subcategory: string; // This should be subcategory instead of category, as we are in the [subcategory] page
  }>;
  searchParams: Promise<SearchParams>;
}
const Page = async ({ params, searchParams }: Props) => {
  const filters = await loadProductFilters(searchParams);
  const { subcategory } = await params;
  prefetch(
    trpc.products.getMany.infiniteQueryOptions({
      category: subcategory,
      ...filters,
      limit: DEFAULT_PAGINATION_LIMIT,
    }),
  );
  return (
    <HydrateClient>
      <ProductListView category={subcategory} />
    </HydrateClient>
  );
};

export default Page;
