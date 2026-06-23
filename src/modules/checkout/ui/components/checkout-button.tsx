import { Button } from "@/components/ui/button";
import { cn, generateTenantURL } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useSyncCart } from "../../hooks/use-sync-cart";
interface CheckoutButtonProps {
  className?: string;
  hideIfEmpty?: boolean;
  tenantSlug: string;
}

export const CheckoutButton = ({
  className,
  hideIfEmpty, // You can show the icon even if the cart items === 0
  tenantSlug,
}: CheckoutButtonProps) => {
  const { totalItems } = useSyncCart(tenantSlug); // sync with db
  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Button variant="elevated" asChild className={cn("bg-white", className)}>
      <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
        <ShoppingCartIcon /> {totalItems > 0 ? totalItems : ""}
      </Link>
    </Button>
  );
};
