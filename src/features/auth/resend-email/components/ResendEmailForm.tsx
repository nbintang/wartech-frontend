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
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import useTimerCountDown from "@/hooks/useTimerCountDown";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import catchAxiosErrorMessage from "@/helpers/catchAxiosError";
import { useMutation } from "@tanstack/react-query";
import { useHandleDialog } from "@/hooks/useHandleDialog";
import usePostVerifyAuth from "@/hooks/usePostVerifyAuth";

const resendEmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});
type ResendEmailForm = z.infer<typeof resendEmailSchema>;
export default function ResendEmailForm({
  isVerifying,
  isSuccessVerifying,
}: {
  isVerifying?: boolean;
  isSuccessVerifying?: boolean;
}) {
  const router = useRouter();
  const { startTimer, timer, isTimerStarted } = useTimerCountDown();
  const setOpenDialog = useHandleDialog((state) => state.setOpenDialog);
  const form = useForm<ResendEmailForm>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutate, isSuccess, isError } = usePostVerifyAuth({
    endpoint: "/resend-verification",
    formSchema: resendEmailSchema,
    startTime: true,
    second: 60,
  });

  const isDisabled =
    isSuccess || isTimerStarted || isVerifying || isSuccessVerifying;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-4"
      >
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
                  disabled={isDisabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.isSubmitSuccessful && isSuccess && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
            A verification email has been sent to your email address.
          </div>
        )}

        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={isDisabled}
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
