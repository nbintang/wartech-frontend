"use client";
import { use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UsersApiResponse
} from "@/types/api/UserApiResponse";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { Check } from "lucide-react";
import useHandleImageDialog from "@/hooks/store/useHandlerImageDialog";
import { Separator } from "@/components/ui/separator";
import UserByIdProfileDashboard from "@/features/admin/users/components/UserProfilePage";

export default function UserByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const setOpenImageDialog = useHandleImageDialog(
    (state) => state.setOpenDialog
  );
  const {
    data: user,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useFetchProtectedData<UsersApiResponse>({
    endpoint: `/users/${id}`,
    TAG: "users",
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });

  if (isError) {
    return <div>{error?.message || "An error occurred."}</div>;
  }
  if (isLoading || !isSuccess) {
    return (
      <>
        <div className="container mx-auto">
          <section className="px-4 sm:px-8">
            <div className="relative -mt-16 flex flex-col items-center md:flex-row md:items-center md:justify-between">
              <div className="relative">
                <div className="size-40  bg-accent rounded-full ring-offset-2 ring-2 ring-offset-background ring-background" />
              </div>

              <div className="flex flex-row items-center md:mt-14 md:ml-5 justify-between w-full">
                <div className="text-start space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col mx-3 gap-4 mt-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            <Separator />

            <div className="space-y-6">
              <div className="flex items-start space-y-2 flex-col justify-between">
                <div className="flex items-start flex-col justify-between gap-2 w-full">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 md:w-96" />
                </div>
                <Skeleton className="size-36 rounded-full" />
              </div>
              <div className="flex items-start space-y-2  flex-col justify-between">
                <div className="flex items-start flex-col justify-between gap-2 w-full">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 md:w-96" />
                </div>
                <Skeleton className="h-9 w-1/2 md:w-2/3" />
              </div>
              <div className="flex items-start space-y-2  flex-col justify-between">
                <div className="flex items-start flex-col justify-between gap-2 w-full">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 md:w-96" />
                </div>
                <Skeleton className="h-9 w-1/2 md:w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="container mx-auto">
      <section className="px-4 sm:px-8">
        <div
          className="
              relative -mt-16 flex flex-col items-center 
              md:flex-row md:items-center md:justify-between"
        >
          <div className="relative">
            <Avatar
              onClick={() =>
                setOpenImageDialog({
                  isOpen: true,
                  image: user.image,
                  variants: { rounded: "full" },
                })
              }
              className="size-40 ring-offset-2 cursor-pointer ring-2 ring-offset-background ring-background"
            >
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Badge
              className="h-5 min-w-5 rounded-full absolute bottom-3 right-5 px-1 font-mono tabular-nums ring-offset-2 ring-2 ring-offset-background ring-background "
              variant={"success"}
              asChild
            >
              <Check className="font-bold" />
            </Badge>
          </div>

          {/* Name and Email - shown on mobile, hidden on desktop */}
          <div className=" flex flex-row items-center md:mt-14 md:ml-5 justify-between w-full">
            <div className="text-start ">
              <h1 className="font-semibold text-xl md:text-3xl">{user.name}</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-col mx-5 gap-4 mt-4">
        <div>
          <h1 className="font-semibold  text-base sm:text-lg">About</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Necessitatibus quis nobis voluptas.
          </p>
        </div>
        <Separator />
        <UserByIdProfileDashboard user={user} />
      </div>
    </div>
  );
}
