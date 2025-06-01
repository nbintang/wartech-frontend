"use client";
import { axiosInstance } from "@/lib/axiosInstance";
import { BotIcon, LoaderCircleIcon, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import ResendEmailForm from "@/features/auth/resend-email/components/ResendEmailForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const getVerifyUser = async (token: string) => {
  const response = await axiosInstance.post(`/auth/verify`, undefined, {
    params: {
      token,
    },
  });
  return response.data.data.accessToken;
};
export default function VerifyUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { isSuccess, isError, data, error, isFetching } = useQuery({
    queryKey: ["verify"],
    queryFn: async () => await getVerifyUser(token!),
    enabled: !!token,
    retry: false,
  });
  useEffect(() => {
    if (isSuccess && data) {
      Cookies.set("accessToken", data);
      toast.success("Account verified successfully", {
        richColors: true,
      });
      router.push("/");
    }
  }, [isSuccess, data, router]);
  useEffect(() => {
    if (isError && isAxiosError(error)) {
      if (
        error.status === 404 ||
        error.status === 401 ||
        error.status === 429
      ) {
        toast.error("Account verification failed");
      } else {
        toast.error("Something went wrong, please try again");
      }
    }
  }, [isError, error]);

  return (
    <Card className="relative">
      <CardHeader className="space-y-1">
        <a
          href="#"
          className="flex items-center gap-2 font-medium  text-xs top-4 left-4"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <BotIcon className="size-4" />
          </div>
          Warta Technologies
        </a>
        <CardTitle className="text-2xl font-bold text-center">
          Verify your email
        </CardTitle>
        <CardDescription className="text-center">
          We've sent a verification link to your email address. Please check
          your inbox and click the link to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {
                "Didn't receive the email? Check your spam folder or request a new verification email."
              }
            </p>
          </div>
          <ResendEmailForm isVerifying={isFetching} isSuccess={isSuccess} />
        </div>
      </CardContent>
    </Card>
  );
}
