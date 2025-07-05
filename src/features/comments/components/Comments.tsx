"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useComments } from "@/features/comments/hooks/useComments";
import CommentForm from "./CommentForm";
import { CommentList } from "./CommentList";
import {
  MessageCircle,
  Loader2,
  RefreshCw,
  CheckCircle,
  ChevronsUpDown,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import { useInView } from "react-intersection-observer";
import { useCommentStore } from "../hooks/useCommentStore";
import { useShallow } from "zustand/shallow";

interface CommentsProps {
  articleSlug: string;
  articleId: string;
  articleTitle: string;
}

export default function Comments({
  articleSlug,
  articleId,
  articleTitle,
}: CommentsProps) {
  const queryClient = useQueryClient();
  const { isCollapsed, toggleCollapsedComments } = useCommentStore(
    useShallow((state) => ({
      isCollapsed: state.isCollapsed,
      toggleCollapsedComments: state.toggleCollapsedComments,
    }))
  );
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useComments(articleSlug, isCollapsed);
  const { ref, inView } = useInView({ threshold: 1, rootMargin: "100px" });

  const allComments = useMemo(() => {
    const uniqueCommentIds = new Set<string>();
    const filteredComments: CommentApiResponse[] = [];

    data?.pages.forEach((page) => {
      page.items?.forEach((data) => {
        if (!uniqueCommentIds.has(data.id)) {
          uniqueCommentIds.add(data.id);
          filteredComments.push(data);
        }
      });
    });
    return filteredComments;
  }, [data]);

  const totalComments = allComments.length;

  useEffect(() => {
    if (inView && hasNextPage && isCollapsed) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isCollapsed, fetchNextPage]);
  const handleCommentSuccess = () => {
    // Scroll to top to show the new comment
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    // Invalidate all related queries for a fresh start
    queryClient.invalidateQueries({ queryKey: ["comments", articleSlug] });
    queryClient.invalidateQueries({ queryKey: ["replies"] });
    refetch();
  };

  return (
    <Card className="w-full  mx-auto relative">
      {!isCollapsed && (
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isCollapsed && (
          <>
            <CommentForm articleSlug={articleSlug} articleId={articleId} />
            <Separator />
          </>
        )}

        {/* Comments List */}
        <div>
          {isLoading ? (
            <div className="flex items-center z-20 justify-center  text-muted-foreground  py-8">
              <Loader2 className="size-6 animate-spin mr-2" />
              <p className=" z-20"> Loading comments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Failed to load comments. Please try again.
              </p>
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
            </div>
          ) : allComments.length > 0 ? (
            <>
              {!isCollapsed && (
                <div className="absolute inset-x-0 bottom-10 z-20 flex justify-center">
                  <Button
                    onClick={() =>
                      Promise.all([toggleCollapsedComments(), fetchNextPage()])
                    }
                    variant="ghost"
                    className="mb-4"
                  >
                    {isCollapsed ? "Hide comments" : "Show comments"}
                    <ChevronsUpDown className="ml-2" />
                  </Button>
                </div>
              )}
              <CommentList
                comments={allComments}
                articleSlug={articleSlug}
                articleId={articleId}
              />

              {/* Infinite Scroll Trigger */}
              {hasNextPage && isCollapsed && (
                <div ref={ref} className="flex justify-center mt-4">
                  {isFetchingNextPage ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <Button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      variant="ghost"
                    >
                      Load more comments
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
