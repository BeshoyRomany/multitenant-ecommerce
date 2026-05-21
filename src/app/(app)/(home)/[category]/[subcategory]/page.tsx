import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    subcategory: string; // This should be subcategory instead of category, as we are in the [subcategory] page
  }>;
}
const Page = async ({ params }: Props) => {
  const { subcategory } = await params;
  prefetch(trpc.products.getMany.queryOptions({ category: subcategory }));
  return (
    <HydrateClient>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={subcategory} />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
