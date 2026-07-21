"use client";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, LinkIcon, StarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { RichText } from "@payloadcms/richtext-lexical/react";
const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="flex-1 bg-pink-400">
        Add to cart
      </Button>
    ),
  },
);

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId }),
  );
  return (
    <div className="px-4  py-10 lg:px-12">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={data.cover?.url || "/no-product-image.jpg"}
            alt={data.name}
            title={data.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="lg:col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{data.name}</h1>
            </div>
            <div className="border-y flex">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="relative px-2 py-1 border bg-pink-400 w-fit">
                  <p className="text-base font-medium">
                    {formatCurrency(data.price)}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                <Link
                  href={generateTenantURL(tenantSlug)}
                  className="flex items-center gap-2"
                >
                  {data.tenant?.image?.url && (
                    <Image
                      src={data.tenant.image.url}
                      alt={data.tenant.name}
                      title={data.tenant.name}
                      width={20}
                      height={20}
                      className="rounded-full border shrink-0 size-5"
                    />
                  )}
                  <p className="text-base underline font-medium">
                    {data.tenant.name}
                  </p>
                </Link>
              </div>

              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex items-center gap-2">
                  <StarRating rating={data.reviewsRating} />
                  <p className="text-base font-medium">
                    ({data.reviewCount}) ratings
                  </p>
                </div>
              </div>
            </div>

            <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className="flex items-center gap-2">
                <StarRating rating={data.reviewsRating} />
                <p className="text-base font-medium">
                  ({data.reviewCount}) ratings
                </p>
              </div>
            </div>

            <div className="p-6">
              {data.description ? (
                <RichText data={data.description} />
              ) : (
                "No description provided."
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l w-full">
              <div className="flex flex-col gap-4 p-6 border-b">
                <div className="flex flex-row items-center gap-2">
                  <CartButton
                    tenantSlug={tenantSlug}
                    productId={productId}
                    isPurchased={data.isPurchased}
                  />

                  <Button
                    className="size-12"
                    variant="elevated"
                    onClick={() => {
                      setIsCopied(true);
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("URL copied to clipboard");

                      setTimeout(() => {
                        setIsCopied(false);
                      }, 1000);
                    }}
                    disabled={isCopied}
                  >
                    {isCopied ? <CheckIcon /> : <LinkIcon />}
                  </Button>
                </div>
                <p className="text-center font-medium">
                  {data.refundPolicy === "no-refunds"
                    ? "No refunds"
                    : `${data.refundPolicy} money back grantee`}
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>({data.reviewsRating})</p>
                    <p className="text-base">{data.reviewCount} ratings</p>
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <Fragment key={star}>
                      <div className="font-medium">
                        {star} {star === 1 ? "star" : "stars"}
                      </div>
                      {/* pass star for the object -> data.ratingDistribution[key] as a key
                       * to find the right index ratings for each iteration here
                       */}
                      <Progress
                        value={data.ratingDistribution[star]} // example 2/3 * 100 ( 2 ratings for 4 stars / 3 reviews)
                        className="h-lh"
                      />
                      <div className="font-medium">
                        {data.ratingDistribution[star]}%
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const ProductViewSkeleton = () => {
  return (
    <div className="px-4 py-10 lg:px-12">
      <div className="border rounded-sm bg-white overflow-hidden">
        {/* Shimmer effect for the cover image placeholder */}
        <div className="relative aspect-[3.9] border-b bg-slate-200 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="lg:col-span-4">
            {/* Title Skeleton */}
            <div className="p-6">
              <div className="h-10 w-2/3 bg-slate-200 animate-pulse rounded-md" />
            </div>

            {/* Price & Vendor Bar Skeleton */}
            <div className="border-y flex">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-md" />
              </div>

              <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                <div className="flex items-center gap-2">
                  <div className="size-5 rounded-full bg-slate-200 animate-pulse shrink-0 border" />
                  <div className="h-5 w-28 bg-slate-200 animate-pulse rounded-md" />
                </div>
              </div>

              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-24 bg-slate-200 animate-pulse rounded-md" />
                  <div className="h-5 w-20 bg-slate-200 animate-pulse rounded-md" />
                </div>
              </div>
            </div>

            {/* Mobile Star Rating Skeleton */}
            <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 bg-slate-200 animate-pulse rounded-md" />
                <div className="h-5 w-20 bg-slate-200 animate-pulse rounded-md" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-6 space-y-3">
              <div className="h-4 w-full bg-slate-200 animate-pulse rounded-md" />
              <div className="h-4 w-5/6 bg-slate-200 animate-pulse rounded-md" />
              <div className="h-4 w-4/6 bg-slate-200 animate-pulse rounded-md" />
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l w-full">
              {/* Cart Button & Refund Policy Skeleton */}
              <div className="flex flex-col gap-4 p-6 border-b">
                <div className="flex flex-row items-center gap-2">
                  <div className="h-10 flex-1 bg-slate-200 animate-pulse rounded-md border" />
                  <div className="size-12 bg-slate-200 animate-pulse rounded-md shrink-0 border" />
                </div>
                <div className="h-5 w-40 bg-slate-200 animate-pulse rounded-md mx-auto" />
              </div>

              {/* Ratings & Breakdown Skeleton */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-20 bg-slate-200 animate-pulse rounded-md" />
                  <div className="h-5 w-32 bg-slate-200 animate-pulse rounded-md" />
                </div>

                {/* Star Progress Bars Grid */}
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4 items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Fragment key={i}>
                      <div className="h-4 w-12 bg-slate-200 animate-pulse rounded-md" />

                      {/* Exact Progress Bar Style Container */}
                      <div className="relative w-full overflow-hidden rounded-full border bg-white h-lh">
                        <div className="h-full w-full bg-slate-200 animate-pulse" />
                      </div>

                      <div className="h-4 w-8 bg-slate-200 animate-pulse rounded-md" />
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
