import { axiosInstance } from "@/lib/axiosInstance";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import { useQuery } from "@tanstack/react-query";

export const useReplies = (parentId: string, enabled = false) => {
  return useQuery({
    queryKey: ["replies", parentId],
    queryFn: async () => {
      const res = await axiosInstance.get<
        ApiResponse<PaginatedDataResultResponse<CommentApiResponse>>
      >(`/protected/comments/${parentId}/replies`);
      return res.data.data;
    },
    enabled: enabled && !!parentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
};
