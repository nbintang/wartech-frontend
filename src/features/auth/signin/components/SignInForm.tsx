"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Cookies from "js-cookie";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type SignInForm, signInSchema } from "../schema/signInSchema";
import {jwtDecode} from "@/lib/utils";
import postSignin from "../../../../helpers/postSignin";
import catchAxiosErrorMessage from "@/helpers/catchAxiosError";
import { useProgress } from "@bprogress/next";
export default function SignInForm() {
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const loader = useProgress();
  const onSubmit = async (values: SignInForm) =>
    toast
      .promise(postSignin(values), {
        loading: "Signing in...",
        success: (accessToken) => {
          Cookies.set("accessToken", accessToken);
          const tokenInfo = jwtDecode(accessToken);
          const role = tokenInfo.role;
          loader.start();
          if (role === "ADMIN" || role === "REPORTER") {
            router.push(`/${role.toLowerCase()}/dashboard`);
          } else router.push("/");
          return "Signed in successfully";
        },
        error: (err) => {
          return catchAxiosErrorMessage(err) ?? "An unknown error occurred.";
        },
        finally: () => {
          loader.stop();
          form.reset();
        },
        richColors: true,
      })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <div className="flex items-center">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input
                  id="password"
                  placeholder="********"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {!form.formState.isSubmitting ? (
            "Sign in"
          ) : (
            <span className="flex items-center gap-2">
              Signing in
              <LoaderCircleIcon className="animate-spin" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
