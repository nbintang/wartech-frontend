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
    enabled: !!articleData?.category.slug,
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
