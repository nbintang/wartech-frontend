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
  const router = useRouter();
  const setOpenDialog = useHandleDialog((state) => state.setOpenDialog);
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { mutate, isError, isPending, isSuccess } = useMutation({
    mutationFn: async (values: ResetPasswordSchemaType) =>
      await axiosInstance.post(`/auth/reset-password`, {
        token,
        password: values.newPassword,
      }),
    onMutate: () => {
      setOpenDialog("reset-password", true, {
        message: "Processing...",
        isLoading: true,
        isSuccess: false,
      });
    },
    onSuccess: (response) => {
      if (response.status === 201) {
        setOpenDialog("reset-password", true, {
          message: "Redirecting...",
          isSuccess: true,
          isLoading: false,
          redirect: true,
        });
        router.push("/auth/login");
      }
    },
    onError: (err) => {
      setOpenDialog("reset-password", true, {
        message: "Something went wrong",
        isError: true,
        isLoading: false,
      });
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
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
