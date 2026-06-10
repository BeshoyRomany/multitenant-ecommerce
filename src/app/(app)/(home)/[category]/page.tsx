import type { SearchParams } from "nuqs/server";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { Suspense } from "react";
import { ProductFilters } from "@/modules/products/ui/components/product-filters";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductSort } from "@/modules/products/ui/components/product-sort";

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
      <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
          <p className="text-2xl font-medium">Curated for you</p>
          <ProductSort />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};

export default Page;
