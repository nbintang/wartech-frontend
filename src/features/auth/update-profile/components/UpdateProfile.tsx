"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  accept,
  FileWithPreview,
  ImageCropper,
} from "@/components/ui/image-cropper";
import { FileWithPath, useDropzone } from "react-dropzone";
import usePostImage from "@/hooks/hooks-api/usePostImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { type UserProfileApiResponse } from "@/types/api/UserApiResponse";
import Link from "next/link";
import usePatchProtectedData from "@/hooks/hooks-api/usePatchProtectedData";
import { toast } from "sonner";
import catchAxiosError from "@/helpers/catchAxiosError";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 1024 * 1024 * 0.8; // 800kB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const updateProfileSchema = z.object({
  image: z
    .instanceof(File, {
      message: "Please upload an image.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `The image is too large. Please choose an image smaller than  1MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid image file (JPEG, PNG, or WebP).",
    })
    .or(z.string().url())
    .nullable(),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null
  );
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const {
    data: profile,
    isLoading,
    isError,
  } = useFetchProtectedData<UserProfileApiResponse>({
    endpoint: "/users/profile",
    TAG: "profile",
    gcTime: 1000 * 60 * 10,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
  const router = useRouter();
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
  });
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
  const { mutateAsync: uploadImage, ...uploadMutations } = usePostImage({
    folder: "users",
    "image-url": profile?.image,
  });

  const { mutateAsync: updateProfile, ...updateProfileMutations } =
    usePatchProtectedData({
      endpoint: `/users/${profile?.id}`,
      formSchema: updateProfileSchema,
      TAG: "profile",
    });
  const handleImageUpdate = useCallback(
    (base64: string | null) => {
      setCroppedImage(base64);
      form.setValue("image", base64 || "No File Selected");
      form.trigger("image");
    },
    [form]
  );
  const handleUpdate = async ({ image }: UpdateProfileFormValues) => {
    const updatedImage = await uploadImage(image);
    if (uploadMutations.isError)
      return toast.error(catchAxiosError(uploadMutations.error));
    const updatedProfile = await updateProfile({
      image: updatedImage.secureUrl,
    });
    if (updateProfileMutations.isError) {
      return toast.error(catchAxiosError(updateProfileMutations.error));
    }
    toast.success("Profile updated successfully.");
    router.push("/");
    return updatedProfile.data;
  };
  return (
    <>
      {isError ? (
        <div className="text-center text-destructive">
          Error loading profile. Please try again later.
        </div>
      ) : isLoading ? (
        <div className="flex text-muted-foreground items-center justify-center gap-4">
          <p className="text-base">Loading profile...</p>
          <LoaderCircleIcon className="animate-spin size-10" />
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex w-full md:w-auto gap-2 max-w-md space-y-4 flex-col justify-center"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="mx-auto space-y-3">
                  <FormControl>
                    {selectedFile ? (
                      <ImageCropper
                        className="mx-auto"
                        size="32"
                        croppedImage={croppedImage}
                        setCroppedImage={handleImageUpdate}
                        dialogOpen={openProfileDialog}
                        setOpenDialog={setOpenProfileDialog}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                      />
                    ) : (
                      <Avatar
                        {...getRootProps()}
                        className="size-32 cursor-pointer mx-auto"
                      >
                        <input {...getInputProps()} />
                        <AvatarImage
                          src={profile?.image ?? "/images/question-mark.jpg"}
                          alt={"@shadcn"}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                  </FormControl>
                  <FormLabel className="text-center mx-auto">
                    Add Profile Picture
                  </FormLabel>

                  <FormDescription className="text-xs text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quae, laborum iste aliquam cum accusantium nisi tempora
                    porro
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                variant={"default"}
                className="w-full"
                disabled={
                  form.formState.isSubmitting ||
                  updateProfileMutations.isPending ||
                  uploadMutations.isPending ||
                  selectedFile === null
                }
              >
                {!form.formState.isSubmitting ? (
                  "Update Profile"
                ) : (
                  <span className="flex items-center gap-2">
                    Updating...
                    <LoaderCircleIcon className="animate-spin" />
                  </span>
                )}
              </Button>
              <Button
                type="button"
                className="w-full"
                variant={"outline"}
                asChild
              >
                <Link href={"/"}>No, I don't want to update</Link>
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
