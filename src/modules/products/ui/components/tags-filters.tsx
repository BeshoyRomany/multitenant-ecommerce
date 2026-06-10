import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_PAGINATION_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
interface TagsFilterProps {
  value?: string[] | null;
  onChange: (value: string[] | null) => void;
}

export const TagsFilters = ({ value, onChange }: TagsFilterProps) => {
  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_PAGINATION_LIMIT,
        },
        {
          // Payload CMS returns `null` when there are no more pages.
          // However, React Query (TanStack) only stops fetching if this function returns `undefined`.
          // Using `?? undefined` converts Payload's `null` into `undefined` to safely trigger the brake,
          // preventing React Query from making an unnecessary extra request (e.g., trying to fetch an empty page).
          getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        },
      ),
    );

  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      //-> will effect getMany products through setFilters()
      onChange(value?.filter((t) => t !== tag) || []); // Remove the tag from the array if it's already included and return a new array without the tag.
    } else {
      //-> will effect getMany products through setFilters()
      onChange([...(value || []), tag]); // Add the tag to the array if it's not included, ensuring we don't mutate the original array, just update it with a new one that includes the new tag example [..."new arrival", "best seller", tag here = "new tag name 'best of 2026' "]
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex justify-center items-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages
          .flatMap((page) => page.docs) //one level flattening to get all tags from all pages
          .map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => onClick(tag.name)}
            >
              <p className="font-medium">{tag.name}</p>
              <Checkbox
                checked={value?.includes(tag.name)}
                onCheckedChange={() => onClick(tag.name)}
              />
            </div>
          ))
      )}
      {hasNextPage && (
        <button
          className="underline font-medium justify-start text-start disabled:opacity-50 cursor-pointer"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading more..." : "Load more"}
        </button>
      )}
    </div>
  );
};
