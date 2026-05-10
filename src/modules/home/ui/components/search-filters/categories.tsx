"use client";
import { CategoryDropdown } from "./category-dropdown";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoriesSidebar } from "./categories-sidebar";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useParams } from "next/navigation";

interface Props {
  data: CategoriesGetManyOutput;
}
export const Categories = ({ data }: Props) => {
  const params = useParams();

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(0);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  //get the active category index to see where is located in viewAll tab or not (one of the visible categories)
  const activeCategoryIndex = data.findIndex(
    (cat) => cat.slug === activeCategory,
  );
  /*
  check if the active category one of the invisible categories by seeing if the index >= the visibleCount & should be exist
  because depend on it we will add styles for (view all button)
  */

  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex != -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;
      //get the container div width (that will hold the visible only categories)
      const containerWidth = containerRef.current.offsetWidth;
      //get view all button width
      const viewAllWidth = viewAllRef.current.offsetWidth;
      //get the available width for the container without the viewAll button & we don't want this button to be ever hidden
      const availableWidth = containerWidth - viewAllWidth;

      //get how many children item inside measure div (which the div holding all the button)
      const items = Array.from(measureRef.current.children);

      //This is will be the total width of the visible items
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        //check if (totalWidth) of all visible items + the the current iteration (item) width not exceeding the (available width)
        const width = item.getBoundingClientRect().width;

        //if it exceed -> break the function
        if (totalWidth + width > availableWidth) break;
        //if it's not exceed -> add the item width to + totalWidth
        totalWidth += width;
        //Increase the visible items (buttons)
        visible++;
      }
      setVisibleCount(visible);
    };

    //Run on mount
    calculateVisible();

    //Window resize observer to change the values and recalculate
    const resizerObserver = new ResizeObserver(calculateVisible);
    if (containerRef.current) {
      resizerObserver.observe(containerRef.current);
    }
    return () => resizerObserver.disconnect();
  }, [data.length]);

  return (
    <div className="relative w-full">
      {/* Categories sidebar */}
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      {/* Hidden dev to Measure all items */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {data.map((category: CategoriesGetManyOutput[number]) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}
      </div>
      {/* End: Hidden dev to Measure all items */}

      {/* Visible items */}
      <div
        ref={containerRef}
        className="flex items-center flex-nowrap"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data
          .slice(0, visibleCount)
          .map((category: CategoriesGetManyOutput[number]) => (
            <div key={category.id}>
              <CategoryDropdown
                category={category}
                isActive={activeCategory === category.slug}
                isNavigationHovered={isAnyHovered}
              />
            </div>
          ))}
        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant="elevated"
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
              isActiveCategoryHidden &&
                // Highlight "View All" only when:
                // 1. the active category is hidden inside "View All"
                // 2. the user is not hovering anything (to avoid confusion with hover state)
                !isAnyHovered &&
                "bg-white border-primary",
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View All <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
      {/*End: Visible items */}
    </div>
  );
};
