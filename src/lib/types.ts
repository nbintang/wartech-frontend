export enum UserRole {
  READER = "READER",
  REPORTER = "REPORTER",
  ADMIN = "ADMIN",
}

export enum ArticleStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface User {
  id: string
  name: string
  password: string
  email: string
  verified: boolean
  emailVerifiedAt?: Date
  acceptedTOS: boolean
  image?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  articles: Article[]
  comments: Comment[]
  likes: Like[]
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  image: string
  authorId: string
  categoryId: string
  status: ArticleStatus
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  author: User
  category: Category
  articleTags: ArticleTag[]
  comments: Comment[]
  likes: Like[]
}

export interface ArticleTag {
  id: string
  articleId: string
  tagId: string
  article: Article
  tag: Tag
}

export interface Tag {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
  articleTags: ArticleTag[]
}

export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  articles: Article[]
}

export interface Comment {
  id: string
  content: string
  userId: string
  articleId: string
  parentId?: string
  createdAt: Date
  isEdited: boolean
  updatedAt: Date
  article: Article
  parent?: Comment
  children: Comment[]
  user: User
}

export interface Like {
  id: string
  userId: string
  articleId: string
  createdAt: Date
  article: Article
  user: User
}

// For dashboard stats
export interface DashboardStats {
  totalArticles: number
  totalUsers: number
  totalTags: number
  totalCategories: number
  totalComments: number
}
