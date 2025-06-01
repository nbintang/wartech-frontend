"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useFetchProtectedData from "@/hooks/useFetchProtectedData";
import { Button } from "./ui/button";
import Link from "next/link";
import { LoaderCircleIcon } from "lucide-react";
import { UserProfileResponse } from "@/type/userType";
import SignOut from "@/features/auth/signout/components/SignOut";
export default function UserProfile() {
  const { data, isLoading, isSuccess, isUnauthorized } =
    useFetchProtectedData<UserProfileResponse>({
      TAG: "account",
      endpoint: "/users/profile",
    });
  return (
    <>
      {isSuccess && (
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p>{data.email}</p>
          <SignOut />
        </div>
      )}
      {isUnauthorized && (
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      )}
      {isLoading && <LoaderCircleIcon className="animate-spin" />}
    </>
  );
}
