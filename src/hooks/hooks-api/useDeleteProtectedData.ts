import catchAxiosError from "@/helpers/catchAxiosError";
import { axiosInstance } from "@/lib/axiosInstance";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
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
  redirect?: boolean;
  redirectUrl?: string;
} & Omit<UseMutationOptions, IgnoreMutationOptions>;

const useDeleteProtectedData = ({
  TAG,
  endpoint,
  redirect,
  redirectUrl,
  ...mutateOptions
}: DeleteProtectedDataProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationKey: [TAG],
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/protected${endpoint}`);
      return response.data;
    },
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
