"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axiosInstance";
import { type SignUpForm, signUpSchema } from "../schema/signUpSchema";
import useHandleLoadingDialog from "@/hooks/store/useHandleLoadingDialog";
import { useMutation } from "@tanstack/react-query";
import postSignin from "../../../../helpers/postSignin";
import Cookies from "js-cookie";
import  {jwtDecode,type  JwtUserPayload } from "@/lib/utils";
import catchAxiosError from "@/helpers/catchAxiosError";
import useTimerCountDown from "@/hooks/useTimerCountDown";
import { useProgress } from "@bprogress/next";

const useSignUp = () => {
  const setOpenDialog = useHandleLoadingDialog((state) => state.setOpenDialog);
  const { startTimer } = useTimerCountDown();
  const loader = useProgress();
  const router = useRouter();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTOS: false,
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (values: SignUpForm) => {
      const { lastName, firstName, ...rest } = values;
      const name = `${firstName} ${lastName}`;
      await axiosInstance.post(`/auth/signup`, {
        name,
        ...rest,
      });
      const accessToken = await postSignin({
        email: values.email,
        password: values.password,
      });
      Cookies.set("accessToken", accessToken);
      const userInfo = jwtDecode<JwtUserPayload>(accessToken);
      return userInfo;
    },
    onMutate: async () => {
      loader.start();
      setOpenDialog("signup", {
        description: "Processing...",
        isLoading: true,
      });
    },
    onSuccess: async (data, variables) => {
      setOpenDialog("signup", {
        description: "Creating your account...",
        isLoading: true,
        isSuccess: false,
        isError: false,
      });
      if (!data.verified) {
        startTimer(60);
        setOpenDialog("signup", {
          description: "Redirecting...",
          isSuccess: true,
          isLoading: false,
        });
        loader.stop();
        // Lanjutkan redirect
        router.push("/auth/verify");
        form.reset();
      }
      useHandleLoadingDialog.getState().closeDialog();
    },
    onError: (error) => {
      const message = catchAxiosError(error) ?? "An unknown error occurred.";
      setOpenDialog("signup", {
        description: message,
        isLoading: false,
        isError: true,
      });
    },
    onSettled: () => loader.stop(),
  });

  return {
    form,
    signupMutation,
    onOpenChange: setOpenDialog,
  };
};

export default useSignUp;
