import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { CategoryItem, CustomCategory, SubCategory } from "../types";
import { useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCategory[]; //TODO: remove this later
}
export const CategoriesSidebar = ({ open, onOpenChange, data }: Props) => {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | SubCategory[] | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null);

  //If we have parent categories, show those, otherwise show root categories
  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: CategoryItem) => {
    if (category.subcategories && category.subcategories.length > 0) {
      //it means that the current category is a parent with a subcategory
      setParentCategories(category.subcategories);
      //set the current selected category
      setSelectedCategory(category);
    } else {
      //this is a leaf category in a subCategory in subCategories menu
      if (parentCategories && selectedCategory) {
        //this is subCategory - navigate to /category/subcategory

        //{selectedCategory.slug} here saved in state from the (parent click)
        //{category.slug} came from (category: CategoryItem) the child click
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        //this is a main category - navigate to /category
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
        handleOpenChange(false);
      }
    }
  };

  const backgroundColor = selectedCategory?.color || "white";

  const handleBack = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="transition-none"
        style={{ backgroundColor: backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={() => handleBack()}
              className="w-full text-left  p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((category: CategoryItem) => (
            <button
              className="w-full text-left  p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer"
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
