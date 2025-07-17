"use client";
import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArticleApiPostResponse,
  ArticlebySlugApiResponse,
  ArticlesApiResponse,
} from "@/types/api/ArticleApiResponse";
import { notFound } from "next/navigation";
import { format, formatDate } from "date-fns";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { use } from "react";
import ArticleDetailSkeleton from "@/features/client/skeleton/ArticleDetailSkeleton";
import LatestNewsSection from "@/features/client/main/LatestNewsSection";
import Comments from "@/features/comments/components/Comments";
import ClientArticleComments from "@/features/comments/components/ClientArticleComments";

// Mock data - in a real app, this would come from your API/database
const articleData = {
  id: "96fe06e5-1381-4a02-97ef-a6bc4bbaa9b4",
  title: "Mastering Next.js: A Complete Guide to Modern React Development",
  slug: "mastering-nextjs-complete-guide",
  content: `
    <h2 id="introduction">Introduction to Next.js</h2>
    <p>Next.js has revolutionized the way we build React applications by providing a powerful framework that combines the best of server-side rendering, static site generation, and client-side rendering. In this comprehensive guide, we'll explore everything you need to know about Next.js.</p>
    
    <h2 id="getting-started">Getting Started with Next.js</h2>
    <p>Setting up a Next.js project is incredibly straightforward. The framework provides excellent developer experience out of the box with features like automatic code splitting, optimized bundling, and hot reloading.</p>
    
    <h3 id="installation">Installation Process</h3>
    <p>To create a new Next.js application, you can use the create-next-app command which sets up everything automatically. This includes TypeScript support, ESLint configuration, and Tailwind CSS if desired.</p>
    
    <h2 id="key-features">Key Features of Next.js</h2>
    <p>Next.js offers numerous features that make it an excellent choice for modern web development:</p>
    
    <h3 id="app-router">App Router</h3>
    <p>The new App Router in Next.js 13+ provides a more intuitive way to handle routing with support for layouts, loading states, and error boundaries. It's built on top of React Server Components.</p>
    
    <h3 id="server-components">Server Components</h3>
    <p>React Server Components allow you to render components on the server, reducing the JavaScript bundle size and improving performance. This is particularly beneficial for data-heavy applications.</p>
    
    <h2 id="performance">Performance Optimization</h2>
    <p>Next.js includes many performance optimizations by default, including automatic code splitting, image optimization, and font optimization. These features help ensure your applications load quickly and provide excellent user experience.</p>
    
    <h3 id="image-optimization">Image Optimization</h3>
    <p>The Next.js Image component automatically optimizes images for different screen sizes and formats, significantly improving page load times and Core Web Vitals scores.</p>
    
    <h2 id="deployment">Deployment Strategies</h2>
    <p>Deploying Next.js applications is seamless with platforms like Vercel, but the framework also supports deployment to various other platforms including AWS, Google Cloud, and traditional hosting providers.</p>
    
    <h2 id="conclusion">Conclusion</h2>
    <p>Next.js continues to evolve and improve, making it an excellent choice for developers who want to build fast, scalable React applications. Its combination of developer experience and performance makes it a standout framework in the React ecosystem.</p>
  `,
  image:
    "https://res.cloudinary.com/da6hciwjn/image/upload/v1751910651/articles/ecrakgezim4zgqyxdlwj.jpg",
  publishedAt: "2025-07-08T09:04:27.000Z",
  description:
    "A comprehensive guide to mastering Next.js, covering everything from basic setup to advanced optimization techniques for modern React development.",

  category: {
    name: "Programming",
    slug: "programming",
  },
  author: {
    name: "Clara sayangku",
    email: "admin@gmail.com",
    image:
      "https://res.cloudinary.com/da6hciwjn/image/upload/v1752080989/users/oxxoycoiyjri6rdtdjye.jpg",
  },
  tags: [
    { name: "Next.js", slug: "nextjs" },
    { name: "React", slug: "react" },
    { name: "Web Development", slug: "web-development" },
  ],
};

export default function ArticlePage({
  params,
}: {
  params: Promise<{ articleSlug: string }>;
}) {
  const { articleSlug } = use(params);
  const {
    data: articleData,
    isLoading,
    isSuccess,
  } = useFetchProtectedData<ArticlebySlugApiResponse>({
    TAG: ["article", articleSlug],
    endpoint: `/articles/${articleSlug}`,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });

  const relatedArticles = useFetchProtectedData<
    PaginatedDataResultResponse<ArticlesApiResponse>
  >({
    TAG: ["articles", articleSlug],
    endpoint: `/articles?is-paginated=true&category=${articleData?.category.slug}`,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });

  return (
    <>
      {isLoading && <ArticleDetailSkeleton />}
      {isSuccess && (
        <>
          {/* Article Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Link
                    href={`/categories/${articleData.category.slug}`}
                    className="hover:text-primary"
                  >
                    {articleData.category.name}
                  </Link>
                  <span>•</span>
                  <time
                    dateTime={
                      articleData.publishedAt
                        ? new Date(articleData.publishedAt).toISOString()
                        : undefined
                    }
                  >
                    {articleData.publishedAt &&
                      format(new Date(articleData.publishedAt), "yyyy-MM-dd")}
                  </time>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                  {articleData.title}
                </h1>

                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {articleData.description}
                </p>

                {/* Author and Meta Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={articleData.author.image || "/placeholder.svg"}
                        alt={articleData.author.name}
                      />
                      <AvatarFallback>
                        {articleData.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{articleData.author.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {articleData.author.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src={articleData.image || "/placeholder.svg"}
              alt={articleData.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Main Content */}
          <div className="container mx-auto  px-4 pb-12 pt-4">
            <div className="max-w-3xl mx-auto">
              {/* Article Content */}
              <main>
                <article className="prose prose-lg max-w-none dark:prose-invert">
                  {/* Article Content */}
                  <div
                    dangerouslySetInnerHTML={{ __html: articleData.content }}
                    className="article-content"
                  />
                </article>

                {/* Article Footer */}
                <footer className="mt-12 pt-8 border-t">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {articleData.tags.map((tag) => (
                        <Link key={tag.slug} href={`/tags/${tag.slug}`}>
                          <Badge
                            variant="outline"
                            className="hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {tag.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                </footer>
              </main>
            </div>
          </div>
        </>
      )}

      <LatestNewsSection query={relatedArticles} />
      {isSuccess && (
        <ClientArticleComments
          articleId={articleData.id}
          articleSlug={articleData.slug}
          articleTitle={articleData.title}
        />
      )}
    </>
  );
}
