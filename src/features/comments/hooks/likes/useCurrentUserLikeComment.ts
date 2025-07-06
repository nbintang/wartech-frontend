import { useQuery } from "@tanstack/react-query";
import commentsService from "../../services";

export const useCurrentUserLikeComment = (commentId: string) => {
  return useQuery({
    queryKey: ["currentUserLike", commentId],
    queryFn: async () => {
      try {
        const like = await commentsService.getCurrentUserLike(commentId);
        return like && like.id ? like : null;
      } catch (error) {
        return null;
      }
    },
    // Query hanya bergantung pada commentId
    enabled: !!commentId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
