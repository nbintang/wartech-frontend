"use client";
import { useMemo, useState } from "react";
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
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import CommentForm from "./CommentForm";
import { CommentList } from "./CommentList";
import {
  ClientCommentApiResponse,
  CommentApiResponse,
} from "@/types/api/CommentApiResponse";
import { useShallow } from "zustand/shallow";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useCurrentUserLikeComment } from "../hooks/likes/useCurrentUserLikeComment";
import { useLikeMutation } from "../hooks/likes/useLikeComment";
import { useDeleteComment } from "../hooks/useDeleteComment";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import useHandleWarningDialog from "@/hooks/store/useHandleWarningDialog";
interface CommentItemProps {
  comment: ClientCommentApiResponse;
  articleSlug: string;
  articleId: string;
  depth?: number;
  articleTitle: string;
}

export default function CommentItem({
  comment,
  articleSlug,
  articleTitle,
  articleId,
  depth = 0,
}: CommentItemProps) {
  const {
    toggleExpanded,
    replyingTo,
    setReplyingTo,
    submittingParentId,
    isSubmitting,
    optimisticComment,
  } = useCommentStore(
    useShallow((state) => ({
      toggleExpanded: state.toggleExpanded,
      replyingTo: state.replyingTo,
      setReplyingTo: state.setReplyingTo,
      submittingParentId: state.submittingParentId,
      isSubmitting: state.isSubmitting,
      optimisticComment: state.optimisticComment,
    }))
  );
  const expanded = useCommentStore((state) => state.isExpanded(comment.id));
  const showingReplyForm = replyingTo === comment.id;
  const isSubmittingReplyToThisComment =
    isSubmitting && submittingParentId === comment.id;
  const maxDepth = 6;
  const {
    data: replies,
    isLoading: repliesLoading,
    refetch: refetchReplies,
  } = useReplies(comment.id, expanded);
  const setOpenDialog = useHandleWarningDialog((state) => state.setOpenDialog);
  const { mutate: toggleLike, isPending: isLikePending } = useLikeMutation();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  const { data: currentUser } = useFetchProtectedData<UserProfileApiResponse>({
    TAG: "me",
    endpoint: "/users/me",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });
  const canDelete = currentUser?.id === comment.user.id;

  const { data: currentUserLike } = useCurrentUserLikeComment(comment.id);
  const isLiked = !!currentUserLike;

  const allReplies = useMemo(() => replies?.items || [], [replies]);
  const displayedChildrenCount =
    replies?.meta?.totalItems ?? comment.childrenCount;
  const handleToggleExpand = () => {
    toggleExpanded(comment.id);
  };
  const handleReply = () => {
    setReplyingTo(showingReplyForm ? null : comment.id);
    if (!expanded && !showingReplyForm) {
      toggleExpanded(comment.id);
    }
  };
  const handleDelete = () => {
    if (isDeleting) return;
    setOpenDialog({
      title: `Delete Comment`,
      description: "Are you sure you want to delete this comment? ",
      isOpen: true,
      onConfirm: () =>
        deleteComment({
          commentId: comment.id,
          parentId: comment.parentId ?? null, // Pastikan `comment` punya properti `parentId`
          articleSlug: articleSlug,
        }),
    });
  };
  const handleLikeClick = () => {
    if (isLikePending) return;
    toggleLike({
      commentId: comment.id,
      articleSlug: articleSlug,
      isLiked: isLiked,
    });
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
                {(comment as ClientCommentApiResponse).isOptimistic && (
                  <Badge variant="outline" className="text-xs">
                    Sending...
                  </Badge>
                )}
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
                  onClick={handleLikeClick}
                  disabled={isLikePending}
                >
                  <Heart
                    className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`}
                  />
                  {comment.likes}
                </Button>

                {!(comment as ClientCommentApiResponse).isOptimistic && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={handleReply}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                )}

                {displayedChildrenCount > 0 && (
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
                    {displayedChildrenCount}{" "}
                    {displayedChildrenCount === 1 ? "reply" : "replies"}
                  </Button>
                )}
              </div>
            </div>
            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={isDeleting}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleDelete} // <-- Panggil handler
                    disabled={isDeleting} // <-- Disable saat proses
                  >
                    <Trash2 className="size-4 mr-2" />
                    {isDeleting ? "Menghapus..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {showingReplyForm && (
            <div className="mt-3 pl-11">
              <CommentForm
                articleTitle={articleTitle}
                articleId={articleId}
                articleSlug={articleSlug}
                parentId={comment.id}
                placeholder={`Reply to ${comment.user.name}...`}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {expanded && (
        <div className={depth < maxDepth ? "" : "ml-0"}>
          {repliesLoading && allReplies.length === 0 ? (
            <div className="flex items-center justify-center text-muted-foreground py-8">
              <Loader2 className="size-6 animate-spin mr-2" />
              <p>Loading Replies...</p>
            </div>
          ) : allReplies.length > 0 ? (
            <CommentList
              comments={allReplies as ClientCommentApiResponse[]}
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
