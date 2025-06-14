export type ArticlesApiResponse = {
  id: string;
  title: string;
  slug: string;
  image: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date | string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
  };
  commentsCount: number;
  tagsCount: number;
  likesCount: number;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
};

export interface ArticlebySlugApiResponse
  extends Omit<ArticlesApiResponse, "author" | "category"> {
  content: string;
  authorId: string;
  categoryId: string;
  // relationships
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  author: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    image: string | null;
  };
}
