import { useQuery } from "@tanstack/react-query";
import commentsService from "../services";

export const useReplies = (parentId: string, enabled = false) => {
  return useQuery({
    queryKey: ["replies", parentId],
    queryFn: async () => {
      const res = await commentsService.getReplies(parentId);
      if (!res.data) throw new Error("Failed to fetch replies");
      return res.data;
    },
    enabled: enabled && !!parentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
};
