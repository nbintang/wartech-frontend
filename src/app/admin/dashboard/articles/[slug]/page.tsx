"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleFormSkeleton from "@/features/admin/articles/components/ArticleFormSkeleton";
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
      {isLoading && <ArticleFormSkeleton />}
    </>
  );
}
