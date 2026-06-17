import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
// TODO: Add real ratings
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
  price,
}: ProductCardProps) => {
  const router = useRouter();
  const handleUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(generateTenantURL(tenantSlug)); //will return /tenants/[slug]
  };
  return (
    <Link href={`${generateTenantURL(tenantSlug)}/products/${id}`}>
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
          <div
            className="flex items-center gap-2 w-fit"
            onClick={handleUserClick}
          >
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
        <div className="p-4">
          <div className="relative px-2 py-1 border bg-pink-400 w-fit">
            <p className="text-sm font-medium">{formatCurrency(price)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => (
  <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse"></div>
);
