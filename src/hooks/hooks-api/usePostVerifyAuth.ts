import { axiosInstance } from "@/lib/axiosInstance";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { z } from "zod";
import useTimerCountDown from "../useTimerCountDown";
import useHandleLoadingDialog from "../useHandleLoadingDialog";
import catchAxiosError from "@/helpers/catchAxiosError";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

type IgnoreMutationOptions =
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
      params?: any;
      endpoint: string;
    }
  | ({
      startTime: true;
      second: number;
      params?: any;
      formSchema: TFormSchema;
      endpoint: string;
    } & Omit<
      UseMutationOptions<
        AxiosResponse<any>,
        unknown,
        z.infer<TFormSchema>,
        unknown
      >,
      IgnoreMutationOptions
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
  const setOpenDialog = useHandleLoadingDialog((state) => state.setOpenDialog);
  const result = useMutation<
    AxiosResponse<any>,
    unknown,
    z.infer<typeof formSchema>
  >({
    mutationKey: [endpoint],
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      await axiosInstance.post(`/auth${endpoint}`, values, {
        params,
      }),
    onMutate: () => {
      setOpenDialog(endpoint, {
        description: "Verifying your data...",
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
    },
    onSuccess: (response) => {
      const message = response.data.message;
      console.log(response.data);
      if (response.status === 201) {
        const isFromResendEmail =
          endpoint === "/resend-verification" && response.data.data.expiresIn;
        if (isFromResendEmail) {
          startTimer(isFromResendEmail);
        } else if (startTime && second) startTimer(second);
        setOpenDialog(endpoint, {
          description: message,
          isSuccess: true,
          isLoading: false,
        });
        if (redirect && redirectUrl) router.push(redirectUrl);
      }
      return message;
    },
    onError: (err) => {
      const message = catchAxiosError(err) ?? "An unknown error occurred.";
      setOpenDialog(endpoint, {
        description: message,
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
