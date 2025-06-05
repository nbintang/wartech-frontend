"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axiosInstance";
import { type SignUpForm, signUpSchema } from "../schema/signUpSchema";
import { useHandleDialog } from "@/hooks/useHandleDialog";
import { useMutation } from "@tanstack/react-query";
import { signin } from "../../signin/service/signin";
import Cookies from "js-cookie";
import jwtDecode, { JwtUserPayload } from "@/helpers/jwtDecoder";
import catchAxiosError from "@/helpers/catchAxiosError";
import useTimerCountDown from "@/hooks/useTimerCountDown";

const useSignUp = () => {
  const setOpenDialog = useHandleDialog((state) => state.setOpenDialog);
  const { startTimer } = useTimerCountDown();
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
      const { lastName, firstName,  ...rest } = values;
      const name = `${firstName} ${lastName}`;
      await axiosInstance.post(`/auth/signup`, {
        name,
        ...rest,
      });
      const accessToken = await signin({
        email: values.email,
        password: values.password,
      });
      Cookies.set("accessToken", accessToken);
      const userInfo = jwtDecode<JwtUserPayload>(accessToken);
      return userInfo;
    },
    onMutate: async () => {
      setOpenDialog("signup", {
        message: "Processing...",
        isLoading: true,
      });
    },
    onSuccess: async (data, variables) => {
      try {
        setOpenDialog("signup", {
          message: "Creating your account...",
          isLoading: true,
          isSuccess: false,
          isError: false,
        });
        if (!data.verified) {
          startTimer(60);
          setOpenDialog("signup", {
            message: "Redirecting...",
            isSuccess: true,
            isLoading: false,
          });
          // Lanjutkan redirect
          router.push("/auth/verify");
          form.reset();
        }
        useHandleDialog.getState().closeDialog();
      } catch (error) {
        const message = catchAxiosError(error) ?? "An unknown error occurred.";
        setOpenDialog("signup", {
          message,
          isError: true,
          isLoading: false,
          isSuccess: false,
        });
      }
    },
    onError: (error) => {
      const message = catchAxiosError(error) ?? "An unknown error occurred.";
      setOpenDialog("signup", {
        message,
        isLoading: false,
        isError: true,
      });
    },
  });

  return {
    form,
    signupMutation,
    onOpenChange: setOpenDialog,
  };
};

export default useSignUp;
