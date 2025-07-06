// src/hooks/likes/useLikeMutation.ts (Diperbaiki)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import { InfiniteData } from "@tanstack/react-query";
import commentsService from "../../services";

interface LikeMutationVariables {
  commentId: string;
  articleSlug: string;
  isLiked: boolean;
}

export const useLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, isLiked }: LikeMutationVariables) => {
      return isLiked
        ? commentsService.unlikeComment(commentId)
        : commentsService.likeComment(commentId);
    },

    onMutate: async ({ commentId, articleSlug, isLiked }) => {
      const currentUserLikeQueryKey = ["currentUserLike", commentId];
      await queryClient.cancelQueries({ queryKey: currentUserLikeQueryKey });
      const previousUserLike = queryClient.getQueryData(
        currentUserLikeQueryKey
      );

      // Optimistically update status 'like'
      queryClient.setQueryData(
        currentUserLikeQueryKey,
        () => (isLiked ? null : { id: "optimistic-like" }) // Set ke null jika unlike, atau objek dummy jika like
      );

      // Updater untuk jumlah 'likes'
      const updater = (comment: CommentApiResponse) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      };

      // Update semua cache yang relevan
      const commentsQueryKey = ["comments", articleSlug];
      queryClient.setQueryData<
        InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>
      >(commentsQueryKey, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map(updater),
          })),
        };
      });
      queryClient
        .getQueriesData<PaginatedDataResultResponse<CommentApiResponse>>({
          queryKey: ["replies"],
        })
        .forEach(([key, data]) => {
          if (data)
            queryClient.setQueryData(key, {
              ...data,
              items: data.items.map(updater),
            });
        });

      return { previousUserLike, currentUserLikeQueryKey };
    },

    onError: (err, variables, context) => {
      toast.error("Gagal memperbarui status suka.");
      // Rollback jika terjadi error
      if (context?.previousUserLike) {
        queryClient.setQueryData(
          context.currentUserLikeQueryKey,
          context.previousUserLike
        );
      }
      // Invalidate semua untuk memastikan konsistensi
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.articleSlug],
      });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
    },

    onSettled: (data, error, variables) => {
      // Selalu refetch semua data relevan untuk sinkronisasi akhir
      queryClient.invalidateQueries({
        queryKey: ["currentUserLike", variables.commentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.articleSlug],
      });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
    },
  });
};
