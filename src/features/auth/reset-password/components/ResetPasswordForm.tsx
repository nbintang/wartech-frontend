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
import catchAxiosError from "@/helpers/catchAxiosError";
import usePostVerifyAuth from "@/hooks/usePostVerifyAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ResetPasswordAPISchema,
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "../schema/resetPasswordSchema";

export default function ResetPasswordForm({
  token,
  isTokenMissing,
}: {
  token: string;
  isTokenMissing: boolean;
}) {
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { mutate, isError, isPending, isSuccess, error } = usePostVerifyAuth({
    endpoint: "/reset-password",
    params: { token },
    formSchema: ResetPasswordAPISchema,
    redirect: true,
    redirectUrl: "/auth/sign-in",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          ({ newPassword }) => (mutate({ newPassword }), form.reset())
        )}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="password">New Password</FormLabel>
              <FormControl>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  disabled={isSuccess || isPending || isTokenMissing}
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
            <FormItem className="space-y-2">
              <FormLabel htmlFor="Confirm your password">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  disabled={isSuccess || isPending || isTokenMissing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isError && (
          <div className="flex items-center gap-x-2 bg-red-50 p-3 rounded-md">
            <AlertTriangleIcon className="text-red-600" />
            <div className="text-sm text-red-600  ">
              {catchAxiosError(error) || "Something went wrong"}
            </div>
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isSuccess || isPending || isTokenMissing}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </Form>
  );
}
