export type CommentApiResponse = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  likes: number;
  childrenCount: number;
  user: CommentUser;
  article: CommentArticle;
  children?: CommentApiResponse[]; // only used client-side
};
export type CommentArticle = {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
};

export type CommentUser = {
  id: string;
  name: string;
  image: string | null;
  email: string;
};

export type CreateCommentRequest = {
  content: string;
  parentId?: string;
  articleSlug: string;
  articleTitle: string;
  articleId: string;
};

export interface ClientCommentApiResponse extends CommentApiResponse {
  parentId?: string | null;
  articleId: string;
  articleSlug: string;
  isOptimistic?: boolean;
}
export type CommentLikeApiResponse=  {
    id: string;
    userId: string;
    commentId: string;
    user: {
      id: string;
      name: string;
    };
}
export type CommentLikesApiResponse = {
  likes: CommentLikeApiResponse[];
  totalLikes: number;
};
