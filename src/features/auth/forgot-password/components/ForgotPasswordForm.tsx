"use client";
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
import { useHandleDialog } from "@/hooks/useHandleDialog";
import useTimerCountDown from "@/hooks/useTimerCountDown";
import { axiosInstance } from "@/lib/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { set, z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});
type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export default function ForgotPasswordForm() {
  const router = useRouter();
  const { startTimer, timer, isTimerStarted } = useTimerCountDown();
  const setOpenDialog = useHandleDialog((state) => state.setOpenDialog);
  const form = useForm<ForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async ({ email }: ForgotPassword) =>
      await axiosInstance.post("/auth/forgot-password", { email }),
    onMutate: () => {
      toast.loading("Sending email...", { id: "forgot-password" });
      setOpenDialog("forgot-password", true, {
        message: "Processing...",
        isLoading: true,
        isSuccess: false,
      });
    },
    onSuccess: (response) => {
      if (response.status === 201) {
        toast.success("Email sent successfully!", {
          id: "forgot-password",
          duration: 2000,
        });
        setOpenDialog("forgot-password", true, {
          message: "Success, please check your email",
          isSuccess: true,
          isLoading: false,
          redirect: true,
        });
      }
      form.reset();
    },
    onError: (err) => {
      setOpenDialog("forgot-password", true, {
        message: "Something went wrong",
        isError: true,
        isLoading: false,
      });
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message, { id: "forgot-password" });
      }
    },
    onSettled: () => {
      startTimer(60);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="flex w-full md:w-auto gap-2 space-y-4 flex-col"
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
                  placeholder="Your email address"
                  className="bg-white"
                  disabled={isPending || isTimerStarted || isSuccess}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isSuccess && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Your password reset link has been sent to your email, please check.
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || isTimerStarted || isSuccess}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset instructions"
          )}
        </Button>
      </form>
    </Form>
  );
}
