export interface CategorysApiResponse {
  id: string
  slug: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  articles: Article[]
}

export interface Article {
  id: string
  title: string
  slug: string
  image: string
  status: string
  publishedAt: string
}
