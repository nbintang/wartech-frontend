// 3. Custom Hook for Comment Creation (useCreateComment.ts)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import commentService from "../services";
import { useCommentStore } from "./useCommentStore";
import { useShallow } from "zustand/shallow";

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { setReplyingTo,setIsSubmitting } = useCommentStore(useShallow(state => ({
    setReplyingTo: state.setReplyingTo,
    setIsSubmitting: state.setIsSubmitting
  })));

  return useMutation({
    mutationFn: commentService.createComment,
    onMutate: async (variables) => {
      toast.loading("Creating comment...", { id: "comment-create" });
      setIsSubmitting(true);
      await queryClient.cancelQueries({
        queryKey: ["comments", variables.articleSlug],
      });
      if (variables.parentId) {
        await queryClient.cancelQueries({
          queryKey: ["replies", variables.parentId],
        });
      }
      return { variables };
    },
    onSuccess: (data, variables) => {
      toast.success("Comment created successfully!", { id: "comment-create" });
      setReplyingTo(null);
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.articleSlug],
      });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", variables.parentId],
        });
      }
    },
    onError: (error, variables) => {
      toast.error("Failed to create comment", { id: "comment-create" });
      console.error("Comment creation failed:", error);
    },
    onSettled: () => setIsSubmitting(false)
  });
};
