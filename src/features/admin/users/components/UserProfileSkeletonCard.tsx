import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const UserProfileSkeletonCard = () => {
  return (
   <Card className="w-full">
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="size-16  rounded-full " />
            <div className="flex flex-col gap-y-4">
              <Skeleton className="h-6 w-16 " />
              <Skeleton className="h-3 w-32 " />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-1/12 " />
            <Skeleton className="h-6 w-full " />
            <Skeleton className="h-4  w-1/12 " />
            <Skeleton className="h-6 w-full " />
            <Skeleton className="h-4  w-1/12 " />
            <Skeleton className="h-6 w-full " />
            <div className="flex flex-row items-center gap-4 ">
              <Skeleton className="h-6 w-full " />
              <Skeleton className="h-6 w-full " />
            </div>
          </CardContent>
        </Card>
  );
};

export default UserProfileSkeletonCard;
