"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import UpdateArticleForm from "@/features/admin/articles/components/UpdateArticleForm";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { ArticlebySlugApiResponse } from "@/types/api/ArticleApiResponse";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import { use } from "react";

export default function ArticleBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: profile } = useFetchProtectedData<UserProfileApiResponse>({
    TAG: "profile",
    endpoint: "/users/profile",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });

  const {
    data: article,
    isLoading,
    isError,
    isSuccess,
  } = useFetchProtectedData<ArticlebySlugApiResponse>({
    TAG: "articles",
    endpoint: `/articles/${slug}`,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });
  console.log(article);

  return (
    <>
      {isSuccess && article && profile && (
        <Card>
          <CardContent>
            <UpdateArticleForm article={article} profile={profile} />
          </CardContent>
        </Card>
      )}
      {isLoading && (
        <Card>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/7 " />
                <Skeleton className="h-4 w-1/5 " />
              </div>
              <Skeleton className="h-6 w-full " />
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/7 " />
                <Skeleton className="h-4 w-1/5 " />
              </div>
              <Skeleton className="min-h-80 w-full " />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-1/7 " />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-6 w-full " />
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-1/7 " />
                  <Skeleton className="h-4 w-1/3 " />
                </div>
                <Skeleton className="h-6 w-full " />
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/7 " />
                <Skeleton className="h-4 w-1/5 " />
              </div>
              <Skeleton className="min-h-96 w-full " />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
