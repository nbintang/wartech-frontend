import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import commentService from "../services";
import { useCommentStore } from "./useCommentStore";
import { useShallow } from "zustand/shallow";
import {
  ClientCommentApiResponse,
  CommentApiResponse,
  CreateCommentRequest,
} from "@/types/api/CommentApiResponse";
import { InfiniteData } from "@tanstack/react-query";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { ArticlesApiResponse } from "@/types/api/ArticleApiResponse";

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
  const {
    data: currentUser,
    isLoading,
    isSuccess,
    isError,
  } = useFetchProtectedData<UserProfileApiResponse>({
    TAG: "me",
    endpoint: "/users/me",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return useMutation({
    mutationFn: commentService.createComment,
    onMutate: async (newCommentData: CreateCommentRequest) => {
      if (isLoading || isError || !currentUser) {
        toast.error("User data not available for comment creation.");
        if (isLoading) {
          throw new Error("User data is still loading. Please wait.");
        }
        if (isError) {
          throw new Error(
            "Failed to load user data. Please refresh or try again."
          );
        }
        throw new Error("User not logged in or user data is missing.");
      }
      const articleDataInCache = queryClient.getQueryData<ArticlesApiResponse>([
        "article",
        newCommentData.articleSlug,
      ]);

      if (!articleDataInCache) {
        console.warn(
          "Article data not found in cache for optimistic update. Using fallback."
        );
      }
      toast.loading("Creating comment...", { id: "comment-create" });
      setIsSubmitting(true);

      const isMainComment = !newCommentData.parentId;
      setSubmittingParentId(newCommentData.parentId || null);
      setIsSubmittingMainComment(isMainComment);

      await queryClient.cancelQueries({
        queryKey: ["comments", newCommentData.articleSlug],
      });
      if (newCommentData.parentId) {
        await queryClient.cancelQueries({
          queryKey: ["replies", newCommentData.parentId],
        });
      }

      const previousCommentsData = queryClient.getQueryData<
        InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>
      >(["comments", newCommentData.articleSlug]);

      const previousRepliesData = newCommentData.parentId
        ? queryClient.getQueryData<CommentApiResponse[]>([
            "replies",
            newCommentData.parentId,
          ])
        : undefined;

      const optimisticId = `optimistic-${Date.now()}-${Math.random()}`;
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

      setOptimisticComment(optimisticComment); // Hanya satu kali panggil

      if (isMainComment) {
        queryClient.setQueryData(
          ["comments", newCommentData.articleSlug],
          (
            old:
              | InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>
              | undefined
          ) => {
            if (!old) {
              return {
                pages: [
                  {
                    items: [optimisticComment],
                    meta: {
                      currentPage: 1,
                      totalPages: 1,
                      itemCount: 1,
                      totalItems: 1,
                    },
                  },
                ],
                pageParams: [undefined],
              };
            }
            return {
              ...old,
              pages: old.pages.map((page) => {
                if (page.meta.currentPage === 1) {
                  return {
                    ...page,
                    items: [optimisticComment, ...page.items],
                    meta: { ...page.meta, itemCount: page.meta.itemCount + 1, totalItems: page.meta.totalItems + 1 }
                  };
                }
                return page;
              }),
            };
          }
        );
      } else if (newCommentData.parentId) {
        queryClient.setQueryData(
          ["replies", newCommentData.parentId],
          (oldReplies: CommentApiResponse[] | undefined) => {
            const currentReplies = Array.isArray(oldReplies) ? oldReplies : [];
            return [optimisticComment, ...currentReplies];
          }
        );
      }

      return {
        previousCommentsData,
        previousRepliesData,
        newCommentData,
        optimisticCommentId: optimisticId,
      };
    },
    onSuccess: (data, variables, context) => {
      toast.success("Comment created successfully!", { id: "comment-create" });
      setReplyingTo(null);
      setOptimisticComment(null);

      queryClient.invalidateQueries({
        queryKey: ["comments", variables.articleSlug],
      });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", variables.parentId],
        });
      }
    },
    onError: (error, variables, context) => {
      toast.error("Failed to create comment", { id: "comment-create" });
      console.error("Comment creation failed:", error);

      setOptimisticComment(null);

      if (context?.previousCommentsData) {
        queryClient.setQueryData(
          ["comments", variables.articleSlug],
          context.previousCommentsData
        );
      }
      if (variables.parentId && context?.previousRepliesData) {
        queryClient.setQueryData(
          ["replies", variables.parentId],
          context.previousRepliesData
        );
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
      setSubmittingParentId(null);
      setIsSubmittingMainComment(false);
      setOptimisticComment(null);
    },
  });
};