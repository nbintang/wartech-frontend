"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ArticlesApiResponse } from "@/types/api/ArticleApiResponse";
import { Skeleton } from "@/components/ui/skeleton";
import { UseQueryResult } from "@tanstack/react-query";
import Link from "next/link";

export function HightlightCarouselSection({
  query,
}: {
  query: UseQueryResult<PaginatedDataResultResponse<ArticlesApiResponse>>;
}) {
  const { data, isLoading, isSuccess } = query;
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false,  })
  );
  const popularArticleByCommentCount = data?.items
    .filter((art) => art.status === "PUBLISHED")
    .sort((a, b) => b.commentsCount - a.commentsCount)
    .slice(0, 3);
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold ">Most Popular</h2>
      </div>
      <Carousel plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset} opts={{ loop: true, axis: "x" }}>
        <CarouselContent>
          {isLoading && (
            <CarouselItem className="relative mb-4">
              <Skeleton className="w-full h-96" />
            </CarouselItem>
          )}
          {isSuccess &&
            popularArticleByCommentCount?.map((article) => (
              <CarouselItem className="relative mb-4" key={article.id}>
                <Card className=" pt-0 rounded-lg shadow-sm overflow-hidden">
                  <CardHeader className="relative px-0">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <span>{article.category.name}</span>
                      <span>•</span>
                      <span className="text-muted-foreground text-xs">
                        {format(article?.publishedAt as Date, "dd/MM/yyyy")}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        asChild
                      >
                        <Link
                          href={`/articles/${article.category.slug}/${article.slug}`}
                        >
                          Read Article <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                    <h2 className="text-2xl font-bold  leading-tight">
                      {article.title}
                    </h2>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:inline-flex" />
        <CarouselNext className="hidden lg:inline-flex" />
      </Carousel>
    </section>
  );
}
