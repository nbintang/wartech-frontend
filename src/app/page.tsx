"use client";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { HightlightCarouselSection } from "@/features/client/main/HightlightCarouselSection";
import LatestNewsSection from "@/features/client/main/LatestNewsSection";
import { ArticlesApiResponse } from "@/types/api/ArticleApiResponse";
export default function NewsLandingPage() {
  const articles = useFetchProtectedData<
    PaginatedDataResultResponse<ArticlesApiResponse>
  >({
    TAG: ["articles"],
    endpoint: "/articles",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
      <HightlightCarouselSection query={articles} />
      <LatestNewsSection query={articles} />
    </main>
  );
}
