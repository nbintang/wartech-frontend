import React from "react";
import UserProfile from "./UserProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LockIcon, LogOutIcon, UserIcon } from "lucide-react";
import useSignOut from "@/hooks/useSignOut";
import { UserProfileApiResponse } from "@/types/api/userApiResponse";
export default function PublicUserProfile(dataProps: {
  isLoading?: boolean;
  isSuccess?: boolean;
  data?: UserProfileApiResponse;
}) {
  const { mutate } = useSignOut();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <UserProfile {...dataProps}  />
        
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" />
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LockIcon className="mr-2 h-4 w-4" />
          Change Password
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={() => mutate()}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
