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
  | "onError"
  | "onSettled";

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

    const toastId = typeof TAG === "string" ? TAG : TAG[0];
  const toastMessage = capitalizeFirstLetter(toastId);
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
      // 2. Gunakan ID yang sudah didefinisikan
      toast.loading(`Updating ${toastMessage}...`, { id: toastId });
    },
    onSuccess: () => {
      if (redirect && redirectUrl) router.push(redirectUrl);
      // Menjadi seperti ini
      queryClient.invalidateQueries({ queryKey: [[TAG]] }); 
    },
    onError: (err) => {console.log(catchAxiosErrorMessage(err))},
    onSettled: (data, error) => {
      if (error) {
        toast.error(`${toastMessage} update failed!`, { id: toastId });
      }

      if (data) {
        toast.success(`${toastMessage} updated successfully!`, { id: toastId });
      }

      // Lakukan redirect setelah toast ditampilkan
      if (redirect && redirectUrl && !error) {
        router.push(redirectUrl);
      }
    },
    ...mutateOptions,
  });
};

export default usePatchProtectedData;
