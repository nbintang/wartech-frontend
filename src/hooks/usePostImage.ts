import { axiosInstance } from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

type PostImageProps = {
  folder: string;
  "image-url": string;
  file: File;
};
const usePostImage = ({
  folder,
  "image-url": imageUrl,
  file,
}: PostImageProps) => {
  return useMutation({
    mutationFn: async () => {
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
      profileResponse.data.data;
    },
  });
};
