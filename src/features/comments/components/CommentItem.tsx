"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCommentStore } from "@/hooks/store/useCommentStore";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Edit,
  Flag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface CommentItemProps {
  comment: CommentApiResponse;
  article: {
    id: string;
    slug: string;
  };
  depth?: number;
}

export default function CommentItem({
  comment,
  article,
  depth = 0,
}: CommentItemProps) {
  const { isExpanded, toggleExpanded, replyingTo, setReplyingTo } =
    useCommentStore();
  const [isLiked, setIsLiked] = useState(false);

  const expanded = isExpanded(comment.id);
  const showingReplyForm = replyingTo === comment.id;

  const { data: replies, isLoading: repliesLoading } = useFetchProtectedData<
    PaginatedApiResponse<CommentApiResponse>
  >({
    TAG: "comments",
    endpoint: `/comments/${comment.id}/replies`,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    enabled: expanded,
  });
  const totalComments = replies?.items.length || 0;
  const handleToggleExpand = () => {
    if (comment.childrenCount > 0) {
      toggleExpanded(comment.id);
    }
  };

  const handleReply = () => {
    setReplyingTo(showingReplyForm ? null : comment.id);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically call an API to like/unlike the comment
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const maxDepth = 6;
  const shouldNest = depth < maxDepth;

  return (
    <div className={`${depth > 0 ? "ml-6 border-l-2 border-muted pl-4" : ""}`}>
      <Card className="mb-3">
        <CardContent className="p-4">
          {/* Comment Header */}
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

              {/* Comment Content */}
              <div dangerouslySetInnerHTML={{ __html: comment.content }} className="prose dark:prose-invert"/>

              {/* Comment Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 ${isLiked ? "text-red-500" : ""}`}
                  onClick={handleLike}
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Reply Form */}
          {showingReplyForm && (
            <div className="mt-3 pl-11">
              <CommentForm
                article={article}
                parentId={comment.id}
                placeholder={`Reply to ${comment.user.name}...`}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nested Replies */}
      {expanded && comment.childrenCount > 0 && (
        <div className={shouldNest ? "" : "ml-0"}>
          {repliesLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : replies && replies.items.length > 0 ? (
            <CommentList
              comments={replies.items}
              article={article}
              depth={shouldNest ? depth + 1 : depth}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
