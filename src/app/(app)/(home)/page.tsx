import { DEFAULT_PAGINATION_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}
const Page = async ({ searchParams }: Props) => {
  const filters = await loadProductFilters(searchParams);
  prefetch(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit: DEFAULT_PAGINATION_LIMIT,
    }),
  );
  return (
    <HydrateClient>
      <ProductListView />
    </HydrateClient>
  );
};

export default Page;
