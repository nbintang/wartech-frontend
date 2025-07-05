import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import usePostVerifyAuth from "@/hooks/hooks-api/usePostVerifyAuth";
import catchAxiosErrorMessage from "@/helpers/catchAxiosError";
import { useEffect, useState } from "react";

const resendEmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});
type ResendEmailForm = z.infer<typeof resendEmailSchema>;
export default function ResendEmailForm({
  isVerified,
  isVerifying,
  isSuccessVerifying,
  isTokenMissing,
}: {
  isVerified?: boolean,
  isVerifying?: boolean;
  isSuccessVerifying?: boolean;
  isTokenMissing: boolean;
}) {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const form = useForm<ResendEmailForm>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutate, isSuccess, isError, isTimerStarted, timer, error } =
    usePostVerifyAuth({
      endpoint: "/resend-verification",
      formSchema: resendEmailSchema,
      startTime: true,
      second: 60,
    });

  const isDisabled = isTimerStarted || isVerifying || isSuccessVerifying || isVerified 
  useEffect(() => {
    if ((form.formState.isSubmitSuccessful && isSuccess) || isError) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [form.formState.isSubmitSuccessful]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values) => (mutate(values), isSuccess && form.reset())
        )}
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
                  placeholder="john@example.com"
                  disabled={isDisabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showSuccess && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
            A verification email has been sent to your email address.
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-x-2 bg-red-50 p-3 rounded-md">
            <AlertTriangleIcon className="text-red-600" />
            <div className="text-sm text-red-600  ">
              {catchAxiosErrorMessage(error) || "Something went wrong"}
            </div>
          </div>
        )}
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={isDisabled || !form.formState.isDirty}
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
