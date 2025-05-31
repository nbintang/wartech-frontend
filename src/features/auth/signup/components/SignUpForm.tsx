"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { axiosInstance } from "@/lib/axiosInstance";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(6, { message: "Name must be at least 6 characters long." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(20, { message: "Password must be at most 32 characters long." }),
    confirmPassword: z.string(),
    acceptedTerms: z.boolean({ required_error: "You must accept the terms." }), // Remove the default value
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;
export default function SignUpForm() {
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
    },
  });
  const router = useRouter();
  async function onSubmit(values: SignUpForm) {
    try {
      //get confirmPassword
      const { confirmPassword, acceptedTerms, ...rest } = values;
      console.log(values);
      //   const response = await axiosInstance.post(`/auth/signup`, {
      //     ...rest,
      //     accepted_terms: acceptedTerms,
      //   });
      //   const successMessage = response.data.message;
      //   toast.success(successMessage);
      //   if (response.status === 201) router.push("/sign-in");
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        const errorServerMessage = error.response?.data.message;
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
          name="name"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormLabel htmlFor="password">Password</FormLabel>
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
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
        <FormField
          control={form.control}
          name="acceptedTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row-reverse items-center gap-x-4">
  <div >
                <FormLabel className="text-xs font-normal">
                Accept Terms and Conditions
              </FormLabel>
              <FormDescription className="text-xs text-muted-foreground">
                By signing up, you agree to our{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </a>
                .
              </FormDescription>
  </div>
              <FormControl>
                <Checkbox
                  id="acceptedTerms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
