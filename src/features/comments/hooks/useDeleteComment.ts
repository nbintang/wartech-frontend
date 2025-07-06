// src/hooks/useDeleteComment.ts (File Baru)

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CommentApiResponse,
} from "@/types/api/CommentApiResponse";
import { InfiniteData } from "@tanstack/react-query";
import commentsService from "../services";

interface DeleteCommentVariables {
  commentId: string;
  parentId: string | null;
  articleSlug: string;
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DeleteCommentVariables) =>
      commentsService.deleteComment(variables.commentId),

    onMutate: async ({ commentId, parentId, articleSlug }) => {
      const queryKey = parentId
        ? ["replies", parentId]
        : ["comments", articleSlug];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically remove the comment from the UI
      const updater = (oldData: any) => {
        if (!oldData) return;

        // Handle infinite query data (main comments)
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              items: page.items.filter((c: CommentApiResponse) => c.id !== commentId),
              meta: { ...page.meta, totalItems: page.meta.totalItems - 1, itemCount: page.meta.itemCount - 1 }
            })),
          };
        }
        
        // Handle standard query data (replies)
        return {
            ...oldData,
            items: oldData.items.filter((c: CommentApiResponse) => c.id !== commentId),
            meta: { ...oldData.meta, totalItems: oldData.meta.totalItems - 1, itemCount: oldData.meta.itemCount - 1 }
        };
      };

      queryClient.setQueryData(queryKey, updater);

      return { previousData, queryKey };
    },

    onError: (err, variables, context) => {
      toast.error("Gagal menghapus komentar.");
      // Rollback on failure
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },

    onSuccess: () => {
        toast.success("Komentar berhasil dihapus.");
    },

    onSettled: (data, error, variables) => {
      // Refetch both comments and replies to ensure consistency (e.g., childrenCount is updated)
      queryClient.invalidateQueries({ queryKey: ["comments", variables.articleSlug] });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
    },
  });
};