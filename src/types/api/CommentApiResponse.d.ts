export interface CommentApiResponse {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  isEdited: boolean
  user: {
    id: string
    name: string
    image: string | null
    email: string
  }
  article: {
    id: string
    title: string
    slug: string
    publishedAt: string | null
  }
  children: CommentApiResponse[]
}

export interface CommentData {
  comments: CommentApiResponse[]
}
