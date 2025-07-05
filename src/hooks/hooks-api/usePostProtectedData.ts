import catchAxiosErrorMessage from "@/helpers/catchAxiosError";
import { axiosInstance } from "@/lib/axiosInstance";
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
type ProtectedDataTags = MutateParamKeys | MutateParamKeys[] | string[];
type PostProtectedDataProps<TResponse, TFormSchema extends z.ZodSchema> = {
  TAG: ProtectedDataTags;
  endpoint: string;
  params?: any;
  formSchema: TFormSchema;
  redirect?: boolean;
  redirectUrl?: string;
} & Omit<
  UseMutationOptions<TResponse, unknown, z.infer<TFormSchema>, unknown>,
  IgnoreMutationOptions
>;

const usePostProtectedData = <TResponse, TFormSchema extends z.ZodSchema>({
  TAG,
  endpoint,
  redirect,
  redirectUrl,
  params,
  formSchema,
  ...mutateOptions
}: PostProtectedDataProps<ApiResponse<TResponse>, TFormSchema>) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<
    ApiResponse<TResponse>,
    unknown,
    z.infer<typeof formSchema>
  >({
    mutationKey: typeof TAG === "string" ? [...TAG, params] : TAG,
    mutationFn: async (
      values: z.infer<typeof formSchema>
    ): Promise<ApiResponse<TResponse>> => {
      const response = await axiosInstance.post(
        `/protected${endpoint}`,
        values,
        { params }
      );
      return response.data as ApiResponse<TResponse>;
    },
    onMutate: () => {
      toast.loading(`Creating ${typeof TAG === "string" ? TAG : TAG[0]}...`, {
        id: TAG[0] as MutateParamKeys,
      });
    },
    onSuccess: () => {
      toast.success(
        `${typeof TAG === "string" ? TAG : TAG[0]} created successfully!`,
        {
          id: TAG[0],
        }
      );
      if (redirect && redirectUrl) router.push(redirectUrl);
      queryClient.invalidateQueries({ queryKey: [TAG, params] });
    },
    onError: (err) => {
      const message = catchAxiosErrorMessage(err);
      message && toast.error(message, { id: TAG as MutateParamKeys });
    },
    ...mutateOptions,
  });
};
export default usePostProtectedData;
