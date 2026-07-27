import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string; //product always has a slug in it's data{slug:string}
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
  price: number;
}

export const ProductCard = ({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewCount,
  reviewRating,
}: ProductCardProps) => {
  return (
    <Link prefetch href={`/library/${id}`}>
      <div className="border rounded-md bg-white overflow-hidden h-full flex flex-col hover:shadow-[4px_4px_0px_0px_rgb(0,0,0,1)] transition-shadow">
        <div className="relative aspect-square">
          <Image
            alt={name}
            fill
            className="object-cover"
            src={imageUrl || "/no-product-image.jpg"}
          />
        </div>
        <div className="p-4 border-y flex flex-col gap-3 flex-1">
          <h2 className="text-md font-medium line-clamp-2" title={name}>
            {name}
          </h2>
          <div className="flex items-center gap-2 w-fit">
            {tenantImageUrl && (
              <Image
                alt={tenantSlug}
                src={tenantImageUrl}
                width={16}
                height={16}
                className="rounded-full border shrink-0 size-4"
              />
            )}
            <p className="text-sm underline font-medium">{tenantSlug}</p>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-black" />
              <p className="text-sm font-medium">
                {reviewRating} ({reviewCount})
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="border rounded-md bg-white overflow-hidden h-full flex flex-col">
      {/* 1. Square Image Skeleton */}
      <div className="relative aspect-square bg-slate-200 animate-pulse border-b" />

      {/* 2. Content Skeleton matching p-4 border-y flex flex-col gap-3 flex-1 */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title Lines */}
        <div className="space-y-1.5">
          <div className="h-4 w-5/6 bg-slate-200 animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded" />
        </div>

        {/* Tenant Avatar & Slug Placeholder */}
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-slate-200 animate-pulse shrink-0" />
          <div className="h-3.5 w-20 bg-slate-200 animate-pulse rounded" />
        </div>

        {/* Star Rating Placeholder using exact size-3.5 StarIcon */}
        <div className="flex items-center gap-1 mt-auto pt-1">
          <StarIcon className="size-3.5 text-slate-300 fill-slate-300 animate-pulse" />
          <div className="h-3.5 w-12 bg-slate-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
};
