import React from "react";
import { useForm } from "react-hook-form";
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
import {
  UserProfileApiResponse,
  UsersApiResponse,
} from "@/types/api/UserApiResponse";
import { FileWithPreview, ImageCropper } from "@/components/ui/image-cropper";
import { FileWithPath, useDropzone } from "react-dropzone";
import { accept } from "../../../../components/ui/image-cropper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagesIcon } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import useDeleteProtectedData from "@/hooks/hooks-api/useDeleteProtectedData";
import useHandleWarningDialog from "@/hooks/store/useHandleWarningDialog";

const userByIdSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  role: z.enum(["READER", "REPORTER", "ADMIN"]),
  verified: z.boolean(),
});

type UserByIdForm = z.infer<typeof userByIdSchema>;

const UserByIdProfileDashboard = ({ user }: { user: UsersApiResponse }) => {
  const form = useForm<UserByIdForm>({
    resolver: zodResolver(userByIdSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: format(user.createdAt, "hh:mm dd MMM yyyy"),
      updatedAt: format(user.updatedAt, "hh:mm dd MMM yyyy"),
      role: user.role,
      verified: user.verified,
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

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
  });

  const { mutate } = useDeleteProtectedData({
    TAG: "users",
    endpoint: `/users/${user.id}`,
    redirect: true,
    redirectUrl: "/admin/dashboard/users",
  });
  const handleDelete = () => {
    setOpenWarningDialog({
      title: `Delete User`,
      description: "Are you sure you want to delete this user?",
      isOpen: true,
      onConfirm: () => mutate(),
    });
  };
  return (
    <Form {...form}>
      <form className="gap-4 grid grid-cols-2 " onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormDescription className="text-xs md:text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
                at expedita qui.
              </FormDescription>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <Input placeholder="Enter your name" disabled {...field} />
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
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormDescription className="text-xs md:text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
                at expedita qui.
              </FormDescription>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registered At</FormLabel>
              <FormDescription className="text-xs md:text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
                at expedita qui.
              </FormDescription>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="updatedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Updated At</FormLabel>
              <FormDescription className="text-xs md:text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
                at expedita qui.
              </FormDescription>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <div className="flex justify-end">
        <Button
          onClick={handleDelete}
          type="submit"
          variant="destructive"
        >
          Delete User
        </Button>
      </div>
    </Form>
  );
};

export default UserByIdProfileDashboard;
