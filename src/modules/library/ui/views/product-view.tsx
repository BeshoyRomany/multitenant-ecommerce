"use client";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReviewSidebar } from "../components/review-sidebar";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Suspense } from "react";
import { ReviewFormSkeleton } from "../components/review-form";

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
              <Suspense fallback={<ReviewFormSkeleton />}>
                <ReviewSidebar productId={productId} />
              </Suspense>
            </div>
          </div>
          <div className="lg:col-span-5">
            {data.content ? (
              <RichText data={data.content} />
            ) : (
              <p className="font-medium italic text-muted-foreground">
                No special content
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Skeleton */}
      <nav className="p-4 bg-[#F4F4F0] w-full border-b">
        <div className="flex items-center gap-2">
          <ArrowLeftIcon className="size-5 text-slate-400" />
          <div className="h-5 w-32 bg-slate-200 animate-pulse rounded-md" />
        </div>
      </nav>

      {/* Header Title Skeleton */}
      <header className="bg-[#F4F4F0] py-8 border-b">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12">
          <div className="h-12 w-2/3 max-w-md bg-slate-200 animate-pulse rounded-md" />
        </div>
      </header>

      {/* Main Layout Skeleton */}
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-2">
            <div className="p-6 border bg-white rounded-md space-y-4">
              <div className="h-6 w-1/2 bg-slate-200 animate-pulse rounded-md" />
              <div className="h-24 w-full bg-slate-200 animate-pulse rounded-md" />
              <div className="h-10 w-full bg-slate-200 animate-pulse rounded-md" />
            </div>
          </div>

          {/* Main Content Area Skeleton */}
          <div className="lg:col-span-5 space-y-4">
            <div className="h-5 w-full bg-slate-200 animate-pulse rounded-md" />
            <div className="h-5 w-11/12 bg-slate-200 animate-pulse rounded-md" />
            <div className="h-5 w-4/5 bg-slate-200 animate-pulse rounded-md" />
            <div className="h-32 w-full bg-slate-100 border border-dashed rounded-md animate-pulse mt-6" />
          </div>
        </div>
      </section>
    </div>
  );
};
