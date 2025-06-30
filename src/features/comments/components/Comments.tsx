"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Loader2, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

import { useCommentStore } from "@/hooks/store/useCommentStore";
import { useShallow } from "zustand/shallow";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axiosInstance";
import type { CommentApiResponse } from "@/types/api/CommentApiResponse";
import catchAxiosError from "@/helpers/catchAxiosError";

interface CommentSystemProps {
  article: {
    id: string;
    slug: string;
  };
  articleTitle: string;
}

const PREVIEW_COUNT = 1;
const LOAD_MORE_COUNT = 2;

export default function Comments({
  article,
  articleTitle,
}: CommentSystemProps) {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView({ threshold: 1, rootMargin: "100px" });

  const { isCollapsed, toggleCollapsedComments } = useCommentStore(
    useShallow((state) => ({
      isCollapsed: state.isCollapsed,
      toggleCollapsedComments: state.toggleCollapsedComments,
    }))
  );

  const {
    data: comments,
    isLoading,
    isSuccess,
    isError,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<
    PaginatedDataResultResponse<CommentApiResponse>, 
    Error
  >({
    queryKey: ["comments", article.slug, isCollapsed ? "expanded" : "collapsed"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get<
        ApiResponse<PaginatedDataResultResponse<CommentApiResponse>> // <--- Ubah CommentApiResponse[] menjadi CommentApiResponse
      >("/protected/comments", {
        params: {
          "article-slug": article.slug,
          page: pageParam,
          limit: isCollapsed ? LOAD_MORE_COUNT : PREVIEW_COUNT,
        },
      });
      return res.data.data!;
    },
    initialPageParam: 1,
    getNextPageParam: ({ meta }) =>
      meta.currentPage < meta.totalPages ? meta.currentPage + 1 : undefined,
  });

  const allComments = useMemo(() => {
    const uniqueCommentIds = new Set<string>();
    const filteredComments: CommentApiResponse[] = [];

    comments?.pages.forEach((page) => {
      page.items?.forEach((comment) => {
        if (!uniqueCommentIds.has(comment.id)) {
          uniqueCommentIds.add(comment.id);
          filteredComments.push(comment);
        }
      });
    });
    return filteredComments;
  }, [comments]); 
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["comments", article.id, "expanded"],
    });
  }, [isCollapsed]);

  useEffect(() => {
    if (inView && hasNextPage && isCollapsed) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isCollapsed, fetchNextPage]);

  return (
    <div className="w-full">
      <Card className="w-full mx-auto relative">
        {!isCollapsed  && (
          <>
            <div className="bg-gradient-to-b from-transparent to-background rounded-xl pointer-events-none absolute inset-0 z-10" />
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
          </>
        )}

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Discussion for "{articleTitle}"
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {isCollapsed && (
            <>
              <CommentForm article={article} />
              <Separator />
            </>
          )}

          {isLoading && <CommentSkeleton />}
          {isError && (
            <ErrorState
              message={catchAxiosError(error) ?? "An unknown error occurred."}
            />
          )}
          {isSuccess && allComments.length > 0 && (
            <>
              <CommentList comments={allComments} article={article} />
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton Loader
function CommentSkeleton() {
  return (
    <Card>
      <CardContent className="flex gap-4 my-4 items-start">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex flex-col flex-1 gap-2">
          <Skeleton className="h-3 max-w-[100px]" />
          <Skeleton className="h-2 max-w-sm" />
          <Skeleton className="h-2 max-w-md" />
          <Skeleton className="h-2 max-w-xs" />
        </div>
      </CardContent>
    </Card>
  );
}
// Error State
function ErrorState({ message }: { message?: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {message || "Failed to load comments. Please try again."}
    </div>
  );
}
