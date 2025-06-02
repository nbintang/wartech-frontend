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

const resendEmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});
type ResendEmailForm = z.infer<typeof resendEmailSchema>;
export default function ResendEmailForm({
  isVerifying,
  isSuccessVerifying: isSuccess,
}: {
  isVerifying?: boolean;
  isSuccessVerifying?: boolean;
}) {
  const router = useRouter();
  const { startTimer, timer, isTimerStarted } = useTimerCountDown();
  const [isSended, setIsSended] = useState<boolean>(false);
  const form = useForm<ResendEmailForm>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: ResendEmailForm) =>
    await toast
      .promise(axiosInstance.post("/auth/resend-verification", values), {
        loading: "Sending email...",
        success: (data) => {
          if (data.status === 201) {
            startTimer(60);
            setIsSended(true);
          }
          form.reset();
          return `Email sent successfully! ${data.data.message}`;
        },
        error: (err) => {
          if (err.response?.status === 401) {
            router.push("/auth/sign-up");
            return "Unauthorized, Please sign up first";
          }
          return catchAxiosErrorMessage(err);
        },
      })
      .unwrap();
  const isDisabled =
    form.formState.isSubmitting || isTimerStarted || isVerifying || isSuccess;

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
                  disabled={isDisabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.isSubmitSuccessful && isSended && (
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
