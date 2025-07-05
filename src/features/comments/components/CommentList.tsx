"use client";

import CommentItem from "./CommentItem";
import type { CommentApiResponse } from "@/types/api/CommentApiResponse";

interface CommentListProps {
  comments: CommentApiResponse[];
  articleSlug: string;
  articleId: string;
  depth?: number;
}

export function CommentList({
  comments,
  articleSlug,
  articleId,
  depth = 0,
}: CommentListProps) {
  if (!comments || comments.length === 0) return null;
  return (
    <div className="space-y-0">
      {comments.map((comment) => (
        <CommentItem
          articleTitle={comment.article.title}
          key={comment.id}
          comment={comment}
          articleSlug={articleSlug}
          articleId={articleId}
          depth={depth}
        />
      ))}
    </div>
  );
}
