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
type MutateProtectedDataProps<TResponse, TFormSchema extends z.ZodSchema> = {
  TAG: MutateParamKeys;
  endpoint: string;
  params?: any;
  formSchema: TFormSchema;
  redirect?: boolean;
  redirectUrl?: string;
} & Omit<
  UseMutationOptions<
    AxiosResponse<TResponse>,
    unknown,
    z.infer<TFormSchema>,
    unknown
  >,
  IgnoreMutationOptions
>;
const useMutateProtectedData = <TResponse, TFormSchema extends z.ZodSchema>({
  TAG,
  endpoint,
  redirect,
  redirectUrl,
  params,
  formSchema,
  ...mutateOptions
}: MutateProtectedDataProps<TResponse, TFormSchema>) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<
    AxiosResponse<TResponse>,
    unknown,
    z.infer<typeof formSchema>
  >({
    mutationKey: [TAG],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axiosInstance.patch(
        `/protected/${endpoint}`,
        values,
        { params }
      );
      return response.data.data;
    },
    onMutate: () => {
      toast.loading("Updating profile...", { id: TAG });
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!", { id: TAG });
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

export default useMutateProtectedData;
