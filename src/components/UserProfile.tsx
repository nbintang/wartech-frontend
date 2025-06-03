"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useFetchProtectedData from "@/hooks/useFetchProtectedData";
import { AlertCircleIcon, CheckCircle2, LoaderCircleIcon } from "lucide-react";
import { UserProfileResponse } from "@/type/userType";
import { Skeleton } from "./ui/skeleton";
export default function UserProfile() {
  const { data, isLoading, isSuccess, isUnauthorized, isError, error } =
    useFetchProtectedData<UserProfileResponse>({
      TAG: "account",
      endpoint: "/users/profile",
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: false,
    });
  if (error || isUnauthorized) {
    return (
      <div className="flex  gap-2 bg-muted rounded-md p-4 items-center">
        <AlertCircleIcon className="size-11 rounded-full text-destructive" />
        <p className="text-destructive h-4 text-sm truncate max-w-xs font-medium">
          {error?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex   gap-x-4 bg-muted rounded-md p-4">
      {isLoading && (
        <>
          <div className="flex gap-2 items-center">
            <Skeleton className="size-11 rounded-full bg-muted-foreground" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24 bg-muted-foreground" />
              <Skeleton className="h-3 w-40 bg-muted-foreground" />
            </div>
          </div>
        </>
      )}
      {isSuccess && (
        <>
          <Avatar className="size-11">
            <AvatarImage src={data.image ?? "https://github.com/shadcn.png"} />
            <AvatarFallback>{data?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start ">
            <div className="flex items-center flex-row-reverse gap-2">
              {data.verified && (
                <CheckCircle2 className="text-blue-500 size-4" />
              )}
              <p>{data.name}</p>
            </div>
            <p className="text-sm text-muted-foreground">{data.email}</p>
          </div>
        </>
      )}
    </div>
  );
}
