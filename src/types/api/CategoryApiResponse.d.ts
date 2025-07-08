export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Article {
  id: string;
  title: string;
  slug: string;
  image: string;
  status: ArticleStatus;
  publishedAt: string | null; // pakai string karena data dari API biasanya ISO string
}

export interface CategoryApiResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  articles?: Article[]; // Optional jika tidak pakai with-articles
}


export interface ArticleTag {
  id: string
  name: string
  slug: string
}

export interface ArticleAuthor {
  id: string
  name: string
  image: string | null
}

export interface ArticleInCategory {
  id: string
  title: string
  slug: string
  image: string
  status: ArticleStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  author: ArticleAuthor
  tags: ArticleTag[]
  tagsCount: number
}

export interface CategoryDetailApiResponse {
  id: string
  slug: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  articles: ArticleInCategory[]
}
