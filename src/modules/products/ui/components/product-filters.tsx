"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";
import { PriceFilters } from "./price-filters";
import { useProductFilters } from "../../hooks/use-product-filters";
import { TagsFilters } from "./tags-filters";

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

  // const hasAnyFilter = Object.values(filters).some((value) => value !== "");
  const hasAnyFilter = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") return false; // when it loops and found "sort" -> return false
    if (Array.isArray(value)) {
      return value.length > 0; // tags array if it's length > 0 show clear button
    }

    if (typeof value === "string") {
      return value !== ""; // if the value is a string, check if it's not empty then return true, otherwise return false
    }
    return value !== null; // if the value is not a string, check if it's not null and it can be any other type then return true, otherwise return false
  });
  type filterTypes = string | string[] | null;
  const onChange = (key: keyof typeof filters, value: filterTypes) => {
    //-> will effect getMany products through setFilters()
    setFilters({ ...filters, [key]: value });
  };
  const onClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      tags: [],
    });
  };
  return (
    <div className="border rounded-md bg-white">
      <div className="p-4 border-b flex flex-items-center justify-between">
        <p className="font-medium">Filters</p>
        {hasAnyFilter && (
          <button
            className="underline cursor-pointer"
            onClick={() => onClear()}
            type="button"
          >
            Clear
          </button>
        )}
      </div>
      <ProductFilterItem title="Price">
        <PriceFilters
          minPrice={filters.minPrice} // drawing itself after change in the url query string which is handled by useProductFilters hook
          maxPrice={filters.maxPrice} // drawing itself after change in the url query string which is handled by useProductFilters hook
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilterItem>
      <ProductFilterItem title="Tags" className="border-b-0">
        <TagsFilters
          value={filters.tags} // the tags array queryParam state that came from the url
          onChange={(value) => onChange("tags", value)}
        />
      </ProductFilterItem>
    </div>
  );
};
