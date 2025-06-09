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
  <Card className={cn(" h-[400px] md:h-[500px]", className)}>
    <CardHeader className="flex-shrink-0 pb-4">
      <Skeleton className="h-6 w-1/12 " />
      <Skeleton className="h-4 w-1/2 " />
    </CardHeader>
    <CardContent className=" py-2 w-full  flex-1 overflow-hidden">
      <Skeleton className="h-full w-full " />
    </CardContent>
    <CardFooter className="flex justify-end">
      <Skeleton className="h-6 w-1/12 " />
    </CardFooter>
  </Card>
);

export default SkeletonDashboardCard;
