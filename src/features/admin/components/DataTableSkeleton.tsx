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
const DataTableSkeleton = ({ className }: { className?: string }) => (
  <>
    <CardHeader className="flex flex-row items-center justify-between mb-2 gap-4 px-2">
      <Skeleton className="h-7 w-1/2 md:w-1/6 " />
      <Skeleton className="h-7 w-1/3  md:w-1/12 " />
    </CardHeader>
    <CardContent className={cn(" flex-1 px-2 ", className)}>
      <Skeleton className="h-full w-full " />
    </CardContent>
    <CardFooter className="flex justify-between px-2 gap-3 flex-col md:flex-row mt-3">
      <Skeleton className="h-6 w-1/2 md:w-1/12 " />
      <Skeleton className="h-6 w-1/3 md:w-1/12 " />
    </CardFooter>
  </>
);

export default DataTableSkeleton;
