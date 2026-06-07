"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";
import { PriceFilters } from "./price-filters";
import { useProductFilters } from "../../hooks/use-product-filters";

interface Props {
  title: string;
  className?: string;
  children?: React.ReactNode;
}
export const ProductFilterItem = ({ title, className, children }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon; // const start with capital letter to be used as a component
  return (
    <div className={cn("border-b p-4 flex flex-col gap-2", className)}>
      <div
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center justify-between cursor-pointer"
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5" />
      </div>
      {isOpen && children}
    </div>
  );
};
export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters();
  const onChange = (key: keyof typeof filters) => (value: string) => {
    setFilters({ ...filters, [key]: value });
  };
  return (
    <div className="border rounded-md bg-white">
      <div className="p-4 border-b flex flex-items-center justify-between">
        <p className="font-medium">Filters</p>
        <button
          className="underline cursor-pointer"
          onClick={() => {}}
          type="button"
        >
          Clear
        </button>
      </div>
      <ProductFilterItem title="Price" className="border-b-0">
        <PriceFilters
          minPrice={filters.minPrice} // drawing itself after change in the url query string which is handled by useProductFilters hook
          maxPrice={filters.maxPrice} // drawing itself after change in the url query string which is handled by useProductFilters hook
          onMinPriceChange={onChange("minPrice")}
          onMaxPriceChange={onChange("maxPrice")}
        />
      </ProductFilterItem>
    </div>
  );
};
