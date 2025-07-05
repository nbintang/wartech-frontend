import catchAxiosErrorMessage from "@/helpers/catchAxiosError";
import { axiosInstance } from "@/lib/axiosInstance";
import { capitalizeFirstLetter } from "@/lib/utils";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
type IgnoreMutationOptions =
  | "mutationFn"
  | "mutationKey"
  | "onMutate"
  | "onSuccess"
  | "onError";

type MutateParamKeys =
  | "users"
  | "me"
  | "articles"
  | "comments"
  | "tags"
  | "categories";
type PatchProtectedDataProps<TResponse, TFormSchema extends z.ZodSchema> = {
  TAG: MutateParamKeys | string[];
  endpoint: string;
  params?: any;
  formSchema: TFormSchema;
  redirect?: boolean;
  redirectUrl?: string;
} & Omit<
  UseMutationOptions<TResponse, unknown, z.infer<TFormSchema>, unknown>,
  IgnoreMutationOptions
>;
const usePatchProtectedData = <TResponse, TFormSchema extends z.ZodSchema>({
  TAG,
  endpoint,
  redirect,
  redirectUrl,
  params,
  formSchema,
  ...mutateOptions
}: PatchProtectedDataProps<ApiResponse<TResponse>, TFormSchema>) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<
    ApiResponse<TResponse>,
    unknown,
    z.infer<typeof formSchema>
  >({
    mutationKey: typeof TAG === "string" ? [TAG, params] : TAG,
    mutationFn: async (
      values: z.infer<typeof formSchema>
    ): Promise<ApiResponse<TResponse>> => {
      const response = await axiosInstance.patch(
        `/protected${endpoint}`,
        values,
        { params }
      );
      return response.data;
    },
    onMutate: () => {
      toast.loading(`Updating ${TAG[0]}...`, {
        id: typeof TAG === "string" ? TAG : (TAG[0] as MutateParamKeys),
      });
    },
    onSuccess: () => {
      toast.success(
        `${
          capitalizeFirstLetter(typeof TAG === "string" ? TAG : TAG[0])
        } updated successfully!`,
        { id: TAG[0] as MutateParamKeys }
      );
      if (redirect && redirectUrl) router.push(redirectUrl);
      queryClient.invalidateQueries({ queryKey: [TAG] });
    },
    onError: (err) => {
      const message = catchAxiosErrorMessage(err);
      message &&
        toast.error(message, {
          id: TAG[0] as MutateParamKeys,
        });
    },
    ...mutateOptions,
  });
};

export default usePatchProtectedData;
