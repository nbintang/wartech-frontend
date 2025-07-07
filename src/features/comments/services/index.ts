import { axiosInstance } from "@/lib/axiosInstance";
import {
  CommentApiResponse,
  CommentLikeApiResponse,
} from "@/types/api/CommentApiResponse";
export interface GetComments {
  pageParam?: number;
  slug: string;
  isCollapsed: boolean;
}
export interface CreateCommentRequest {
  content: string;
  parentId?: string;
  articleSlug: string;
  articleId: string;
}

type CommentsResponse = ApiResponse<
  PaginatedDataResultResponse<CommentApiResponse | null>
>;
class CommentsService {
  private PREVIEW_COUNT = 2;
  private LOAD_MORE_COUNT = 4;
  async getCommentsService({
    pageParam,
    slug,
    isCollapsed,
  }: GetComments): Promise<CommentsResponse> {
    const res = await axiosInstance.get<CommentsResponse>(
      "/protected/comments",
      {
        params: {
          "article-slug": slug,
          page: pageParam,
          limit: isCollapsed ? this.LOAD_MORE_COUNT : this.PREVIEW_COUNT,
        },
      }
    );
    if (!res.data) throw new Error("Failed to fetch comments");
    return res.data;
  }

  async getReplies(parentId: string): Promise<CommentsResponse> {
    const res = await axiosInstance.get<CommentsResponse>(
      `/protected/comments/${parentId}/replies`
    );
    return res.data;
  }
  async createComment(
    data: CreateCommentRequest
  ): Promise<ApiResponse<CommentApiResponse | null>> {
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
    if (!response.data) throw new Error("Failed to create comment");
    return response.data;
  }

  async deleteComment(commentId: string) {
    const response = await axiosInstance.delete(
      `/protected/comments/${commentId}`
    );
    return response.data;
  }

  async getCurrentUserLike(
    commentId: string
  ): Promise<CommentLikeApiResponse | null> {
    const res = await axiosInstance.get<ApiResponse<CommentLikeApiResponse>>(
      `/protected/comments/${commentId}/like/me`
    );
    return res.data.data as CommentLikeApiResponse;
  }

  async likeComment(commentId: string) {
    const res = await axiosInstance.post<ApiResponse<CommentLikeApiResponse>>(
      `/protected/comments/${commentId}/like`
    );
    return res.data.data as CommentLikeApiResponse;
  }

  async unlikeComment(commentId: string) {
    const res = await axiosInstance.delete<ApiResponse<CommentLikeApiResponse>>(
      `/protected/comments/${commentId}/like`
    );
    return res.data.data as CommentLikeApiResponse;
  }
}

const commentsService = new CommentsService();
export default commentsService;
