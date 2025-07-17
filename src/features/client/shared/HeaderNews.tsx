import PublicUserProfile from "@/components/PublicUserProfile";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { CategoryApiResponse } from "@/types/api/CategoryApiResponse";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import { format } from "date-fns";
import { BotIcon, Loader2, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
const HeaderNews = () => {
  const { categorySlug, articleSlug } = useParams<{
    categorySlug: string;
    articleSlug: string;
  }>();
  const pathname = usePathname();
  const isShouldAppearArticleDetail =
    pathname === `/articles/${categorySlug}/${articleSlug}`;
  const mobileView = useIsMobile();
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const {
    data: me,
    isSuccess,
    isLoading,
    isUnauthorized,
  } = useFetchProtectedData<UserProfileApiResponse>({
    TAG: "me",
    endpoint: "/users/me",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const {
    data: categories,
    isSuccess: isSuccessCategories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    isFetching: isFetchingCategories,
    isFetched: isFetchedCategories,
  } = useFetchProtectedData<PaginatedDataResultResponse<CategoryApiResponse>>({
    TAG: "categories",
    endpoint: "/categories",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <header className="pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {mobileView ? (
          <>
            <Sheet>
              <SheetTrigger className="fixed top-3 left-3 z-50" asChild>
                <Button
                  variant={"outline"}
                  className="p-2 "
                  size={"icon"}
                  asChild
                >
                  <MenuIcon className="" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <div className="flex items-center gap-x-4 justify-start">
                    <Button variant={"outline"} size={"icon"} asChild>
                      <Link href="/">
                        <BotIcon className="size-6" />
                      </Link>
                    </Button>
                    <div className="flex flex-col">
                      <SheetTitle className="text-xs">
                        Warta Technologies
                      </SheetTitle>
                      <SheetDescription className="text-[10px] text-muted-foreground">
                        {currentDate}
                      </SheetDescription>
                    </div>
                  </div>
                  <div className="flex items-start flex-col-reverse gap-2">
                    <div className="flex flex-row gap-2 items-center">
                      <Input
                        placeholder="Search..."
                        className="w-48 h-8 text-sm"
                      />
                    </div>

                    {isSuccess && (
                      <PublicUserProfile
                        data={me}
                        isSuccess={isSuccess}
                        isLoading={isLoading}
                      />
                    )}
                    {isUnauthorized && (
                      <Button variant={"outline"} asChild>
                        <Link href={"/auth/sign-in"}>Sign In</Link>
                      </Button>
                    )}
                    {isLoading && (
                      <Button variant={"outline"} disabled>
                        <Loader2 className="animate-spin" />
                      </Button>
                    )}
                  </div>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <div className="flex items-center justify-between py-2 text-sm ">
            <div className="flex items-center gap-x-4 justify-center">
              <Button variant={"outline"} size={"icon"} asChild>
                <Link href="/">
                  <BotIcon className="size-6" />
                </Link>
              </Button>
              <div className="flex flex-col">
                <p className="text-xs"> Warta Technologies</p>
                <p className="text-[10px] text-muted-foreground">
                  {currentDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm">
                  Press{" "}
                  <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                    <span className="text-xs">⌘</span>J
                  </kbd>
                </p>
                <Input placeholder="Search..." className="w-48 h-8 text-sm" />

                {isSuccess && (
                  <PublicUserProfile
                    data={me}
                    isSuccess={isSuccess}
                    isLoading={isLoading}
                  />
                )}

                {isLoading && (
                  <Button variant={"outline"} disabled>
                    <Loader2 className="animate-spin" />
                  </Button>
                )}
                {isUnauthorized && (
                  <Button variant={"outline"} asChild>
                    <Link href={"/auth/sign-in"}>Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Logo and Navigation */}
        {!isShouldAppearArticleDetail && (
          <div className="pt-4">
            <div className="text-center mb-4">
              <h1 className="text-4xl font-serif font-bold ">
                The <span className="font-normal">NEWS</span>
              </h1>
            </div>

            <ScrollArea className="max-w-96 md:max-w-2xl mx-auto">
              <nav className="border-t border-b  py-2">
                <div className="flex items-center justify-center space-x-8 whitespace-nowrap">
                  {(isLoadingCategories || isFetchingCategories) &&
                    Array.from({ length: 10 }).map((_, idx) => (
                      <Skeleton key={idx} className="h-6 w-20 rounded" />
                    ))}
                  {isSuccessCategories &&
                    categories.items.map((category) => (
                      <Button
                        key={category.id}
                        variant={"link"}
                        className={cn(
                          category.slug === categorySlug
                            ? "underline underline-offset-4 font-semibold text-primary"
                            : "text-muted-foreground"
                        )}
                        asChild
                      >
                        <Link href={`/articles/${category.slug}`}>
                          {category.name}
                        </Link>
                      </Button>
                    ))}
                  {isErrorCategories && (
                    <p className="text-sm text-destructive">
                      Gagal memuat kategori.
                    </p>
                  )}
                </div>
              </nav>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderNews;
