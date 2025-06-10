import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
const SkeletonDashboardCard = ({ className }: { className?: string }) => (
  <>
    <CardHeader className="flex flex-row items-center justify-between mb-2 gap-4">
      <Skeleton className="h-7 w-1/6 " />
      <Skeleton className="h-7 w-1/12 " />
    </CardHeader>
    <CardContent className={cn(" w-full  flex-1 ", className)}>
      <Skeleton className="h-full w-full " />
    </CardContent>
    <CardFooter className="flex justify-between mt-3">
      <Skeleton className="h-6 w-1/12 " />
      <Skeleton className="h-6 w-1/12 " />
    </CardFooter>
  </>
);

export default SkeletonDashboardCard;
