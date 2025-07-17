
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Skeleton Header */}
      <header className="border-b bg-background/95">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Category and Date */}
            <div className="flex items-center gap-2 text-sm mb-4">
              <Skeleton className="h-4 w-24" />
              <span>•</span>
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Title */}
            <Skeleton className="h-12 md:h-14 w-full mb-4" />

            {/* Description */}
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-5/6 mb-8" />

            {/* Author Info */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image Skeleton */}
      <Skeleton className="relative h-[400px] md:h-[500px] w-full" />

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 pb-12 pt-4">
        <div className="max-w-3xl mx-auto">
          <main>
            {/* Article Content - mimics paragraphs and headings */}
            <div className="space-y-6 mt-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="pt-4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="pt-4" />
              <Skeleton className="h-6 w-2/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            {/* Footer Tags Skeleton */}
            <footer className="mt-12 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}