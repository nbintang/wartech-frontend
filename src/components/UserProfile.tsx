"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { UserProfileResponse } from "@/type/userType";
export default function UserProfile({
  isLoading,
  isSuccess,
  data,
}: {
  isLoading?: boolean;
  isSuccess?: boolean;
  data?: UserProfileResponse
}) {

  if (isLoading) {
    return (
      <>
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-8 w-8 bg-muted-foreground rounded-lg grayscale" />
          <div className="flex flex-col h-6 justify-between text-black">
            <Skeleton className="h-2.5 w-14 bg-muted-foreground" />
            <Skeleton className="h-2 w-20 bg-muted-foreground" />
          </div>
        </div>
      </>
    );
  }
  if (isSuccess) {
    return (
      <>
        <Avatar className="h-8 w-8 rounded-lg grayscale">
          <AvatarImage src={data?.image ?? "https://github.com/shadcn.png"} />
          <AvatarFallback className="rounded-lg">
            {data?.name?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{data?.name}</span>
          <span className="text-muted-foreground truncate text-xs">
            {data?.email}
          </span>
        </div>
      </>
    );
  }
}
