import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const ArticleFormSkeleton = () => (
  <Card className="w-full">
    <CardContent className="space-y-6">
      <div className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/5 md:w-1/7 " />
          <Skeleton className="h-4 w-full md:w-1/5 " />
        </div>
        <Skeleton className="h-6 w-full " />
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-6  w-1/5 md:w-1/7" />
          <Skeleton className="h-4  w-full md:w-1/5 " />
        </div>
        <Skeleton className="min-h-72 w-full rounded-2xl " />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/5 md:w-1/7 " />
            <Skeleton className="h-4  w-full md:w-1/3" />
          </div>
          <Skeleton className="h-6 w-full " />
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/5 md:w-1/7 " />
            <Skeleton className="h-4 w-full md:w-1/3 " />
          </div>
          <Skeleton className="h-6 w-full " />
        </div>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/5 md:w-1/7" />
          <Skeleton className="h-4 w-full md:w-1/5 " />
        </div>
        <Skeleton className="min-h-96 w-full " />
      </div>
    </CardContent>
  </Card>
);

export default ArticleFormSkeleton;
