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
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
};

export interface ArticlebySlugApiResponse
  extends Omit<ArticlesApiResponse, "author" | "category"> {
  content: string;
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

export interface ArticleApiPostResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  authorId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
