  "use client";
  import { axiosInstance } from "@/lib/axiosInstance";
  import { useRouter } from "next/navigation";
  import { toast } from "sonner";
  import Cookies from "js-cookie";
  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { useProgress } from "@bprogress/next";
  import catchAxiosErrorMessage from "@/helpers/catchAxiosError";

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
        queryClient.removeQueries();
        router.push("/");
      },
      onError: (err) => {
        console.log(catchAxiosErrorMessage(err));
      },
      onSettled: (data, error) => {
        if (error) {
          toast.error(catchAxiosErrorMessage(error));
          loader.stop();
        }
        if (data) {
          loader.stop();
          toast.success("Signed out successfully!");
        }
      },
    });
  };

  export default useSignOut;
