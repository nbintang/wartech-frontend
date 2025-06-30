"use client";
import { axiosInstance } from "@/lib/axiosInstance";
import { BotIcon, LoaderCircleIcon, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import ResendEmailForm from "@/features/auth/resend-email/components/ResendEmailForm";
import catchAxiosError from "@/helpers/catchAxiosError";
import AuthCard from "@/features/auth/components/AuthCardLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";

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
  const { data: profile } = useFetchProtectedData<UserProfileApiResponse>({
    TAG: "me",
    endpoint: "/users/me",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });
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
      router.push("/auth/update-profile");
    },
    onError: (err) => {
      const message = catchAxiosError(err);
      message && toast.error(message, { id: "verify" });
    },
    retry: false,
  });
useEffect(() => {
  if (profile?.verified) {
    router.push("/");
  }
}, [profile, router]);

  useEffect(() => {
    if (token) mutate();
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
        </div>
        <ResendEmailForm
          isVerified={profile?.verified}
          isTokenMissing={!token}
          isVerifying={isPending}
          isSuccessVerifying={isSuccess}
        />
        <p className="text-xs text-center text-muted-foreground mb-4">
          Didn't receive the email? Check your spam folder or request a new
          verification email.
        </p>
        <Button
          className="grid place-items-center text-blue-600"
          variant={"link"}
          asChild
        >
          <Link href="/auth/sign-in" className="text-sm  hover:underline">
            Back to sign in
          </Link>
        </Button>
      </div>
    </AuthCard>
  );
}
