import catchAxiosError from "@/helpers/catchAxiosError";
import { axiosInstance } from "@/lib/axiosInstance";
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
  | "onError";
type MutateParamKeys =
  | "users"
  | "profile"
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
  return useMutation<AxiosResponse, unknown, { ids: string[] } | void>({
    mutationKey: [TAG],
    mutationFn: async (values: { ids: string[] } | void) =>
      await axiosInstance.delete(`/protected${endpoint}`, {
        data: values,
        params,
      }),
    onSuccess: () => {
      toast.success(
        `${TAG.slice(0, 1).toUpperCase() + TAG.slice(1)} deleted successfully!`,
        { id: TAG }
      );
      if (redirect && redirectUrl) router.push(redirectUrl);
      queryClient.invalidateQueries({ queryKey: [TAG] });
    },
    onError: (err) => {
      const message = catchAxiosError(err);
      message && toast.error(message, { id: TAG });
    },
    onMutate: () => {
      toast.loading(`Deleting ${TAG}...`, { id: TAG });
    },
    ...mutateOptions,
  });
};

export default useDeleteProtectedData;
