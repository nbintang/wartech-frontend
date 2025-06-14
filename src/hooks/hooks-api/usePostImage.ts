import base64ToFile from "@/helpers/base64ToFile";
import catchAxiosError from "@/helpers/catchAxiosError";
import { axiosInstance } from "@/lib/axiosInstance";
import { type UploadImageApiResponse } from "@/types/api/UploadImageApiResponse";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

type PostImageProps = {
  folder: "users" | "articles";
  "image-url"?: string | null;
} & Omit<
  UseMutationOptions<
    UploadImageApiResponse,
    unknown,
    File | string | null,
    unknown
  >,
  "mutationFn" | "mutationKey" | "onError"
>;

const usePostImage = ({
  folder,
  "image-url": imageUrl,
  ...options
}: PostImageProps) => {
  return useMutation({
    mutationKey: [folder],
    mutationFn: async (
      file: File | string | null
    ): Promise<UploadImageApiResponse> => {
      const formData = new FormData();
      const isBase64String = typeof file === "string";
      if (!file) return { secureUrl: "", publicId: "", createdAt: null };
      let convertedFile: File;
      if (isBase64String) {
        convertedFile = base64ToFile(file, "image.png");
      } else convertedFile = file;
      formData.append("file", convertedFile);
      const profileResponse = await axiosInstance.post(
        "/protected/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            folder,
            "image-url": imageUrl ?? null,
          },
        }
      );
      const data = profileResponse.data.data;
      return data as UploadImageApiResponse;
    },
    onError: async (err) => {
      const message = catchAxiosError(err) ?? "An unknown error occurred.";
      toast.error(message);
    },
    ...options,
  });
};

export default usePostImage;
