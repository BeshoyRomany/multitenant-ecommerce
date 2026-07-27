import { DEFAULT_PAGINATION_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
export const dynamic = "force-dynamic";
interface Props {
  params: Promise<{
    category: string;
  }>; // The categories -> Education, Business & money etc...
  searchParams: Promise<SearchParams>; // The query parameters -> price & tags etc...
}
const Page = async ({ params, searchParams }: Props) => {
  const filters = await loadProductFilters(searchParams);
  const { category } = await params;
  prefetch(
    trpc.products.getMany.infiniteQueryOptions({
      category: category,
      ...filters,
      limit: DEFAULT_PAGINATION_LIMIT,
    }),
  );
  return (
    <HydrateClient>
      <ProductListView category={category} />
    </HydrateClient>
  );
};

export default Page;
