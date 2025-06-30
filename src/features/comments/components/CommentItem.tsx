"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCommentStore } from "@/features/comments/hooks/useCommentStore";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Edit,
  Flag,
  Trash2,
  Loader2,
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
import { CommentList } from "./CommentList";

import { useShallow } from "zustand/shallow";
import { useReplies } from "../hooks/useReplies";

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
  const {
    isExpanded,
    toggleExpanded,
    replyingTo,
    setReplyingTo,
    isSubmittingReply,
    setLoadingReplies,
    isLoadingReplies,
  } = useCommentStore(
    useShallow((state) => ({
      isExpanded: state.isExpanded,
      toggleExpanded: state.toggleExpanded,
      replyingTo: state.replyingTo,
      setReplyingTo: state.setReplyingTo,
      isSubmittingReply: state.isSubmittingReply,
      setLoadingReplies: state.setLoadingReplies,
      isLoadingReplies: state.isLoadingReplies,
    }))
  );
  const [isLiked, setIsLiked] = useState(false);

  const expanded = isExpanded(comment.id);
  const showingReplyForm = replyingTo === comment.id;
  const submittingReply = isSubmittingReply(comment.id);
  const loadingReplies = isLoadingReplies(comment.id);
  const {
    data: replies,
    isLoading: repliesLoading,
    error: repliesError,
    refetch: refetchReplies,
  } = useReplies(comment.id, expanded);

  useEffect(() => {
    setLoadingReplies(comment.id, repliesLoading);
  }, [repliesLoading, comment.id, setLoadingReplies]);

  // Debug logging
  useEffect(() => {
    if (expanded) {
      // Changed condition to just expanded
      console.log(`Comment ${comment.id} expanded:`, {
        expanded,
        childrenCount: comment.childrenCount,
        repliesLoading,
        repliesData: replies,
        repliesError,
      });
    }
  }, [
    expanded,
    comment.childrenCount, // Keep for context
    repliesLoading,
    replies,
    repliesError,
    comment.id,
  ]);

  const handleToggleExpand = async () => {
    toggleExpanded(comment.id); 
    if (!expanded && (!replies || replies.items.length === 0)) {
      refetchReplies();
    }
  };

  const handleReply = () => {
    setReplyingTo(showingReplyForm ? null : comment.id);
    if (!expanded) {
      toggleExpanded(comment.id);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically call an API to like/unlike the comment
  };

  const handleReplySuccess = () => {
    // Auto-expand to show the new reply if not already expanded
    // This part should still work as before, but the optimistic update in useCreateComment
    // will now correctly place the comment into the cache for useReplies.
    if (!expanded) {
      toggleExpanded(comment.id);
    }
    // Refetch replies to ensure we have the latest data (after optimistic is replaced)
    setTimeout(() => {
      refetchReplies();
    }, 100);
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

  // MODIFIED: The rendering condition for nested replies.
  // Now, we display replies if expanded AND (there are server-side children OR there are optimistic items).
  const shouldShowRepliesList =
    expanded &&
    (comment.childrenCount > 0 || (replies?.items && replies.items.length > 0));
 const safeLikes = typeof comment.likes === 'number' && !isNaN(comment.likes) ? comment.likes : 0;
  const safeChildrenCount = typeof comment.childrenCount === 'number' && !isNaN(comment.childrenCount) ? comment.childrenCount : 0;
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

              <div
                dangerouslySetInnerHTML={{ __html: comment.content }}
                className="prose dark:prose-invert my-2 prose-sm md:prose-base"
              />

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
                  {safeLikes + (isLiked ? 1 : 0)}{" "} {/* Gunakan safeLikes di sini */}
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
                {safeChildrenCount > 0 || repliesLoading ? (
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
                    {safeChildrenCount}{" "} {/* Gunakan safeChildrenCount di sini */}
                    {safeChildrenCount === 1 ? "reply" : "replies"}
                  </Button>
                ) : null}{" "}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="size-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply Form */}
          {(showingReplyForm || submittingReply) && (
            <div className="mt-3 pl-11">
              <CommentForm
                articleId={articleId}
                articleSlug={articleSlug}
                parentId={comment.id}
                placeholder={`Reply to ${comment.user.name}...`}
                // onReplySuccess={handleReplySuccess} // You might want to pass this down if CommentForm needs to know about successful reply
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nested Replies */}
      {shouldShowRepliesList && ( // <-- Use the new consolidated condition
        <div className={shouldNest ? "" : "ml-0"}>
          {repliesLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : replies?.items && replies.items.length > 0 ? (
            <CommentList
              comments={replies.items}
              articleSlug={articleSlug}
              articleId={articleId}
              depth={shouldNest ? depth + 1 : depth}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
