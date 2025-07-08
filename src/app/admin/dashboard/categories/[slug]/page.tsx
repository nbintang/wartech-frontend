"use client";
import { use } from "react";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CategoryDetailApiResponse } from "@/types/api/CategoryApiResponse";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function CategoryBySlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const {
    data: category,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useFetchProtectedData<CategoryDetailApiResponse>({
    TAG: ["category", slug],
    endpoint: `/categories/${slug}`,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });
  if (isError) return <p>{error?.message}</p>;
  if (isLoading || !isSuccess) {
    return <CategoryDetailSkeleton />;
  }
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Category Details</CardTitle>
        <CardDescription>Manage the details of your category.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Category Name</Label>
            <p className="text-lg font-medium">{category.name}</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Created At</Label>
              <Badge variant="outline" className="w-fit">
                {format(new Date(category.createdAt), "PPP p")}
              </Badge>
            </div>
            <div className="grid gap-2">
              <Label>Last Updated</Label>
              <Badge variant="outline" className="w-fit">
                {format(new Date(category.updatedAt), "PPP p")}
              </Badge>
            </div>
          </div>

          <div className="flex justify-end gap-2"></div>
        </div>

        {category.articles && category.articles.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-semibold mb-4">
              Articles in this Category ({category.articles.length})
            </h3>
            <div className="grid gap-4">
              {category.articles.map((article) => (
                <Card
                  key={article.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4"
                >
                  <div className="rounded-md overflow-hidden  object-cover aspect-square ">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={100}
                      height={100}
                      className=" object-cover w-full h-full flex-shrink-0"
                    />
                  </div>
                  <div className="grid gap-1 flex-1">
                    <h4 className="font-medium">{article.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.slug}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge
                        variant={
                          article.status === "PUBLISHED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {article.status}
                      </Badge>
                      {article.publishedAt && (
                        <span className="text-muted-foreground">
                          Published:{" "}
                          {format(new Date(article.publishedAt), "PPP")}
                        </span>
                      )}
                      {article.author && (
                        <span className="text-muted-foreground flex items-center gap-1">
                          {article.author.image && (
                            <Image
                              src={article.author.image || "/placeholder.svg"}
                              alt={article.author.name}
                              width={16}
                              height={16}
                              className="rounded-full"
                            />
                          )}
                          By {article.author.name}
                        </span>
                      )}
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/dashboard/articles/${article.slug}`}>
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
function CategoryDetailSkeleton() {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-full" />
        </div>

        <div className="grid gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        {/* Simulate 3 article cards */}
        <div className="pt-6 border-t mt-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx} className="flex items-center flex-row gap-4 p-4">
                <Skeleton className="h-24 w-24 rounded-md" />
                <div className="flex-1 grid gap-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
