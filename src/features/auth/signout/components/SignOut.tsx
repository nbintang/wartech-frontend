"use client";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";

export default function SignOut() {
  const router = useRouter();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete("/auth/signout");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Signed out successfully!");
      router.push("/auth/sign-in");
    },
  });

  return (
      <Button className="w-full cursor-pointer" onClick={() => mutate()}>
      Sign Out
    
      </Button>
  );
}
