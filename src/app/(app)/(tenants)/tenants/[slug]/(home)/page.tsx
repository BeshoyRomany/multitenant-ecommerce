import type { SearchParams } from "nuqs/server";
import { DEFAULT_PAGINATION_LIMIT } from "@/constants";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { loadProductFilters } from "@/modules/products/search-params";
export const dynamic = "force-dynamic";
interface Props {
  searchParams: Promise<SearchParams>; // The query parameters -> price & tags etc...
  params: Promise<{ slug: string }>; // The categories -> Education, Business & money etc...
}
const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);
  prefetch(
    trpc.products.getMany.infiniteQueryOptions({
      tenantSlug: slug,
      ...filters,
      limit: DEFAULT_PAGINATION_LIMIT,
    }),
  );
  return (
    <HydrateClient>
      <ProductListView tenantSlug={slug} narrowView={true} />
    </HydrateClient>
  );
};

export default Page;
