import React from "react";
import { useForm } from "react-hook-form";
import { UserProfileForm, userProfileSchema } from "../schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import { FileWithPreview, ImageCropper } from "@/components/ui/image-cropper";
import { FileWithPath, useDropzone } from "react-dropzone";
import { accept } from "../../../../components/ui/image-cropper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagesIcon } from "lucide-react";
import usePatchProtectedData from "@/hooks/hooks-api/usePatchProtectedData";
import useHandleWarningDialog from "@/hooks/store/useHandleWarningDialog";

const UserProfileDasboard = ({
  profile,
}: {
  profile: UserProfileApiResponse;
}) => {
  const form = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
    },
  });
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [croppedImage, setCroppedImage] = React.useState<string | null>(null);
  const setOpenWarningDialog = useHandleWarningDialog(
    (state) => state.setOpenDialog
  );
  const onDrop = React.useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      alert("Selected image is too large!");
      return;
    }

    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setSelectedFile(fileWithPreview);
    setDialogOpen(true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

  const { mutate } = usePatchProtectedData({
    formSchema: userProfileSchema,
    TAG: "me",
    endpoint: `/users/${profile.id}`,
    redirect: true,
    redirectUrl: "/dashboard/profile",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await setOpenWarningDialog({
      buttonVariants: "default",
      isOpen: true,
      title: "Update Profile",
      description: "Are you sure you want to update your profile?",
      onConfirm: () =>
        mutate({
          ...values,
          image: croppedImage ? croppedImage : profile.image,
        }),
    });
  });
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-3">
          <div className="space-y-1">
            <Label className="text-lg font-semibold leading-6">
              Photo Profile
            </Label>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>
          {selectedFile ? (
            <ImageCropper
              className="size-36   cursor-pointer relative "
              dialogOpen={isDialogOpen}
              setOpenDialog={setDialogOpen}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              croppedImage={croppedImage}
              setCroppedImage={setCroppedImage}
            />
          ) : (
            <Avatar
              {...getRootProps()}
              className="size-36   cursor-pointer relative "
            >
              <div className="group hover:opacity-100 opacity-0 bg-background/50 size-36 inset-0 duration-200 transition-all flex items-center absolute z-10 justify-center">
                <ImagesIcon className=" group-hover:opacity-100 opacity-0 text-muted-foreground  duration-200 transition-all" />
              </div>
              <Input {...getInputProps()} />
              <AvatarImage src={profile.image || ""} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormDescription className="text-xs md:text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
                at expedita qui.
              </FormDescription>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormDescription className="text-xs md:text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
                at expedita qui.
              </FormDescription>
              <FormControl>
                <Input disabled placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.isDirty && (
          <div className="flex gap-3  mt-10">
            <Button variant="outline" type="reset" onClick={() => form.reset()}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default UserProfileDasboard;
