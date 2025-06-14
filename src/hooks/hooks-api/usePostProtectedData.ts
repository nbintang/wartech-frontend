import catchAxiosError from "@/helpers/catchAxiosError";
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
  | "profile"
  | "articles"
  | "comments"
  | "tags"
  | "categories";
type PostProtectedDataProps<TFormSchema extends z.ZodSchema, TResponse> = {
  TAG: MutateParamKeys;
  endpoint: string;
  params?: any;
  formSchema: TFormSchema;
  redirect?: boolean;
  redirectUrl?: string;
} & Omit<
  UseMutationOptions<TResponse, unknown, z.infer<TFormSchema>, unknown>,
  IgnoreMutationOptions
>;

const usePostProtectedData = <TFormSchema extends z.ZodSchema, TResponse>({
  TAG,
  endpoint,
  redirect,
  redirectUrl,
  params,
  formSchema,
  ...mutateOptions
}: PostProtectedDataProps<TFormSchema, TResponse>) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<TResponse, unknown, z.infer<typeof formSchema>>({
    mutationKey: [TAG, params],
    mutationFn: async (
      values: z.infer<typeof formSchema>
    ): Promise<TResponse> => {
      const response = await axiosInstance.post(
        `/protected${endpoint}`,
        values,
        { params }
      );
      return response.data;
    },
    onMutate: () => {
      toast.loading(`Creating ${TAG}...`, { id: TAG });
    },
    onSuccess: () => {
      toast.success(`${TAG} created successfully!`, { id: TAG });
      if (redirect && redirectUrl) router.push(redirectUrl);
      queryClient.invalidateQueries({ queryKey: [TAG, params] });
    },
    onError: (err) => {
      const message = catchAxiosError(err);
      message && toast.error(message, { id: TAG });
    },
    ...mutateOptions,
  });
};
export default usePostProtectedData;
