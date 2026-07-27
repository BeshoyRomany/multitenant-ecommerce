import { DEFAULT_PAGINATION_LIMIT } from "@/constants";
import { LibraryView } from "@/modules/library/ui/views/library-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
export const dynamic = "force-dynamic";
const Page = () => {
  prefetch(
    trpc.library.getMany.infiniteQueryOptions({
      limit: DEFAULT_PAGINATION_LIMIT,
    }),
  );

  return (
    <HydrateClient>
      <LibraryView />
    </HydrateClient>
  );
};

export default Page;
