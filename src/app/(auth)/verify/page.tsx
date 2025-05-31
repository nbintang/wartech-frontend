"use client";
import { axiosInstance } from "@/lib/axiosInstance";
import { BotIcon, LoaderCircleIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

const getVerifyUser = async (userId: string, token: string) => {
  const response = await axiosInstance.get(`/auth/verify/`, {
    params: {
      userId,
      token,
    },
  });
  console.log(response.data);
  return response.data.data.accessToken;
};
export default function VerifyUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const { isSuccess, isPending, isError, data, error } = useQuery({
    queryKey: ["verify-user"],
    queryFn: async () => await getVerifyUser(userId!, token!),
    enabled: !!userId && !!token,
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
        toast.error("Token expired, please try to verify again");
      }
    }
  }, [isError, error]);

  return (
    <main className="grid place-items-center min-h-screen bg-black">
      <section className="flex flex-col items-center gap-4 p-6 md:p-10 border border-primary rounded-2xl  bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-24 items-center justify-center rounded-xl shadow-md">
            <BotIcon className="size-16 " />
          </div>
        </div>
        <div className="text-center ">
          <h1 className="text-2xl font-bold tracking-wide">
            Verify your account
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Please check your email to verify your account
          </p>
          <div className="flex justify-center items-center gap-2 mt-5">
            {isPending && (
              <>
                <p>Waiting...</p> <LoaderCircleIcon className="animate-spin" />
              </>
            )}
            {isSuccess && <p className="text-success">Verification Success</p>}
            {isError && <p className="text-destructive">Verification Failed</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
