import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
interface Props {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}
export const formatAsCurrency = (value: string) => {
  const numericValue = value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except for the decimal point
  const parts = numericValue.split("."); // Split the numeric value into whole and decimal parts
  const formattedValue =
    parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2) : ""); // Reconstruct the numeric value
  if (!formattedValue) return "";
  const numberValue = parseFloat(formattedValue); // Convert the formatted value to a number
  if (isNaN(numberValue)) return ""; // Handle invalid number input
  return formatCurrency(numberValue);
};

export const PriceFilters = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) => {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except for the decimal point
    onMinPriceChange(numericValue);
  };
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except for the decimal point
    onMaxPriceChange(numericValue);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Minimum Price</Label>
        <Input
          type="text"
          placeholder="$0"
          value={minPrice ? formatAsCurrency(minPrice) : ""}
          onChange={handleMinPriceChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Maximum Price</Label>
        <Input
          type="text"
          placeholder="&infin;"
          value={maxPrice ? formatAsCurrency(maxPrice) : ""}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  );
};
/*
  1. User types in Input (e.g., 1500).
  2. onChange fires -> Handler cleans text and updates Parent State with raw value ("1500").
  3. Parent State updates -> React triggers a re-render.
  4. Input Value receives raw state -> formatAsCurrency("1500") applies mask instantly.
  5. UI displays formatted masked value ($1,500).
*/
