import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import { TrashIcon } from "lucide-react";
interface CheckoutItemProps {
  name: string;
  price: number;
  imageUrl?: string | null;
  productUrl: string;
  tenantName: string;
  tenantUrl: string;
  isLast?: boolean;
  onRemove: () => void;
}

export const CheckoutItem = ({
  name,
  price,
  imageUrl,
  productUrl,
  tenantName,
  tenantUrl,
  isLast,
  onRemove,
}: CheckoutItemProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4 border-b",
        isLast && "border-b-0",
      )}
    >
      <div className="overflow-hidden border-r">
        <div className="relative aspect-square h-full">
          <Image
            src={imageUrl || "/no-product-image.jpg"}
            alt={name}
            title={name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between">
        <div>
          <Link href={productUrl}>
            <h4 className="font-bold underline">{name}</h4>
          </Link>
          <Link href={tenantUrl}>
            <p className="font-medium underline">{tenantName}</p>
          </Link>
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between">
        <p className="font-medium">{formatCurrency(price)}</p>
        <button
          className="underline font-medium cursor-pointer"
          onClick={onRemove}
          type="button"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
