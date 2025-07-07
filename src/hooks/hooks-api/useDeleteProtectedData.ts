"use client";
import catchAxiosErrorMessage from "@/helpers/catchAxiosError";
import { axiosInstance } from "@/lib/axiosInstance";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useProgress } from "@bprogress/next";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type IgnoreMutationOptions =
  | "mutationFn"
  | "mutationKey"
  | "onMutate"
  | "onSuccess"
  | "onError"
  | "onSettled";
type MutateParamKeys =
  | "users"
  | "me"
  | "articles"
  | "comments"
  | "tags"
  | "categories";
type DeleteProtectedDataProps = {
  TAG: MutateParamKeys;
  endpoint: string;
  params?: string;
  redirect?: boolean;
  redirectUrl?: string;
} & Omit<
  UseMutationOptions<AxiosResponse, unknown, { ids: string[] } | void, unknown>,
  IgnoreMutationOptions
>;

const useDeleteProtectedData = ({
  TAG,
  endpoint,
  params,
  redirect,
  redirectUrl,
  ...mutateOptions
}: DeleteProtectedDataProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const loader = useProgress();
  const toastId = typeof TAG === "string" ? TAG : TAG[0];
  const toastMessage = capitalizeFirstLetter(toastId);
  return useMutation<AxiosResponse, unknown, { ids: string[] } | void>({
    mutationKey: Array.isArray(TAG) ? TAG : [TAG, endpoint, params],
    mutationFn: async (values: { ids: string[] } | void) => {
      loader.start();
      return await axiosInstance.delete(`/protected${endpoint}`, {
        data: values,
        params,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAG] });
    },
    onMutate: () => {
      toast.loading(`Deleting ${toastMessage}...`, { id: toastId });
    },
    onError: (err) => {
      console.log(catchAxiosErrorMessage(err));
    },
    onSettled: (data, error, variables) => {
      if (error) {
        toast.error(`${toastMessage} update failed!`, { id: toastId });
        loader.stop();
      }
      if (data) {
        toast.success(`${toastMessage} updated successfully!`, { id: toastId });
        loader.stop();
      }
      if (redirect && redirectUrl && !error) router.push(redirectUrl);
    },
    ...mutateOptions,
  });
};

export default useDeleteProtectedData;
