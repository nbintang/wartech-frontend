import catchAxiosError from "@/helpers/catchAxiosError";
import { axiosInstance } from "@/lib/axiosInstance";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
type ProfileResponse = {
  secureUrl: string;
  publicId: string;
  createdAt: string;
};
type PostImageProps = {
  folder: string;
  "image-url"?: string;
} & Omit<
  UseMutationOptions<ProfileResponse, unknown, File, unknown>,
  "mutationFn" | "mutationKey" | "onError"
>;

const usePostImage = ({
  folder,
  "image-url": imageUrl,
  ...options
}: PostImageProps) => {
  return useMutation({
    mutationKey: [folder],
    mutationFn: async (file: File): Promise<ProfileResponse> => {
      const profileResponse = await axiosInstance.post(
        "/protected/upload",
        file,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            folder,
            "image-url": imageUrl,
          },
        }
      );
      const data = profileResponse.data.data;
      return data;
    },
    onError: async (err) => {
      const message = catchAxiosError(err) ?? "An unknown error occurred.";
      toast.error(message);
    },

    ...options,
  });
};

export default usePostImage;
