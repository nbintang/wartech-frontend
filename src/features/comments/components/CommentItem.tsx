"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCommentStore } from "../hooks/useCommentStore";
import { useReplies } from "../hooks/useReplies";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  MessageCircle,
  Loader2,
} from "lucide-react";
import CommentForm from "./CommentForm";
import { CommentList } from "./CommentList";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";

interface CommentItemProps {
  comment: CommentApiResponse;
  articleSlug: string;
  articleId: string;
  depth?: number;
}

export default function CommentItem({
  comment,
  articleSlug,
  articleId,
  depth = 0,
}: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { isExpanded, toggleExpanded, replyingTo, setReplyingTo } =
    useCommentStore();

  const expanded = isExpanded(comment.id);
  const showingReplyForm = replyingTo === comment.id;
  const maxDepth = 6;

  const {
    data: replies,
    isLoading: repliesLoading,
    isSuccess: repliesSuccess,
    refetch: refetchReplies,
  } = useReplies(comment.id, expanded);

  const handleToggleExpand = () => {
    toggleExpanded(comment.id);
    if (!expanded) {
      refetchReplies();
    }
  };

  const handleReply = () => {
    setReplyingTo(showingReplyForm ? null : comment.id);
    if (!expanded && !showingReplyForm) {
      toggleExpanded(comment.id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className={depth > 0 ? "ml-6 border-l-2 border-muted pl-4" : ""}>
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.image || undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(comment.user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{comment.user.name}</span>
                {comment.isEdited && (
                  <Badge variant="secondary" className="text-xs">
                    edited
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: comment.content }}
                className="prose dark:prose-invert my-2 prose-sm"
              />

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 ${isLiked ? "text-red-500" : ""}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`}
                  />
                  {comment.likes + (isLiked ? 1 : 0)}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={handleReply}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Reply
                </Button>

                {comment.childrenCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={handleToggleExpand}
                  >
                    {expanded ? (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                    {comment.childrenCount}{" "}
                    {comment.childrenCount === 1 ? "reply" : "replies"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Reply Form */}
          {showingReplyForm && (
            <div className="mt-3 pl-11">
              <CommentForm
                articleId={articleId}
                articleSlug={articleSlug}
                parentId={comment.id}
                placeholder={`Reply to ${comment.user.name}...`}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nested Replies */}
      {expanded && comment.childrenCount > 0 && (
        <div className={depth < maxDepth ? "" : "ml-0"}>
          {repliesLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : repliesSuccess && replies?.items?.length > 0 ? (
            <CommentList
              comments={replies.items}
              articleSlug={articleSlug}
              articleId={articleId}
              depth={depth < maxDepth ? depth + 1 : depth}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
