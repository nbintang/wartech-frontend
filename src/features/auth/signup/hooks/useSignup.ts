"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axiosInstance";
import { type SignUpForm, signUpSchema } from "../schema/signUpSchema";
import { useHandleDialog } from "@/hooks/useHandleDialog";
import { useMutation } from "@tanstack/react-query";
import { signin } from "../../signin/service/signin";
import Cookies from "js-cookie";
import jwtDecode from "@/helpers/jwtDecoder";
import catchAxiosErrorMessage from "@/helpers/catchAxiosError";
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
      const { lastName, firstName, ...rest } = values;
      const name = `${firstName} ${lastName}`;
      const response = await axiosInstance.post(`/auth/signup`, {
        name,
        ...rest,
      });
      return response.data;
    },
    onMutate: async () => {
      setOpenDialog("signup", {
        message: "Processing...",
        isLoading: true,
      });
    },
    onSuccess: async (_data, variables) => {
      try {
        const accessToken = await signin({
          email: variables.email,
          password: variables.password,
        });
        Cookies.set("accessToken", accessToken);
        setOpenDialog("signup",  {
          message: "Creating your account...",
          isLoading: true,
          isSuccess: false,
          isError: false,
        });
        const tokenInfo = jwtDecode(accessToken);
        if (!tokenInfo.verified) {
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
        const message = catchAxiosErrorMessage(error) ?? "An unknown error occurred.";
        setOpenDialog("signup",  {
          message,
          isError: true,
          isLoading: false,
          isSuccess: false,
        });
      }
    },
    onError: (error) => {
      const message =
        catchAxiosErrorMessage(error) ?? "An unknown error occurred.";
      setOpenDialog("signup",  {
        message,
        isLoading: false,
        isError: true,
      });
    },
  });

  return { form, signupMutation, onOpenChange: setOpenDialog };
};

export default useSignUp;
