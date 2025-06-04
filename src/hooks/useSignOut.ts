"use client";
import { axiosInstance } from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { useProgress } from '@bprogress/next';

const useSignOut = () => {
  const router = useRouter();
  const { start, stop } = useProgress(); 

  return useMutation({
    mutationFn: async () => {
      start();
      const response = await axiosInstance.delete("/auth/signout");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Signed out successfully!");
      router.refresh();
      router.push("/auth/sign-in");
    },
    onSettled: () => {
      stop(); 
    },
    onError: () => {
      stop();
    },
  });
};

export default useSignOut;
