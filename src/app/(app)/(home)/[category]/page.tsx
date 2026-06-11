import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";

interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}
const Page = async ({ params, searchParams }: Props) => {
  const filters = await loadProductFilters(searchParams);
  const { category } = await params;
  prefetch(
    trpc.products.getMany.queryOptions({ category: category, ...filters }),
  );
  return (
    <HydrateClient>
      <ProductListView category={category} />
    </HydrateClient>
  );
};

export default Page;
