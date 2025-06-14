export type ArticleApiResponse = {
  id: string;
  title: string;
  slug: string;
  image: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string;
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
