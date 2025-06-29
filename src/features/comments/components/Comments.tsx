"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Loader2 } from "lucide-react";
import type { CommentApiResponse } from "@/types/api/CommentApiResponse";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface CommentSystemProps {
  article: {
    id: string;
    slug: string;
  };
  collapse: boolean;
  articleTitle: string;
}

export default function Comments({
  article,
  articleTitle,
  collapse,
}: CommentSystemProps) {
  const {
    data: comments,
    isLoading,
    error,
  } = useFetchProtectedData<PaginatedApiResponse<CommentApiResponse>>({
    TAG: "comments",
    endpoint: `/comments`,
    params: { "article-slug": article.slug },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    enabled: !!collapse,
  });
  return (
    <Card className=" w-full mx-auto relative">
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
        <div>
          <CommentForm article={article} />
        </div>
        <Separator />
        <div>
          {isLoading ? (
            <div className="flex items-center text-muted-foreground justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading comments...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load comments. Please try again.
            </div>
          ) : comments && comments?.items.length > 0 ? (
            <CommentList comments={comments.items} article={article} />
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
