"use client"

import { User, Category, Tag, Article, Comment, ArticleTag, Like, UserRole, ArticleStatus } from "./types"

// Initialize dummy data
const initializeData = () => {
  if (typeof window === "undefined") return

  // Users
  if (!localStorage.getItem("users")) {
    const users: Partial<User>[] = [
      {
        id: "1",
        name: "John Doe",
        password: "hashed_password",
        email: "john@example.com",
        role: UserRole.ADMIN,
        verified: true,
        acceptedTOS: true,
        image: "/placeholder.svg?height=100&width=100",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        name: "Jane Smith",
        password: "hashed_password",
        email: "jane@example.com",
        role: UserRole.REPORTER,
        verified: true,
        acceptedTOS: true,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
      {
        id: "3",
        name: "Bob Wilson",
        password: "hashed_password",
        email: "bob@example.com",
        role: UserRole.READER,
        verified: false,
        acceptedTOS: true,
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
      },
    ]
    localStorage.setItem("users", JSON.stringify(users))
  }

  // Categories
  if (!localStorage.getItem("categories")) {
    const categories: Partial<Category>[] = [
      {
        id: "1",
        name: "Technology",
        slug: "technology",
        description: "Tech-related articles",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        name: "Business",
        slug: "business",
        description: "Business and entrepreneurship",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
    ]
    localStorage.setItem("categories", JSON.stringify(categories))
  }

  // Tags
  if (!localStorage.getItem("tags")) {
    const tags: Partial<Tag>[] = [
      {
        id: "1",
        name: "React",
        slug: "react",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        name: "Next.js",
        slug: "nextjs",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
      {
        id: "3",
        name: "TypeScript",
        slug: "typescript",
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
      },
    ]
    localStorage.setItem("tags", JSON.stringify(tags))
  }

  // Articles
  if (!localStorage.getItem("articles")) {
    const articles: Partial<Article>[] = [
      {
        id: "1",
        title: "Getting Started with React",
        slug: "getting-started-with-react",
        content: "<p>React is a powerful JavaScript library for building user interfaces...</p>",
        image: "/placeholder.svg?height=200&width=400",
        categoryId: "1",
        authorId: "1",
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date("2024-01-01"),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        title: "Building Modern Web Apps",
        slug: "building-modern-web-apps",
        content: "<p>Modern web development requires understanding of various technologies...</p>",
        image: "/placeholder.svg?height=200&width=400",
        categoryId: "1",
        authorId: "2",
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date("2024-01-02"),
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
    ]
    localStorage.setItem("articles", JSON.stringify(articles))
  }

  // Comments
  if (!localStorage.getItem("comments")) {
    const comments: Partial<Comment>[] = [
      {
        id: "1",
        content: "Great article! Very helpful.",
        articleId: "1",
        userId: "2",
        isEdited: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        content: "Thanks for sharing this information.",
        articleId: "1",
        userId: "3",
        isEdited: false,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
    ]
    localStorage.setItem("comments", JSON.stringify(comments))
  }

  // Article Tags
  if (!localStorage.getItem("articleTags")) {
    const articleTags: Partial<ArticleTag>[] = [
      { id: "1", articleId: "1", tagId: "1" },
      { id: "2", articleId: "1", tagId: "3" },
      { id: "3", articleId: "2", tagId: "2" },
    ]
    localStorage.setItem("articleTags", JSON.stringify(articleTags))
  }

  // Likes
  if (!localStorage.getItem("likes")) {
    const likes: Partial<Like>[] = [
      { id: "1", articleId: "1", userId: "2", createdAt: new Date("2024-01-01") },
      { id: "2", articleId: "1", userId: "3", createdAt: new Date("2024-01-02") },
    ]
    localStorage.setItem("likes", JSON.stringify(likes))
  }
}

// Generic storage functions
export const getFromStorage = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Initialize data on first load
export const initializeStorage = () => {
  if (typeof window !== 'undefined') {
    initializeData();
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  initializeData();
}

// Specific storage functions
export const getUsers = (): Partial<User>[] => getFromStorage<Partial<User>>('users');
export const saveUsers = (users: Partial<User>[]): void => saveToStorage('users', users);

export const getCategories = (): Partial<Category>[] => getFromStorage<Partial<Category>>('categories');
export const saveCategories = (categories: Partial<Category>[]): void => saveToStorage('categories', categories);

export const getTags = (): Partial<Tag>[] => getFromStorage<Partial<Tag>>('tags');
export const saveTags = (tags: Partial<Tag>[]): void => saveToStorage('tags', tags);

export const getArticles = (): Partial<Article>[] => getFromStorage<Partial<Article>>('articles');
export const saveArticles = (articles: Partial<Article>[]): void => saveToStorage('articles', articles);

export const getComments = (): Partial<Comment>[] => getFromStorage<Partial<Comment>>('comments');
export const saveComments = (comments: Partial<Comment>[]): void => saveToStorage('comments', comments);

export const getArticleTags = (): Partial<ArticleTag>[] => getFromStorage<Partial<ArticleTag>>('articleTags');
export const saveArticleTags = (articleTags: Partial<ArticleTag>[]): void => saveToStorage('articleTags', articleTags);

export const getLikes = (): Partial<Like>[] => getFromStorage<Partial<Like>>('likes');
export const saveLikes = (likes: Partial<Like>[]): void => saveToStorage('likes', likes);
