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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, MessageSquare } from "lucide-react";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import { CommentItem } from "@/features/admin/root/components/CommentItem";
import Comments from "@/features/comments/components/Comments";

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
  const [collapsed, setCollapsed] = useState(false);
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

  return (
    <>
      {isSuccess && article && profile && (
        <Card>
          <CardContent>
            <UpdateArticleForm article={article} profile={profile} />
            <Collapsible
              className=" mt-3"
              open={collapsed}
              onOpenChange={setCollapsed}
            >
              <CollapsibleTrigger asChild>
                <Button variant={"outline"} className="mb-4">
                  {collapsed ? "Hide comments" : "Show comments"}
                  <ChevronsUpDown className="ml-2" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="my-3">
                <Comments
                  collapse={collapsed}
                  article={{ id: article.id, slug: article.slug }}
                  articleTitle={article.title}
                />
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      )}
      {}
      {isLoading && <ArticleFormSkeleton />}
    </>
  );
}
