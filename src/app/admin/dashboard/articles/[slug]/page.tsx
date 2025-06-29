"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleFormSkeleton from "@/features/admin/articles/components/ArticleFormSkeleton";
import UpdateArticleForm from "@/features/admin/articles/components/UpdateArticleForm";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { useCommentStore } from "@/hooks/useCommentStore";
import { ArticlebySlugApiResponse } from "@/types/api/ArticleApiResponse";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import { use, useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CommentApiResponse,
  CommentData,
} from "@/types/api/CommentApiResponse";
import { ChevronsUpDown, MessageSquare } from "lucide-react";
import { CommentItem } from "@/features/admin/root/components/CommentItem";

export default function ArticleBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const commentList = useCommentStore((state) => state.comments);
  const { data: profile } = useFetchProtectedData<UserProfileApiResponse>({
    TAG: "profile",
    endpoint: "/users/profile",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });
  const [collapsed, setCollapsed] = useState(true);
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
  const { data: comments, ...commentsQuery } = useFetchProtectedData<
    PaginatedApiResponse<CommentApiResponse>
  >({
    TAG: "comments",
    endpoint: `/comments`,
    params: { "article-slug": article?.slug },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    enabled: !!article?.slug,
  });
  useEffect(() => {
    if (commentsQuery.isSuccess && comments?.items) {
      useCommentStore.getState().setComments(comments.items);
    }
  }, [commentsQuery.isSuccess, comments]);

  console.log("comments", comments);
  console.log(article);
  return (
    <>
      {isSuccess && article && profile && (
        <Card>
          <CardContent>
            <UpdateArticleForm article={article} profile={profile} />
            <Collapsible open={collapsed} onOpenChange={setCollapsed}>
              <CollapsibleTrigger asChild>
                <Button variant={"outline"} className="mb-4">
                  {collapsed ? "Hide comments" : "Show comments"}
                  <ChevronsUpDown className="ml-2" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="my-3">
                {commentsQuery.isSuccess &&
                comments &&
                comments?.items.length > 0 ? (
                  comments?.items.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} isChild />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    </CardContent>
                  </Card>
                )}
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
