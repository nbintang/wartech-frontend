"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useHandleDialog } from "@/hooks/useHandleDialog";
import { axiosInstance } from "@/lib/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { set, z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});
type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export default function ForgotPasswordForm() {
  const onOpenChange = useHandleDialog((state) => state.onOpenChange);
  const form = useForm<ForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPassword) {
    try {
      const response = await axiosInstance.post(
        "/auth/forgot-password",
        values
      );
      if (response.status === 200) {
        const message = response.data.message;
        onOpenChange("forgot-password", true, {
          message: message,
          isLoading: false,
        });
      } else {
        const message = response.data.message;
        toast.error(message);
        onOpenChange("forgot-password", true, {
          message: message,
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full md:w-auto gap-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <Input
              placeholder="Your email address"
              className="bg-white"
              {...field}
            />
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
