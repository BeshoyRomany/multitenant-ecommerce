"use client";

import { TriangleAlert } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="px-4  py-10 lg:px-12">
      <div className="border border-black flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <TriangleAlert />
        <p className="text-base font-medium">Something went wrong!</p>
      </div>
    </div>
  );
};

export default ErrorPage;
