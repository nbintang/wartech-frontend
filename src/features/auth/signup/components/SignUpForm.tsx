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
import { type SignUpForm, signUpSchema } from "../schema/signUpSchema";
import DialogLayout from "@/components/DialogLayout";
import { useHandleDialog } from "@/hooks/useHandleDialog";

export default function SignUpForm() {
  const onOpenChange = useHandleDialog((state) => state.onOpenChange);
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
    },
  });
  const router = useRouter();
  async function onSubmit(values: SignUpForm) {
    onOpenChange("signup", true, {
      message: "Processing...",
      isLoading: true,
    });

    try {
      console.log(values);
      const {
        lastName,
        firstName,
        email,
        password,
        acceptedTerms: accepted_terms,
      } = values;
      const name = `${firstName} ${lastName}`;

      const response = await axiosInstance.post(`/auth/signup`, {
        name,
        email,
        password,
        accepted_terms,
      });
      if (response.status === 200) {
        const successMessage = response.data.message;
        onOpenChange("signup", true, {
          message: successMessage,
          isLoading: false,
        });
      } else {
        const errorMessage = response.data.message;
        onOpenChange("signup", true, {
          message: errorMessage,
          isLoading: false,
        });
      }
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="grid ">
                <FormLabel htmlFor="firstName">Full Name</FormLabel>
                <FormDescription>Please enter your full name</FormDescription>
                <FormControl>
                  <Input
                    id="firstName"
                    placeholder="Enter your First Name"
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
            name="lastName"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <Input
                    id="lastName"
                    placeholder="Enter your Last Name"
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
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">
                    Accept terms and conditions
                  </FormLabel>
                  <FormDescription className="text-xs">
                    By signing up, you agree to our terms and conditions.
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </div>
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
    </>
  );
}
