import { axiosInstance } from "@/lib/axiosInstance";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import React from "react";
import { z } from "zod";
import useTimerCountDown from "./useTimerCountDown";
import { useHandleDialog } from "./useHandleDialog";
import catchAxiosErrorMessage from "@/helpers/catchAxiosError";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

type AllowMutationOptions =
  | "mutationFn"
  | "mutationKey"
  | "onMutate"
  | "onSuccess"
  | "onError";
type BaseAuthParams<TFormSchema extends z.ZodSchema> =
  | {
      startTime?: false;
      second?: never;
      formSchema: TFormSchema;
      params?:any;
      endpoint: string;
    }
  | ({
      startTime: true;
      second: number;
      params?: any
      formSchema: TFormSchema;
      endpoint: string;
    } & Omit<
      UseMutationOptions<
        AxiosResponse<any>,
        unknown,
        z.infer<TFormSchema>,
        unknown
      >,
      AllowMutationOptions
    >);
type WithRedirect<TFormSchema extends z.ZodSchema> = {
  redirect: true;
  redirectUrl: string;
} & BaseAuthParams<TFormSchema>;
type WithoutRedirect<TFormSchema extends z.ZodSchema> = {
  redirect?: false;
  redirectUrl?: never;
} & BaseAuthParams<TFormSchema>;
type PostAuthParamsProps<TFormSchema extends z.ZodSchema> =
  | WithRedirect<TFormSchema>
  | WithoutRedirect<TFormSchema>;

const usePostVerifyAuth = <TFormSchema extends z.ZodSchema>({
  endpoint,
  formSchema,
  startTime = false,
  redirect = false,
  params,
  redirectUrl,
  second,
  ...mutateOptions
}: PostAuthParamsProps<TFormSchema>) => {
  const { startTimer, timer, isTimerStarted } = useTimerCountDown();
  const router = useRouter();
  const setOpenDialog = useHandleDialog((state) => state.setOpenDialog);
  const result = useMutation<
    AxiosResponse<any>,
    unknown,
    z.infer<typeof formSchema>
  >({
    mutationKey: [endpoint],
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      await axiosInstance.post(`/auth${endpoint}`, values, {
        params
      }),
    onMutate: () => {
      setOpenDialog(endpoint, {
        message: "Processing...",
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
    },
    onSuccess: (response) => {
      const message = response.data.message;
      if (response.status === 201) {
        startTime && startTimer(second);
        setOpenDialog(endpoint, {
          message,
          isSuccess: true,
          isLoading: false,
        });
        if (redirect && redirectUrl) {
          router.push(redirectUrl);
        }
      }
      return message;
    },
    onError: (err) => {
      const message =
        catchAxiosErrorMessage(err) ?? "An unknown error occurred.";
      setOpenDialog(endpoint, {
        message,
        isError: true,
        isLoading: false,
      });
      return message;
    },
    ...mutateOptions,
  });
  return {
    ...result,
    timer,
    isTimerStarted,
  };
};

export default usePostVerifyAuth;
