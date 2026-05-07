"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Poppins } from "next/font/google";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { registerSchema } from "../../schemas";
import { RouterInput } from "@/trpc/routers/_app";
//Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

type RegisterInput = RouterInput["auth"]["register"];

const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

export const SignupView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: () => {
        toast.success("User tenant created successfully");
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  const form = useForm<RegisterInput>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = (values: RegisterInput) => {
    register.mutate(values);
    console.log(values);
  };
  const username = form.watch("username");
  const usernameErrors = form.formState.errors.username;
  const showPreview = username && !usernameErrors;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <ScrollArea className="h-screen w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 p-4 lg:py-12 lg:px-16"
            >
              <div className="flex items-center justify-between mb-8">
                <Link href="/">
                  <span
                    className={cn("text-2xl font-semibold", poppins.className)}
                  >
                    funroad
                  </span>
                </Link>
                <Button
                  asChild
                  variant={"ghost"}
                  size="sm"
                  className="text-base border-none underline"
                >
                  <Link prefetch href="/sign-in">
                    Sign in
                  </Link>
                </Button>
              </div>
              <h1 className="text-4xl font-medium">
                Join over 2,000 creators earning money on Funroad.
              </h1>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription
                      className={cn("hidden", showPreview && "block")}
                    >
                      Your store will be available at&nbsp;
                      {/* TODO: Use a proper method to generate url */}
                      <strong>{username}</strong>.funroad.com
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="elevated"
                size="lg"
                className="bg-black text-white hover:bg-pink-400 hover:text-primary"
                disabled={register.isPending}
              >
                Create Account
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </div>
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};
