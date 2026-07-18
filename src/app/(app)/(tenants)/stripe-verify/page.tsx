"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";

const Page = () => {
  //1. import the hook
  const trpc = useTRPC();
  //2. use react query mixed with trpc to mutate
  const { mutate: verify } = useMutation(
    trpc.checkout.verify.mutationOptions({
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        //if unauthorized user it will redirect him to the root page because this is protectedProcedure
        window.location.href = "/";
      },
    }),
  );

  //#region WHY useEffect HERE?
  // 1. AUTO-TRIGGER: Runs the verification automatically as soon as the user lands on the page (no button click needed).
  // 2. NO INFINITE LOOP: The `verify` function (from useMutation) has a stable reference (Memoized).
  // It won't change between renders, so this effect runs EXACTLY ONCE when the component mounts.
  //#endregion

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  );
};

export default Page;
