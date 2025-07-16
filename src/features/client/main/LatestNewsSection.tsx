import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { ArticlesApiResponse } from "@/types/api/ArticleApiResponse";
import { compareDesc, format, parseISO } from "date-fns";
import { UseQueryResult } from "@tanstack/react-query";

const LatestNewsSection = ({
  query,
}: {
  query: UseQueryResult<PaginatedDataResultResponse<ArticlesApiResponse>>;
}) => {
  const latestArticles = query.data?.items
    .filter((art) => art.status === "PUBLISHED")
    .sort((a, b) =>
      compareDesc(
        parseISO(String(b.publishedAt ?? b.createdAt)),
        parseISO(String(a.publishedAt ?? a.createdAt))
      )
    )
    .slice(0, 3);
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold ">LATEST NEWS</h2>
        <Button variant="ghost" size="sm">
          View all <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestArticles?.map((article) => (
          <article
            key={article.id}
            className=" rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm  mb-2">
                <Badge variant="outline" className="text-xs">
                  {article.category.name}
                </Badge>
                <span>•</span>
                <span>{format(article.publishedAt as Date, "dd/MM/yyyy")}</span>
              </div>
              <h3 className="font-semibold mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm  line-clamp-2">{article.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LatestNewsSection;
