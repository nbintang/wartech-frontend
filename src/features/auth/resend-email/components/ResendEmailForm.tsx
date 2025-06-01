import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/lib/axiosInstance";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { catchAxiosError } from "@/helpers/catchAxiosError";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import useTimerCountDown from "@/hooks/useTimerCountDown";
import { cn } from "@/lib/utils";

const resendPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});
type ResendPasswordForm = z.infer<typeof resendPasswordSchema>;
export default function ResendEmailForm({
  isVerifying,
  isSuccess,
}: {
  isVerifying?: boolean;
  isSuccess?: boolean;
}) {
  const form = useForm<ResendPasswordForm>({
    resolver: zodResolver(resendPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const { startTimer, timer, isTimerStarted } = useTimerCountDown();

  const onSubmit = async (values: ResendPasswordForm) => {
    toast.promise(axiosInstance.post("/auth/resend-verification", values), {
      loading: "Sending email...",
      success: (data) => {
        return `Email sent successfully! ${data.data.message}`;
      },
      error: (err) => catchAxiosError(err),
    });
    startTimer(60);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex justify-between items-center">
                <FormLabel htmlFor="email">Email address</FormLabel>
                <span className="text-xs text-muted-foreground">
                  {isTimerStarted && `Resend in ${timer} seconds`}
                </span>
              </div>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  disabled={
                    form.formState.isSubmitting || isTimerStarted || isVerifying
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.isSubmitSuccessful && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
            A verification email has been sent to your email address.
          </div>
        )}

        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={
            form.formState.isSubmitting ||
            isTimerStarted ||
            isVerifying ||
            isSuccess
          }
        >
          {isTimerStarted ? (
            <>
              <Loader2
                className={cn(
                  "mr-2 h-4 w-4 ",
                  isTimerStarted && "animate-spin"
                )}
              />
              Sending...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend verification email
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
