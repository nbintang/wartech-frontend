import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ClientCommentApiResponse,
  CommentApiResponse,
  CreateCommentRequest,
} from "@/types/api/CommentApiResponse";
import { InfiniteData } from "@tanstack/react-query";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { useCommentStore } from "./useCommentStore";
import { useShallow } from "zustand/shallow";
import commentService from "../services";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  const {
    setReplyingTo,
    setIsSubmitting,
    setSubmittingParentId,
    setIsSubmittingMainComment,
    setOptimisticComment,
  } = useCommentStore(
    useShallow((state) => ({
      setReplyingTo: state.setReplyingTo,
      setIsSubmitting: state.setIsSubmitting,
      setSubmittingParentId: state.setSubmittingParentId,
      setIsSubmittingMainComment: state.setIsSubmittingMainComment,
      setOptimisticComment: state.setOptimisticComment,
    }))
  );

  const { data: currentUser } = useFetchProtectedData<UserProfileApiResponse>({
    TAG: "me",
    endpoint: "/users/me",
    staleTime: 1000 * 60 * 5,
  });

  return useMutation({
    mutationFn: (newComment: CreateCommentRequest) =>
      commentService.createComment(newComment),

    onMutate: async (newCommentData: CreateCommentRequest) => {
      if (!currentUser) {
        toast.error("You must be logged in to comment.");
        throw new Error("User data not available for comment creation.");
      }

      const optimisticId = `optimistic-${Date.now()}`;
      const optimisticComment: ClientCommentApiResponse = {
        id: optimisticId,
        content: newCommentData.content,
        parentId: newCommentData.parentId || null,
        articleId: newCommentData.articleId,
        articleSlug: newCommentData.articleSlug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEdited: false,
        likes: 0,
        childrenCount: 0,
        user: {
          id: currentUser.id,
          name: currentUser.name,
          image: currentUser.image,
          email: currentUser.email,
        },
        article: {
          id: newCommentData.articleId,
          title: newCommentData.articleTitle,
          slug: newCommentData.articleSlug,
          publishedAt: new Date().toISOString(),
        },
        isOptimistic: true,
      };

      toast.loading("Posting comment...", { id: optimisticId });
      setOptimisticComment(optimisticComment);
      setIsSubmitting(true);

      // --- Logic for REPLIES ---
      if (newCommentData.parentId) {
        setIsSubmittingMainComment(false);
        setSubmittingParentId(newCommentData.parentId);

        const queryKey = ["replies", newCommentData.parentId];
        await queryClient.cancelQueries({ queryKey });

        const previousReplies =
          queryClient.getQueryData<PaginatedDataResultResponse<CommentApiResponse>>(queryKey);

        // **FIXED:** Directly update the object with { items, meta }
        queryClient.setQueryData<PaginatedDataResultResponse<CommentApiResponse>>(
          queryKey,
          (oldData) => {
            const newItems = [...(oldData?.items || []), optimisticComment];

            if (!oldData) {
              return {
                items: [optimisticComment],
                meta: {
                  totalItems: 1,
                  itemCount: 1,
                  itemPerPages: 10,
                  currentPage: 1,
                  totalPages: 1,
                },
              };
            }

            return {
              // No extra `data` wrapper
              items: newItems,
              meta: {
                ...oldData.meta,
                totalItems: oldData.meta.totalItems + 1,
                itemCount: oldData.meta.itemCount + 1,
              },
            };
          }
        );

        return { previousReplies, queryKey, optimisticComment };
      }
      else {
        setIsSubmittingMainComment(true);
        setSubmittingParentId(null);
        const queryKey = ["comments", newCommentData.articleSlug];
        await queryClient.cancelQueries({ queryKey });
        const previousComments =
          queryClient.getQueryData<InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>>(queryKey);
        queryClient.setQueryData<InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>>(
          queryKey,
          (oldData) => {
            const newPages = oldData ? [...oldData.pages] : [];
            if (newPages.length > 0) {
              const firstPageItems = [optimisticComment, ...newPages[0].items];
              newPages[0] = {
                items: firstPageItems,
                meta: {
                  ...newPages[0].meta,
                  totalItems: newPages[0].meta.totalItems + 1,
                  itemCount: newPages[0].meta.itemCount + 1,
                },
              };
            } else {
              newPages.push({
                items: [optimisticComment],
                meta: {
                  totalItems: 1,
                  itemCount: 1,
                  itemPerPages: 10,
                  currentPage: 1,
                  totalPages: 1,
                },
              });
            }

            return {
              pages: newPages,
              pageParams: oldData?.pageParams || [1],
            };
          }
        );

        return { previousComments, queryKey, optimisticComment };
      }
    },

    onError: (error, variables, context: any) => {
      toast.error("Failed to post comment. Restoring...", {
        id: context?.optimisticComment?.id,
      });

      if (context?.queryKey) {
        queryClient.setQueryData(
          context.queryKey,
          context.previousReplies || context.previousComments
        );
      }
    },

    onSuccess: (data, variables, context: any) => {
      toast.success("Comment posted!", {
        id: context?.optimisticComment?.id,
      });

      queryClient.invalidateQueries({
        queryKey: ["comments", variables.articleSlug],
      });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", variables.parentId],
        });
      }
    },

    onSettled: () => {
      setIsSubmitting(false);
      setSubmittingParentId(null);
      setIsSubmittingMainComment(false);
      setOptimisticComment(null);
      setReplyingTo(null);
    },
  });
};