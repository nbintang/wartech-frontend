export interface ArticleTagApiResponse {
  article: {
    id: string;
    title: string;
    slug: string;
  };
  tags: {
    id: string;
    name: string;
    slug: string;
  };
}
export interface ArticleTagsApiResponse {
  article: {
    id: string;
    title: string;
    slug: string;
  };
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}
