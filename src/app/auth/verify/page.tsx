"use client";
import { axiosInstance } from "@/lib/axiosInstance";
import { BotIcon, LoaderCircleIcon, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import ResendEmailForm from "@/features/auth/resend-email/components/ResendEmailForm";
import catchAxiosErrorMessage from "@/helpers/catchAxiosError";
import AuthCard from "@/components/AuthCard";
import Link from "next/link";

const getVerifyUser = async (token: string) =>
  await axiosInstance.post(`/auth/verify`, undefined, {
    params: {
      token,
    },
  });
export default function VerifyUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;

  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["verify-user"],
    mutationFn: async () => {
      const response = await getVerifyUser(token);
      const accessToken = response.data.data.accessToken;
      Cookies.set("accessToken", accessToken);
      return response;
    },
    onMutate: () => {
      toast.loading("Verifying email...", { id: "verify" });
    },
    onSuccess: () => {
      toast.success("Email verified successfully!", { id: "verify" });
      router.push("/");
    },
    onError: (err) => {
      const message = catchAxiosErrorMessage(err);
      message && toast.error(message, { id: "verify" });
    },
    retry: false,
  });

  useEffect(() => {
    if (token) {
      mutate();
    }
  }, [token, mutate]);

  return (
    <AuthCard
      title="Verify your email"
      description="We've sent a verification link to your email address. Please check your inbox and click the link to verify your account."
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Didn't receive the email? Check your spam folder or request a new
            verification email.
          </p>
        </div>
        <ResendEmailForm
          isVerifying={isPending}
          isSuccessVerifying={isSuccess}
        />
        <div className="text-center">
          <Link
            href="/auth/sign-in"
            className="text-sm text-blue-600 hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
