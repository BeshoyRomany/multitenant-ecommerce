import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/products/ui/views/product-view";
import { Suspense } from "react";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}
const Page = async ({ params }: Props) => {
  //Get the product[id] that related to the current tenant[slug]
  const { productId, slug } = await params;
  prefetch(trpc.products.getOne.queryOptions({ id: productId }));
  return (
    <HydrateClient>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
