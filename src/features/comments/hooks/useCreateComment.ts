import {
  InfiniteData,
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import { useCommentStore } from "./useCommentStore";
import { axiosInstance } from "@/lib/axiosInstance";
import { toast } from "sonner";
import { ArticlesApiResponse } from "@/types/api/ArticleApiResponse";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";

export type CreateCommentRequest = {
  content: string;
  parentId?: string;
  articleSlug: string;
  articleId: string;
};
const createComment = async (
  data: CreateCommentRequest
): Promise<CommentApiResponse> => {
  const payload = {
    content: data.content,
    articleId: data.articleId,
    parentId: data.parentId ?? null,
  };

  const endpoint = data.parentId
    ? `/protected/comments/${data.parentId}/replies`
    : `/protected/comments`;

  const response = await axiosInstance.post<ApiResponse<CommentApiResponse>>(
    endpoint,
    payload
  );
  if (!response.data.data) {
    throw new Error("API response data is null or undefined.");
  }
  return response.data.data as CommentApiResponse;
};

function getOrCreatePaginatedData(
  queryClient: QueryClient,
  queryKey: (string | number | undefined)[]
): PaginatedDataResultResponse<CommentApiResponse> {
  const existingData =
    queryClient.getQueryData<PaginatedDataResultResponse<CommentApiResponse>>(
      queryKey
    );

  return (
    existingData || {
      items: [],
      meta: {
        totalItems: 0,
        itemCount: 0,
        itemPerPages: 0,
        totalPages: 0,
        currentPage: 0,
      },
    }
  );
}

function addOptimisticCommentToPaginatedData(
  oldData: PaginatedDataResultResponse<CommentApiResponse>,
  optimisticComment: CommentApiResponse
): PaginatedDataResultResponse<CommentApiResponse> {
  const newItems = [...(oldData.items || []), optimisticComment]; 
  return {
    ...oldData,
    items: newItems,
    meta: {
      ...oldData.meta,
      totalItems: oldData.meta.totalItems + 1,
      itemCount: oldData.meta.itemCount + 1,
    },
  };
}

function replaceOptimisticCommentInPaginatedData(
  oldData: PaginatedDataResultResponse<CommentApiResponse>,
  optimisticId: string,
  realComment: CommentApiResponse
): PaginatedDataResultResponse<CommentApiResponse> {
  const updatedItems = oldData.items.map((comment) =>
    comment.id === optimisticId ? realComment : comment
  );
  return {
    ...oldData,
    items: updatedItems,
  };
}

function updateParentChildrenCountInInfiniteData(
  oldData:
    | InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>
    | undefined,
  parentId: string,
  increment: boolean = true
): InfiniteData<PaginatedDataResultResponse<CommentApiResponse>> {
  if (!oldData) {
    return {
      pages: [],
      pageParams: [],
    };
  }

  const updatedPages = oldData.pages.map((page) => ({
    ...page,
    items: page.items.map((comment: CommentApiResponse) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          childrenCount: increment
            ? comment.childrenCount + 1
            : comment.childrenCount - 1,
        };
      }
      return comment;
    }),
  }));

  return {
    ...oldData,
    pages: updatedPages,
  };
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

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
    mutationFn: createComment,

    onMutate: async (newComment) => {
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
        newComment.articleSlug,
      ]);

      if (!articleDataInCache) {
        console.warn(
          "Article data not found in cache for optimistic update. Using fallback."
        );
      }

      // Pastikan setReplyingTo juga diambil di sini
      const { setSubmittingReply, setReplyingTo } = useCommentStore.getState(); // Dapatkan setReplyingTo juga

      if (newComment.parentId) {
        setSubmittingReply(newComment.parentId, false);
        setReplyingTo(null);
      }
      toast.loading(`Creating comment...`, { id: "comment" });

      const optimisticComment: CommentApiResponse = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: newComment.content,
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
          id: newComment.articleId,
          slug: newComment.articleSlug,
          title: articleDataInCache?.title || "Unknown Article Title",
          publishedAt:
            typeof articleDataInCache?.publishedAt === "string"
              ? articleDataInCache.publishedAt
              : new Date().toISOString(),
        },
      };

      if (newComment.parentId) {
        await queryClient.cancelQueries({
          queryKey: ["replies", newComment.parentId],
        });

        const previousReplies = getOrCreatePaginatedData(queryClient, [
          "replies",
          newComment.parentId,
        ]);

        queryClient.setQueryData<
          PaginatedDataResultResponse<CommentApiResponse>
        >(["replies", newComment.parentId], (old) =>
          addOptimisticCommentToPaginatedData(
            old || previousReplies,
            optimisticComment
          )
        );

        await queryClient.cancelQueries({
          queryKey: ["comments", newComment.articleSlug],
        });

        const previousMainComments = queryClient.getQueryData<
          InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>
        >(["comments", newComment.articleSlug]);

        queryClient.setQueryData<
          InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>
        >(["comments", newComment.articleSlug], (old) =>
          updateParentChildrenCountInInfiniteData(
            old,
            newComment.parentId!,
            true
          )
        );

        return {
          optimisticComment,
          previousReplies,
          previousMainComments,
          isReply: true,
          parentId: newComment.parentId,
        };
      } else {
        // ... (onMutate for top-level comments)
        await queryClient.cancelQueries({
          queryKey: ["comments", newComment.articleSlug],
        });

        const previousData = queryClient.getQueryData<
          InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>
        >(["comments", newComment.articleSlug]);

        queryClient.setQueryData<
          InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>
        >(["comments", newComment.articleSlug], (old) => {
          if (!old) {
            return {
              pages: [
                {
                  items: [optimisticComment],
                  meta: {
                    totalItems: 1,
                    itemCount: 1,
                    itemPerPages: 1,
                    totalPages: 1,
                    currentPage: 1,
                  },
                },
              ],
              pageParams: [1],
            };
          }

          const newPages = [...old.pages];
          if (newPages[0]) {
            newPages[0] = {
              ...newPages[0],
              items: [optimisticComment, ...(newPages[0].items ?? [])],
              meta: {
                ...newPages[0].meta,
                totalItems: (newPages[0].meta?.totalItems || 0) + 1,
                itemCount: (newPages[0].meta?.itemCount || 0) + 1,
              },
            };
          }

          return {
            ...old,
            pages: newPages,
          };
        });

        return { optimisticComment, previousData, isReply: false };
      }
    },
    onError: (err, newComment, context) => {
      const { setSubmittingReply, setReplyingTo } = useCommentStore.getState(); 
      toast.error("Failed to create comment", { id: "comment" });

      if (newComment.parentId) {
        setSubmittingReply(newComment.parentId, false);
        setReplyingTo(newComment.parentId);
      } else {
          setReplyingTo(null);
      }

      if (context?.isReply && newComment.parentId) {
        queryClient.setQueryData<
          PaginatedDataResultResponse<CommentApiResponse>
        >(["replies", newComment.parentId], context.previousReplies);

        queryClient.setQueryData<
          InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>
        >(["comments", newComment.articleSlug], (old) =>
          updateParentChildrenCountInInfiniteData(
            old,
            newComment.parentId!,
            false
          )
        );
      } else {
        queryClient.setQueryData<
          InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>
        >(
          ["comments", newComment.articleSlug],
          () => context?.previousData || { pages: [], pageParams: [] }
        );
      }

      console.error("Comment creation failed:", err);
    },
    onSuccess: (realComment, variables, context) => {
      const { setSubmittingReply, toggleExpanded, setReplyingTo } =
        useCommentStore.getState(); // Dapatkan setReplyingTo
      toast.success("Comment created successfully!", {
        id: "comment",
      });
      // Clear submitting state
      if (variables.parentId) {
        setSubmittingReply(variables.parentId, false);
      }
      setReplyingTo(null); 

      if (context?.isReply && variables.parentId) {
        queryClient.setQueryData<
          PaginatedDataResultResponse<CommentApiResponse>
        >(["replies", variables.parentId], (old) =>
          replaceOptimisticCommentInPaginatedData(
            old ||
              getOrCreatePaginatedData(queryClient, [
                "replies",
                variables.parentId,
              ]),
            context.optimisticComment.id,
            realComment
          )
        );

        if (!useCommentStore.getState().isExpanded(variables.parentId)) {
          toggleExpanded(variables.parentId);
        }
      } else {
        queryClient.setQueryData<
          InfiniteData<PaginatedDataResultResponse<CommentApiResponse>>
        >(["comments", variables.articleSlug], (old) => {
          if (!old) return old;

          const newPages = [...old.pages];
          if (newPages[0]) {
            newPages[0] = {
              ...newPages[0],
              items: newPages[0].items.map((comment: CommentApiResponse) =>
                comment.id === context?.optimisticComment.id
                  ? realComment
                  : comment
              ),
            };
          }

          return {
            ...old,
            pages: newPages,
          };
        });
      }
    },
    onSettled: (data, error, variables) => {
      const { setSubmittingReply } = useCommentStore.getState();

      if (variables.parentId) {
        setSubmittingReply(variables.parentId, false);
      }

      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", variables.parentId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.articleSlug],
      });
    },
  });
};
