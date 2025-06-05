"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axiosInstance";
import { type SignUpForm, signUpSchema } from "../schema/signUpSchema";
import { useHandleDialog } from "@/hooks/useHandleDialog";
import { useMutation } from "@tanstack/react-query";
import { signin } from "../../signin/service/signin";
import Cookies from "js-cookie";
import jwtDecode from "@/helpers/jwtDecoder";
import catchAxiosError from "@/helpers/catchAxiosError";
import useTimerCountDown from "@/hooks/useTimerCountDown";
import { FileWithPreview, accept } from "@/components/ImageCropper";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import base64ToFile from "@/helpers/base64ToFile";
const useSignUp = () => {
  const setOpenDialog = useHandleDialog((state) => state.setOpenDialog);
  const { startTimer } = useTimerCountDown();
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null
  );
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      alert("Selected image is too large!");
      return;
    }
    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    setSelectedFile(fileWithPreview);
    setOpenProfileDialog(true);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

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
        const formData = new FormData();
        if (croppedImage) {
          formData.append("file", base64ToFile(croppedImage, "profile.png"));
        }
        const accessToken = await signin({
          email: variables.email,
          password: variables.password,
        });

        Cookies.set("accessToken", accessToken);
        setOpenDialog("signup", {
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
  const handleImageUpdate = useCallback(
    (base64: string | null) => {
      setCroppedImage(base64);
      form.setValue("image", base64 || "No File Selected");
      form.trigger("image");
    },
    [form]
  );
  return {
    form,
    signupMutation,
    onOpenChange: setOpenDialog,
    handleImageUpdate,
    selectedFile,
    setSelectedFile,
    croppedImage,
    setCroppedImage,
    getRootProps,
    getInputProps,
    openProfileDialog,
    setOpenProfileDialog,
  };
};

export default useSignUp;
