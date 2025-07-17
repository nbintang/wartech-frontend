"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useComments } from "@/features/comments/hooks/useComments";
import CommentForm from "./CommentForm";
import { CommentList } from "./CommentList";
import { MessageCircle, Loader2, ChevronsUpDown, LogIn } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ClientCommentApiResponse } from "@/types/api/CommentApiResponse";
import { useInView } from "react-intersection-observer";
import { useCommentStore } from "../hooks/useCommentStore";
import { useShallow } from "zustand/shallow";
import catchAxiosErrorMessage from "@/helpers/catchAxiosError";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProgress } from "@bprogress/next";

interface CommentsProps {
  articleSlug: string;
  articleId: string;
  articleTitle: string;
}

export default function ClientArticleComments({
  articleSlug,
  articleId,
  articleTitle,
}: CommentsProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    isCollapsed,
    toggleCollapsedComments,
    isSubmittingMainComment,
    optimisticComment,
  } = useCommentStore(
    useShallow((state) => ({
      isCollapsed: state.isCollapsed,
      toggleCollapsedComments: state.toggleCollapsedComments,
      isSubmittingMainComment: state.isSubmittingMainComment,
      optimisticComment: state.optimisticComment,
    }))
  );
  const { isUnauthorized } = useFetchProtectedData<UserProfileApiResponse>({
    TAG: "me",
    endpoint: "/users/me",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useComments(articleSlug, isCollapsed);
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "100px" });
  const loader = useProgress();
  const allComments = useMemo(() => {
    const uniqueCommentIds = new Set<string>();
    const filteredComments: ClientCommentApiResponse[] = [];

    if (
      optimisticComment &&
      !optimisticComment.parentId &&
      optimisticComment.articleSlug === articleSlug
    ) {
      filteredComments.push(optimisticComment);
      uniqueCommentIds.add(optimisticComment.id);
    }

    data?.pages.forEach((page) => {
      page.items?.forEach((commentFromApi) => {
        if (
          commentFromApi &&
          commentFromApi.id &&
          !uniqueCommentIds.has(commentFromApi.id)
        ) {
          uniqueCommentIds.add(commentFromApi.id);

          const clientComment: ClientCommentApiResponse = {
            ...commentFromApi,
            id: commentFromApi.id,
            articleId: articleId,
            articleSlug: articleSlug,
            parentId: null,
          };
          filteredComments.push(clientComment);
        }
      });
    });

    return filteredComments;
  }, [data, optimisticComment, articleSlug, articleId]);

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      isCollapsed &&
      !isFetchingNextPage &&
      !isUnauthorized
    ) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isCollapsed, fetchNextPage, isFetchingNextPage]);

  const handleCommentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["comments", articleSlug] });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["comments", articleSlug] });
    queryClient.invalidateQueries({ queryKey: ["replies"] });
    refetch();
  };
  const redirectToSignIn = () => {
    loader.start();
    router.push("/auth/sign-in");
  };

  const handleToggleComments = async () => {
    await toggleCollapsedComments();
    if (!isCollapsed) {
      refetch();
    }
  };

  return (
    <Card className="w-full mx-auto relative">
      {!isCollapsed && !isError && (
        <div className="bg-gradient-to-b from-transparent to-background rounded-xl pointer-events-none absolute inset-0 z-10" />
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Discussion for "{articleTitle}"
            </p>
          </div>
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button> */}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isCollapsed && isSuccess && (
          <>
            <CommentForm
              articleSlug={articleSlug}
              articleId={articleId}
              articleTitle={articleTitle}
              onSuccess={handleCommentSuccess}
            />
            <Separator />
          </>
        )}

        <div>
          {isLoading && !optimisticComment ? (
            <div className="flex items-center z-20 justify-center text-muted-foreground py-8">
              <Loader2 className="size-6 animate-spin mr-2" />
              <p className="z-20">Loading comments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {catchAxiosErrorMessage(error) ?? "An unknown error occurred."}
              </p>
              {!catchAxiosErrorMessage(error) && (
                <Button onClick={handleRefresh} variant="outline">
                  Try Again
                </Button>
              )}
            </div>
          ) : (
            <>
              {allComments.length > 0 ? (
                <>
                  {!isCollapsed && (
                    <div className="absolute inset-x-0 bottom-10 z-20 flex justify-center">
                      {isUnauthorized ? (
                        <Button
                          onClick={redirectToSignIn}
                          variant="outline"
                          className="mb-4"
                        >
                          Please sign in first
                          <LogIn className="ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleToggleComments}
                          variant="ghost"
                          className="mb-4"
                        >
                          Show comments
                          <ChevronsUpDown className="ml-2" />
                        </Button>
                      )}
                    </div>
                  )}

                  <CommentList
                    comments={allComments}
                    articleSlug={articleSlug}
                    articleId={articleId}
                  />

                  {hasNextPage && isCollapsed && (
                    <div ref={ref} className="flex justify-center mt-6">
                      {isFetchingNextPage ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading more comments...</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          variant="outline"
                          size="sm"
                        >
                          Load more comments
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
