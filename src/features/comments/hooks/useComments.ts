import { useInfiniteQuery } from "@tanstack/react-query";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import commentsService from "../services/index";
export const useComments = (articleSlug: string, isCollapsed: boolean) => {
  return useInfiniteQuery<
    PaginatedDataResultResponse<CommentApiResponse>,
    Error
  >({
    queryKey: ["comments", articleSlug],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await commentsService.getCommentsService({
        pageParam: pageParam as number,
        slug: articleSlug,
        isCollapsed,
        
      });
      if (!res.data) throw new Error("Failed to fetch comments on useComments");
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: ({ meta }) =>
      meta.currentPage < meta.totalPages ? meta.currentPage + 1 : undefined,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
