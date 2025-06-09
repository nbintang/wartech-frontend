import catchAxiosError from "@/helpers/catchAxiosError";
import { axiosInstance } from "@/lib/axiosInstance";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
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
type PatchProtectedDataProps<TFormSchema extends z.ZodSchema, TResponse> = {
  TAG: MutateParamKeys;
  endpoint: string;
  params?: any;
  formSchema: TFormSchema;
  redirect?: boolean;
  redirectUrl?: string;
} & Omit<
  UseMutationOptions<
    TResponse,
    unknown,
    z.infer<TFormSchema>,
    unknown
  >,
  IgnoreMutationOptions
>;
const usePatchProtectedData = <TFormSchema extends z.ZodSchema, TResponse>({
  TAG,
  endpoint,
  redirect,
  redirectUrl,
  params,
  formSchema,
  ...mutateOptions
}: PatchProtectedDataProps<TFormSchema, ApiResponse<TResponse>>) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<
    ApiResponse<TResponse>,
    unknown,
    z.infer<typeof formSchema>
  >({
    mutationKey:typeof TAG === "string" ? [TAG, params] : TAG,
    mutationFn: async (values: z.infer<typeof formSchema>) : Promise<ApiResponse<TResponse>> => {
      const response = await axiosInstance.patch(
        `/protected${endpoint}`,
        values,
        { params }
      );
      return response.data;
    },
    onMutate: () => {
      toast.loading(`Updating ${TAG}...`, { id: TAG });
    },
    onSuccess: () => {
      toast.success(
        `${TAG.slice(0, 1).toUpperCase() + TAG.slice(1)} updated successfully!`,
        { id: TAG }
      );
      if (redirect && redirectUrl) router.push(redirectUrl);
      queryClient.invalidateQueries({ queryKey: [TAG] });
    },
    onError: (err) => {
      const message = catchAxiosError(err);
      message && toast.error(message, { id: TAG });
    },
    ...mutateOptions,
  });
};

export default usePatchProtectedData;
