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
import { catchAxiosError } from "@/helpers/catchAxiosError";
const useSignUp = () => {
  const onOpenChange = useHandleDialog((state) => state.onOpenChange);
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
      onOpenChange("signup", true, {
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
        onOpenChange("signup", true, {
          message: _data.message || "Account created successfully!",
          isSuccess: true,
        });
        const tokenInfo = jwtDecode(accessToken);
        if (!tokenInfo.verified) {
          onOpenChange("signup", true, {
            message: "Account created and signed in!",
            isSuccess: true,
          });
          form.reset();
          router.push("/auth/verify");
        }
      } catch (error) {
        onOpenChange("signup", true, {
          message: "Signup succeeded but auto login failed",
          isLoading: false,
          isSuccess: false,
          isError: true,
        });
        const message = catchAxiosError(error);
        toast.error(message);
      }
    },
    onError: (error) => {
      const message =
        (error as any)?.response?.data?.message || "Something went wrong";
      toast.error(message);
      onOpenChange("signup", true, {
        message,
        isLoading: false,
        isError: true,
      });
    },
  });

  return { form, signupMutation, onOpenChange };
};

export default useSignUp;
