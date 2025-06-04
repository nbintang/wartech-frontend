"use client";

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
import { LoaderCircleIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import useSignUp from "../hooks/useSignup";
import Link from "next/link";

export default function SignUpForm() {
  const { form, signupMutation } = useSignUp();
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            signupMutation.mutate(values)
            
          )}
          className="grid gap-6"
        >
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
            name="acceptedTOS"
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
                    <Link className="text-[10px] text-blue-300 underline hover:text-blue-500" href="/auth/terms-and-conditions"> See the terms and conditions here</Link>
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
