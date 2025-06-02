"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useFetchProtectedData from "@/hooks/useFetchProtectedData";
import { CheckCircle2, LoaderCircleIcon } from "lucide-react";
import { UserProfileResponse } from "@/type/userType";
export default function UserProfile() {
  const { data, isLoading, isSuccess, isUnauthorized } =
    useFetchProtectedData<UserProfileResponse>({
      TAG: "account",
      endpoint: "/users/profile",
    });

  return (
    <>
      {isSuccess && (
        <div className="flex  gap-2">
          <Avatar className="size-11">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
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
        </div>
      )}
    </>
  );
}
