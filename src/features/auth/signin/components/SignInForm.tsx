"use client";

import { z } from "zod";
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
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { axiosInstance } from "@/lib/axiosInstance";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

type SignInForm = z.infer<typeof signInSchema>;
export default function SignInForm() {
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  async function onSubmit(values: SignInForm) {
    try {
      const response = await axiosInstance.post(`/auth/signin`, values);
      const accessToken = response.data.data.accessToken;
      Cookies.set("accessToken", accessToken);
      const tokenInfo: any = jwtDecode(accessToken);
      const role = tokenInfo.role.toLowerCase();
      if (role === "admin" || role === "reporter") {
        router.push(`/${role}/dashboard`);
      } else {
        router.push("/");
      }
      if (response.status === 200) toast.success("Login successful!");
    } catch (error) {
      console.log(error)
      if(isAxiosError(error)) {
        const errorServerMessage = error.response?.data.message
        toast.error(errorServerMessage);
        console.log(errorServerMessage);
      }
    }
  }

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
                  href="/forgot-password"
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
