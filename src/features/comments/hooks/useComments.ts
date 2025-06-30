import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
const PREVIEW_COUNT = 2;
const LOAD_MORE_COUNT = 4;

export const useComments = (slug: string, isCollapsed: boolean) => {
  return useInfiniteQuery<PaginatedDataResultResponse<CommentApiResponse>, Error>({
    queryKey: ["comments", slug],
    queryFn: async ({ pageParam = 1 }): Promise<PaginatedDataResultResponse<CommentApiResponse>> => {
      const res = await axiosInstance.get<
        ApiResponse<PaginatedDataResultResponse<CommentApiResponse>> 
      >("/protected/comments", {
        params: {
          "article-slug": slug,
          page: pageParam,
          limit: isCollapsed ? LOAD_MORE_COUNT : PREVIEW_COUNT,
        },
      });
      return res.data.data as PaginatedDataResultResponse<CommentApiResponse>;
    },
    initialPageParam: 1,
    getNextPageParam: ({ meta }) =>
      meta.currentPage < meta.totalPages ? meta.currentPage + 1 : undefined,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
