export type CommentApiResponse = {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  isEdited: boolean
  likes: number
  childrenCount: number
  user: CommentUser
  article: CommentArticle
  children?: CommentApiResponse[] // only used client-side
}

export type CommentArticle = {
  id: string
  title: string
  slug: string
  publishedAt: string
}

export type CommentUser = {
  id: string
  name: string
  image: string | null
  email: string
}

export type CreateCommentRequest = {
  content: string
  parentId?: string
  articleSlug: string
}
