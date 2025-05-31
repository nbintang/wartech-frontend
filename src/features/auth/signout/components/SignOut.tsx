"use client";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function SignOut() {
  const router = useRouter();
  const handleSignout = async () => {
    try {
      const response = await axiosInstance.delete("/auth/signout");
      if (response.data.success) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        const message = response.data.message;
        toast.success(message);
        router.push("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button className="" onClick={handleSignout}>
      Sign Out
    </Button>
  );
}
