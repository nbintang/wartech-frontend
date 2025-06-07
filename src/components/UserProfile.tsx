"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { UserProfileApiResponse } from "@/types/api/userApiResponse";
import { cn } from "@/lib/utils";
export default function UserProfile({
  className,
  isLoading,
  isSuccess,
  data,
}: {
  isLoading?: boolean;
  isSuccess?: boolean;
  className?: string;
  data?: UserProfileApiResponse;
}) {
  if (isLoading) {
    return (
      <>
        <div
          className={cn(
            "flex items-center gap-2  py-1.5 text-left text-sm",
            className
          )}
        >
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
      <div
        className={cn(
          "flex items-center gap-2  py-1.5 text-left text-sm",
          className
        )}
      >
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
      </div>
    );
  }
}
