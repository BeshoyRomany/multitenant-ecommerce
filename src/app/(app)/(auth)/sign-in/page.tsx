import { SigninView } from "@/modules/auth/ui/views/sign-in-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const Page = async () => {
  //The caller get the data on the server only without send it to the client
  const session = await caller.auth.session();
  if (session.user) {
    redirect("/");
  }
  return <SigninView />;
};

export default Page;
