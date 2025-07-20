// NewsPage.tsx - Category specific page
"use client";
import { HightlightCarouselSection } from "@/features/client/main/HightlightCarouselSection";
import LatestNewsSection from "@/features/client/main/LatestNewsSection";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { ArticlesApiResponse } from "@/types/api/ArticleApiResponse";
import { Frown } from "lucide-react";
import { use } from "react";

export default function NewsPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = use(params);
  const isPaginated = true;
  
  const articleByCategory = useFetchProtectedData<
    PaginatedDataResultResponse<ArticlesApiResponse>
  >({
    TAG: ["articles", "category", categorySlug],
    endpoint: `/articles?is-paginated=${isPaginated}`,
    params: {
      category: categorySlug,
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
  console.log("articleByCategory", articleByCategory.data);
  if (articleByCategory.isError) {
    return (
      <div className="min-h-[calc(100vh-400px)] max-w-7xl mx-auto  sm:px-6 lg:px-8 pb-8 pt-4 grid place-items-center">
        <div className="flex flex-col justify-center items-center gap-6">
          <Frown size={64} className="text-muted-foreground" />
          <h1 className="text-2xl text-center font-bold text-muted-foreground">
            Failed to load articles. Please try again later.
          </h1>
        </div>
      </div>
    );
  }

  if (articleByCategory.data?.meta.totalItems === 0) {
    return (
      <div className="min-h-[calc(100vh-400px)] max-w-7xl mx-auto  sm:px-6 lg:px-8 pb-8 pt-4 grid place-items-center">
        <div className="flex flex-col justify-center items-center gap-6">
          <Frown size={64} className="text-muted-foreground" />
          <h1 className="text-2xl text-center font-bold text-muted-foreground">
            There is no article published in this category, please come back
            later
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8 pb-8 pt-4">
      <HightlightCarouselSection query={articleByCategory} />
      <LatestNewsSection title={`Latest in ${categorySlug}`} query={articleByCategory} />
    </div>
  );
}