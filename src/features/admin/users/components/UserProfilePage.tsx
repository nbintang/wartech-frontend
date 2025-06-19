"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { UserProfileApiResponse, UsersApiResponse } from "@/types/api/UserApiResponse";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import UserProfileSkeletonCard from "./UserProfileSkeletonCard";
import useDeleteProtectedData from "@/hooks/hooks-api/useDeleteProtectedData";
import useHandleWarningDialog from "@/hooks/useHandleWarningDialog";

export default function UserProfilePage({ id }: { id: string }) {
  const setOpenDialog = useHandleWarningDialog((state) => state.setOpenDialog);
  const {
    data: user,
    isLoading,
    isError,
    isSuccess,
  } = useFetchProtectedData<UsersApiResponse>({
    endpoint: `/users/${id}`,
    TAG: "users",
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });
  const { mutate } = useDeleteProtectedData({
    TAG: "users",
    endpoint: `/users/${id}`,
    redirect: true,
    redirectUrl: "/admin/dashboard/users",
  });
  const handleDelete = () => {
    setOpenDialog({
      title: `Delete User`,
      description: "Are you sure you want to delete this user?",
      isOpen: true,
      onConfirm: () => mutate(),
    });
  };

  return (
    <div className="container w-full py-6 mx-auto px-4">
      {(isLoading || isError || !user) && <UserProfileSkeletonCard />}
      {isSuccess && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) ?? "N/A"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                {user.verified && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-50"
                  >
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">User ID</Label>
                <Input id="id" value={user.id} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={user.name} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={user.role} disabled />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="created">Created At</Label>
                  <Input
                    id="created"
                    value={format(new Date(user.createdAt), "PPP 'at' p")}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="updated">Last Updated</Label>
                  <Input
                    id="updated"
                    value={format(new Date(user.updatedAt), "PPP 'at' p")}
                    disabled
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {isSuccess && (
        <div className="flex justify-end w-full pt-4">
          <Button variant={"destructive"} onClick={handleDelete}>
            <Trash2Icon className=" h-4 w-4" />
            <p>Delete User {user.name}</p>
          </Button>
        </div>
      )}
    </div>
  );
}
