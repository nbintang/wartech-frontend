"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleFormSkeleton from "@/features/admin/articles/components/ArticleFormSkeleton";
import UpdateArticleForm from "@/features/admin/articles/components/UpdateArticleForm";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { ArticlebySlugApiResponse } from "@/types/api/ArticleApiResponse";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import { use, useEffect, useState } from "react";

import Comments from "@/features/comments/components/Comments";

export default function ArticleBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: profile } = useFetchProtectedData<UserProfileApiResponse>({
    TAG: "me",
    endpoint: "/users/me",
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
    TAG: ["article", slug],
    endpoint: `/articles/${slug}`,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });

  return (
    <>
      {isSuccess && article && profile && (
        <Card>
          <CardContent>
            <UpdateArticleForm article={article} profile={profile} />
          </CardContent>

          <CardFooter className="relative">
            <Comments
              articleId={article.id}
              articleSlug={article.slug}
              articleTitle={article.title}
            />
          </CardFooter>
        </Card>
      )}
      {isLoading && <ArticleFormSkeleton />}
    </>
  );
}
