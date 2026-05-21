import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    category: string;
  }>;
}
const Page = async ({ params }: Props) => {
  const { category } = await params;
  prefetch(trpc.products.getMany.queryOptions({ category: category }));
  return (
    <HydrateClient>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={category} />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
