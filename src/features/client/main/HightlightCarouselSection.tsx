"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
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

export function HightlightCarouselSection({
  query,
}: {
  query: UseQueryResult<PaginatedDataResultResponse<ArticlesApiResponse>>;
}) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const popularArticleByCommentCount = query.data?.items
    .filter((art) => art.status === "PUBLISHED")
    .sort((a, b) => b.commentsCount - a.commentsCount) 
    .slice(0, 3); 

  return (
    <Carousel plugins={[plugin.current]} opts={{ loop: true, axis: "x" }}>
      <CarouselContent>
        {query.isLoading && (
          <CarouselItem className="relative mb-4">
            <Skeleton className="w-full h-96" />
          </CarouselItem>
        )}
        {query.isSuccess &&
          popularArticleByCommentCount?.map((article) => (
            <CarouselItem className="relative mb-4" key={article.id}>
              <div className=" rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
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
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <span>{article.category.name}</span>
                    <span>•</span>
                    <span>
                      {format(article?.publishedAt as Date, "dd/MM/yyyy")}
                    </span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      Read Article <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold  leading-tight">
                    {article.title}
                  </h2>
                </div>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:inline-flex" />
      <CarouselNext className="hidden lg:inline-flex" />
    </Carousel>
  );
}
