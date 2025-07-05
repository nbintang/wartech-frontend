"use client";
import { useState, useMemo } from "react";
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
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import CommentForm from "./CommentForm";
import { CommentList } from "./CommentList";
import { ClientCommentApiResponse, CommentApiResponse } from "@/types/api/CommentApiResponse";
import { useShallow } from "zustand/shallow";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface CommentItemProps {
  comment: CommentApiResponse;
  articleSlug: string;
  articleId: string;
  depth?: number;
  articleTitle: string; // Pastikan ini ada di sini jika digunakan di CommentForm
}

export default function CommentItem({
  comment,
  articleSlug,
  articleTitle, // Gunakan ini
  articleId,
  depth = 0,
}: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false);
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
      optimisticComment: state.optimisticComment, // Perbaikan typo di sini
    }))
  );
  const expanded = useCommentStore((state) => state.isExpanded(comment.id));

  const showingReplyForm = replyingTo === comment.id;
  const isSubmittingReplyToThisComment =
    isSubmitting && submittingParentId === comment.id;
  const maxDepth = 6;

  // useReplies hanya di-enable ketika comment expanded ATAU sedang ada optimistic comment untuk parent ini
  // Ini mencegah fetch yang tidak perlu jika tidak ada optimistic comment dan tidak expanded
const shouldFetchReplies = expanded || (optimisticComment?.parentId === comment.id);
  const {
    data: replies,
    isLoading: repliesLoading,
    isSuccess: repliesSuccess,
    refetch: refetchReplies,
  } = useReplies(comment.id, shouldFetchReplies); // Menggunakan shouldFetchReplies


  const allReplies = useMemo(() => {
    const combinedReplies: ClientCommentApiResponse[] = [];

    // Tambahkan optimistic comment jika sesuai dan belum ada di replies API
    if (optimisticComment && optimisticComment.parentId === comment.id && optimisticComment.articleSlug === articleSlug) {
      const isOptimisticAlreadyInReplies = replies?.items?.some(
        (reply) => reply.id === optimisticComment.id
      );
      if (!isOptimisticAlreadyInReplies) {
        combinedReplies.push(optimisticComment);
      }
    }

    // Tambahkan replies dari API
 replies?.items?.forEach((replyFromApi) => {
  const clientComment: ClientCommentApiResponse = {
    ...replyFromApi,
    articleId: articleId,
    articleSlug: articleSlug,
  };
  combinedReplies.push(clientComment);
});

    return combinedReplies;
  }, [replies, optimisticComment, comment.id, articleId, articleSlug]);

  // Hitung childrenCount yang ditampilkan secara optimistik
  const displayedChildrenCount = useMemo(() => {
    let count = comment.childrenCount;
    // Tambahkan 1 jika ada optimistic comment yang belum difetch oleh useReplies
    if (optimisticComment && optimisticComment.parentId === comment.id && optimisticComment.articleSlug === articleSlug) {
      const isOptimisticAlreadyFetched = replies?.items?.some(
        (reply) => reply.id === optimisticComment.id
      );
      if (!isOptimisticAlreadyFetched) {
        count += 1;
      }
    }
    return count;
  }, [comment.childrenCount, optimisticComment, comment.id, articleSlug, replies?.items]);


  const handleToggleExpand = () => {
    toggleExpanded(comment.id);
    // Hanya refetch jika kita akan menampilkan dan replies belum berhasil difetch,
    // atau jika ada optimistic comment yang perlu direplace dengan data asli
    if (!expanded && (!repliesSuccess || allReplies.length === 0)) { // Jika belum expanded dan belum ada replies
      refetchReplies();
    }
  };

  const handleReply = () => {
    setReplyingTo(showingReplyForm ? null : comment.id);
    // Jika user mengklik reply dan komentar belum expanded, expand otomatis
    if (!expanded && !showingReplyForm) {
      toggleExpanded(comment.id);
      // refetchReplies(); // Tidak perlu refetch di sini, optimistic update sudah cukup
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

                {(displayedChildrenCount > 0 || isSubmittingReplyToThisComment || (repliesSuccess && allReplies.length > 0)) && (
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem variant="destructive" >
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      {(expanded || showingReplyForm || isSubmittingReplyToThisComment) && ( // Render bagian ini jika expanded, form aktif, atau sedang submit balasan
        <div className={depth < maxDepth ? "" : "ml-0"}>
          {repliesLoading && allReplies.length === 0 ? ( // Tampilkan loader hanya jika belum ada balasan (termasuk optimistik)
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Loading replies...</p>
            </div>
          ) : allReplies.length > 0 ? (
            <CommentList
              comments={allReplies}
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