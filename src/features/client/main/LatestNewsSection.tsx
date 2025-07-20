import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UseFetchQueryResult } from "@/hooks/hooks-api/useFetchProtectedData";
import { ArticlesApiResponse } from "@/types/api/ArticleApiResponse";
import { compareDesc, format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

const   LatestNewsSection = ({
  query,
  title ,
}: {
  query: UseFetchQueryResult<PaginatedDataResultResponse<ArticlesApiResponse>>;
  title?: string;
}) => {
  const { data, isLoading, isError, isSuccess, error } = query;
  const latestArticles = data?.items
    .filter((art) => art.status === "PUBLISHED")
    .sort((a, b) =>
      compareDesc(
        parseISO(String(b.publishedAt ?? b.createdAt)),
        parseISO(String(a.publishedAt ?? a.createdAt))
      )
    )
    .slice(0, 3);
  return (
    <section className="max-w-7xl mx-auto  sm:px-6 lg:px-8 pb-8 pt-4 ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold ">{title || "Latest News"}</h2>
        <Button variant="ghost" size="sm">
          View all <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isError && <p className="text-destructive">{error?.message}</p>}
        {isLoading && (
          <>
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </>
        )}
        {isSuccess &&
          latestArticles?.slice(0, 3).map((article) => (
            <Card
              key={article.id}
              className="pt-0 rounded-md overflow-hidden shadow-sm"
            >
              <CardHeader className="p-0">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={300}
                  height={200}
                  className="w-full h-48  object-cover"
                />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm  mb-2">
                  <Badge variant="outline" className="text-xs">
                    {article.category.name}
                  </Badge>
                  <span>•</span>
                  <span className="text-xs text-muted-foreground">
                    {format(article.publishedAt as Date, "dd/MM/yyyy")}
                  </span>
                </div>
                <Button
                  variant={"link"}
                  className="font-semibold pl-0 ml-0 mb-2 line-clamp-2"
                  asChild
                >
                  <Link
                    href={`/articles/${article.category.name}/${article.slug}`}
                  >
                    {article.title}
                  </Link>
                </Button>
                <p className="text-sm  line-clamp-2">{article.description}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </section>
  );
};

export default LatestNewsSection;
