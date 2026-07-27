import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/library/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
interface Props {
  params: Promise<{ productId: string }>;
}

const Page = async ({ params }: Props) => {
  const { productId } = await params;

  prefetch(trpc.library.getOne.queryOptions({ productId }));
  prefetch(trpc.reviews.getOne.queryOptions({ productId }));
  return (
    <HydrateClient>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
