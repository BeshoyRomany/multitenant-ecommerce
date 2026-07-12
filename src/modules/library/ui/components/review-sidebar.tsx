import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReviewForm } from "./review-form";

interface Props {
  productId: string;
}

export const ReviewSidebar = ({ productId }: Props) => {
  //To review an order we have to make sure that it's exist in the Library (user bought it)
  const trpc = useTRPC();
  //Go get review from the reviews collection
  const { data } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({ productId }),
  );

  return <ReviewForm productId={productId} initialData={data} />;
};
