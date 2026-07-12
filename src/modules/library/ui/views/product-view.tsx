"use client";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReviewSidebar } from "../components/review-sidebar";

interface Props {
  productId: string;
}
export const ProductView = ({ productId }: Props) => {
  const trpc = useTRPC();
  //useSuspenseQuery grantee that the data is exist and ready -> use (<Suspense>) if we need part of the page to load only
  //useQuery self independent loading -> it doesn't let use wait for the whole page (isLoading)
  const { data } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId,
    }),
  );
  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4  bg-[#F4F4F0] full-w border-b">
        <Link prefetch href={"/library"} className="flex items-center gap-2">
          <ArrowLeftIcon />
          <span className="text font-medium">Back to library</span>
        </Link>
      </nav>
      <header className="bg-[#F4F4F0] py-8 border-b">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12">
          <h1 className="text-[40px] font-medium">{data.name}</h1>
        </div>
      </header>
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="p-4 border bg-white rounded-md gap-4">
              <ReviewSidebar productId={productId} />
            </div>
          </div>
          <div className="lg:col-span-5">
            <p className="font-medium italic text-muted-foreground">
              No special content
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
