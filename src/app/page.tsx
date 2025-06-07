"use client";
import {
  Search,
  Calendar,
  ExternalLink,
  BotIcon,
  MenuIcon,
  UserIcon,
  LockIcon,
  LogOutIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import useFetchProtectedData from "@/hooks/useFetchProtectedData";
import { UserProfileApiResponse } from "@/types/api/userApiResponse";
import UserProfile from "@/components/UserProfile";
import useSignOut from "@/hooks/useSignOut";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

import PublicUserProfile from "@/components/PublicUserProfile";
export default function NewsLandingPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const { data, isSuccess, isLoading, isError, error, isUnauthorized } =
    useFetchProtectedData<UserProfileApiResponse>({
      TAG: "profile",
      endpoint: "/users/profile",
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: false,
    });

  const mobileView = useIsMobile();
  const categories = [
    "World News",
    "Politics",
    "Business",
    "Technology",
    "Health",
    "Sports",
    "Culture",
    "Podcast",
  ];

  const featuredArticle = {
    title:
      "A deep dive into the influence of cultural movements on contemporary society",
    image:
      "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
    category: "Culture",
    readTime: "5 min read",
    tags: ["Culture", "City Planning"],
  };

  const latestNews = [
    {
      title: "Rising tide of innovation and inspiration",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "Politics",
      date: "Oct 29, 2024",
      excerpt: "Exploring the latest developments in political landscapes...",
    },
    {
      title: "The effects of geopolitical shifts on global security",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "World News",
      date: "Oct 29, 2024",
      excerpt: "Analysis of current international relations...",
    },
    {
      title: "Affect the integrity and future of professional sports",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "Sports",
      date: "Oct 29, 2024",
      excerpt: "Impact on modern athletic competitions...",
    },
    {
      title: "The key for success in a competitive landscape",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "Business",
      date: "Oct 29, 2024",
      excerpt: "Strategies for business growth and development...",
    },
    {
      title: "Precision tools are transforming traditional business models",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "Technology",
      date: "Oct 29, 2024",
      excerpt: "How technology is reshaping industries...",
    },
    {
      title: "Tailoring treatments to individual genetic profiles",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "Health",
      date: "Oct 29, 2024",
      excerpt: "Advances in personalized medicine...",
    },
  ];

  const worldNews = [
    {
      title: "Understanding the social movements reshaping our world today",
      category: "World News",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      date: "Oct 29, 2024",
      excerpt: "A comprehensive look at global social changes...",
    },
    {
      title: "The global financial landscape and its implications for all",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "World News",
      date: "Oct 29, 2024",
      excerpt: "Economic trends affecting worldwide markets...",
    },
    {
      title: "Examining the challenges and responses of nations",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "World News",
      date: "Oct 29, 2024",
      excerpt: "International cooperation and conflicts...",
    },
    {
      title: "A comprehensive analysis of the state of global affairs",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "World News",
      date: "Oct 29, 2024",
      excerpt: "Current state of international relations...",
    },
  ];

  const technologyNews = [
    {
      title: "Latest innovations pave the way to a sustainable future",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "Technology",
      date: "Oct 29, 2024",
      excerpt: "Green technology and environmental solutions...",
    },
    {
      title:
        "Understanding the role of big data in driving technological advancement",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "Technology",
      date: "Oct 29, 2024",
      excerpt: "Data analytics transforming industries...",
    },
    {
      title: "Exploring the latest developments in AI Robotics",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "Technology",
      date: "Oct 29, 2024",
      excerpt: "Artificial intelligence and automation advances...",
    },
    {
      title: "Future of computing and what it means for society",
      image:
        "https://kzmp6i6ku1c703ktuzih.lite.vusercontent.net/placeholder.svg?height=400&width=600",
      category: "Technology",
      date: "Oct 29, 2024",
      excerpt: "Next-generation computing technologies...",
    },
  ];

  const topStories = [
    {
      title: "Global climate summit reaches historic agreement",
      category: "World News",
      excerpt: "International leaders unite on climate action...",
    },
    {
      title: "Tech giants announce major AI breakthrough",
      category: "Technology",
      excerpt: "Revolutionary advancement in artificial intelligence...",
    },
    {
      title: "Economic markets show signs of recovery",
      category: "Business",
      excerpt: "Positive indicators emerge across global markets...",
    },
    {
      title: "Healthcare innovation saves thousands of lives",
      category: "Health",
      excerpt: "New medical technology shows promising results...",
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
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
                          {" "}
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
                          data={data}
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
                      data={data}
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
          <div className="py-4">
            <div className="text-center mb-4">
              <h1 className="text-4xl font-serif font-bold ">
                The <span className="font-normal">NEWS</span>
              </h1>
            </div>

            <ScrollArea className="max-w-96 md:max-w-2xl mx-auto">
              <nav className="border-t border-b  py-2">
                <div className="flex items-center justify-center space-x-8">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href="#"
                      className="text-sm font-medium  transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </nav>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Stories Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {topStories.map((story, index) => (
            <div key={index} className=" p-4 rounded-lg shadow-sm border">
              <Badge variant="secondary" className="mb-2 text-xs">
                {story.category}
              </Badge>
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                {story.title}
              </h3>
              <p className="text-xs  line-clamp-2">{story.excerpt}</p>
            </div>
          ))}
        </div>

        {/* Featured Article */}
        <section className="mb-12">
          <div className=" rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <Image
                src={featuredArticle.image || "/placeholder.svg"}
                alt={featuredArticle.title}
                width={600}
                height={400}
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-4 left-4 flex gap-2">
                {featuredArticle.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm mb-3">
                <span>{featuredArticle.category}</span>
                <span>•</span>
                <span>{featuredArticle.readTime}</span>
                <Button variant="ghost" size="sm" className="ml-auto">
                  Read Article <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <h2 className="text-2xl font-bold  leading-tight">
                {featuredArticle.title}
              </h2>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold ">LATEST NEWS</h2>
            <Button variant="ghost" size="sm">
              View all <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((article, index) => (
              <article
                key={index}
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
                      {article.category}
                    </Badge>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm  line-clamp-2">{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* World News Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold ">WORLD NEWS</h2>
            <Button variant="ghost" size="sm">
              View all <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {worldNews.slice(0, 1).map((article, index) => (
                <article
                  key={index}
                  className=" rounded-lg shadow-sm overflow-hidden"
                >
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {article.category}
                    </Badge>
                    <h3 className="font-semibold  mb-2">{article.title}</h3>
                    <p className="text-sm ">{article.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {worldNews.slice(1).map((article, index) => (
                <article
                  key={index}
                  className="rounded-lg shadow-sm overflow-hidden"
                >
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    width={200}
                    height={150}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {article.category}
                    </Badge>
                    <h3 className="font-semibold text-sm  mb-1 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs  line-clamp-2">{article.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Technology News Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold ">TECHNOLOGY NEWS</h2>
            <Button variant="ghost" size="sm">
              View all <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {technologyNews.map((article, index) => (
              <article
                key={index}
                className=" rounded-lg shadow-sm overflow-hidden"
              >
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {article.category}
                  </Badge>
                  <h3 className="font-semibold text-sm  mb-1 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs  line-clamp-2">{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className=" border-t  mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold  mb-4">
              The <span className="font-normal">NEWS</span>
            </h3>
            <p className="text-sm  mb-4">
              Copyright © 2024 - The News - All rights reserved
            </p>
            <div className="flex justify-center space-x-6 text-sm ">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Contact Us</Link>
              <Link href="#">About</Link>
              <Link href="#">Careers</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
