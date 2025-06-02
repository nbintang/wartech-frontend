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
  const { startTimer}  =useTimerCountDown()
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
  const router = useRouter();
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
      setOpenDialog("signup", true, {
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
        setOpenDialog("signup", true, {
          message: "Creating your account...",
          isLoading: true,
          isSuccess: false,
          isError: false,
          redirect: false,
        });
        const tokenInfo = jwtDecode(accessToken);
        if (!tokenInfo.verified) {
          startTimer(60);
          setOpenDialog("signup", true, {
            message: "Redirecting...",
            isSuccess: true,
            isLoading: false,
            redirect: true,
          });
          // Lanjutkan redirect
          router.push("/auth/verify");
          form.reset();
        }
        useHandleDialog.getState().closeDialog();
      } catch (error) {
        setOpenDialog("signup", true, {
          message: "Signup succeeded but auto login failed",
          isError: true,
          isLoading: false,
          isSuccess: false,
          redirect: false,
        });
        const message = catchAxiosErrorMessage(error);
        toast.error(message);
      }
    },
    onError: (error) => {
      const message =
        (error as any)?.response?.data?.message || "Something went wrong";
      toast.error(message);
      setOpenDialog("signup", true, {
        message,
        isLoading: false,
        isError: true,
      });
    },
  });

  return { form, signupMutation, onOpenChange: setOpenDialog };
};

export default useSignUp;
