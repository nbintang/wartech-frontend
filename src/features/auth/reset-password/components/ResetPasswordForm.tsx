import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useHandleDialog } from "@/hooks/useHandleDialog";
import usePostVerifyAuth from "@/hooks/usePostVerifyAuth";
import { axiosInstance } from "@/lib/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    token: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
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
  const { mutate, isError, isPending, isSuccess } = usePostVerifyAuth({
    endpoint: "/reset-password",
    formSchema: ResetPasswordSchema.transform((data) => data),
    startTime: true,
    second: 60,
    redirect: true,
    redirectUrl: "/auth/sign-in",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          mutate({
            password: values.newPassword,
            token,
          })
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
            </FormItem>
          )}
        />

        {isError && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            Something went wrong
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
