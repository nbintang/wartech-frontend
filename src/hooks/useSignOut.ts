"use client";
import { axiosInstance } from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgress } from "@bprogress/next";

const useSignOut = () => {
  const router = useRouter();
  const loader = useProgress();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["signout"],
    mutationFn: async () => {
      loader.start();
      const response = await axiosInstance.delete("/auth/signout");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Signed out successfully!");
      router.refresh();
      queryClient.removeQueries();
    },
    onSettled: () => {
      loader.stop();
    },
    onError: () => {
      loader.stop();
    },
  });
};

export default useSignOut;
