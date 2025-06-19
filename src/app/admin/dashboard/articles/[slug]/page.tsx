"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleFormSkeleton from "@/features/admin/articles/components/ArticleFormSkeleton";
import UpdateArticleForm from "@/features/admin/articles/components/UpdateArticleForm";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { useCommentStore } from "@/hooks/useCommentStore";
import { ArticlebySlugApiResponse } from "@/types/api/ArticleApiResponse";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import { use, useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CommentApiResponse,
  CommentData,
} from "@/types/api/CommentApiResponse";
import { ChevronsUpDown, MessageCircle, MessageSquare } from "lucide-react";
import { CommentItem } from "@/features/admin/root/components/CommentItem";

export const dummyComments: CommentData = {
  comments: [
    {
      id: "1",
      content: "Komentar utama A",
      createdAt: "2025-06-19T10:00:00.000Z",
      updatedAt: "2025-06-19T10:00:00.000Z",
      isEdited: false,
      user: {
        id: "user-1",
        name: "User A",
        image: "https://www.gravatar.com/avatar/a?d=mp&f=y",
        email: "usera@example.com",
      },
      article: {
        id: "article-1",
        title: "Artikel 1",
        slug: "artikel-1",
        publishedAt: "2025-06-19T09:00:00.000Z",
      },
      children: [
        {
          id: "2",
          content: "Balasan ke komentar A",
          createdAt: "2025-06-19T10:05:00.000Z",
          updatedAt: "2025-06-19T10:05:00.000Z",
          isEdited: false,
          user: {
            id: "user-2",
            name: "User B",
            image: "https://www.gravatar.com/avatar/b?d=mp&f=y",
            email: "userb@example.com",
          },
          article: {
            id: "article-1",
            title: "Artikel 1",
            slug: "artikel-1",
            publishedAt: "2025-06-19T09:00:00.000Z",
          },
          children: [
            {
              id: "3",
              content: "Balasan ke balasan A",
              createdAt: "2025-06-19T10:10:00.000Z",
              updatedAt: "2025-06-19T10:10:00.000Z",
              isEdited: true,
              user: {
                id: "user-3",
                name: "User C",
                image: "https://www.gravatar.com/avatar/c?d=mp&f=y",
                email: "userc@example.com",
              },
              article: {
                id: "article-1",
                title: "Artikel 1",
                slug: "artikel-1",
                publishedAt: "2025-06-19T09:00:00.000Z",
              },
              children: [
                {
                  id: "4",
                  content: "Balasan level 4 - ini sangat dalam!",
                  createdAt: "2025-06-19T10:15:00.000Z",
                  updatedAt: "2025-06-19T10:15:00.000Z",
                  isEdited: false,
                  user: {
                    id: "user-4",
                    name: "User D",
                    image: "https://www.gravatar.com/avatar/d?d=mp&f=y",
                    email: "userd@example.com",
                  },
                  article: {
                    id: "article-1",
                    title: "Artikel 1",
                    slug: "artikel-1",
                    publishedAt: "2025-06-19T09:00:00.000Z",
                  },
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: "5",
          content: "Balasan lain ke komentar A",
          createdAt: "2025-06-19T10:20:00.000Z",
          updatedAt: "2025-06-19T10:20:00.000Z",
          isEdited: false,
          user: {
            id: "user-5",
            name: "User E",
            image: null,
            email: "usere@example.com",
          },
          article: {
            id: "article-1",
            title: "Artikel 1",
            slug: "artikel-1",
            publishedAt: "2025-06-19T09:00:00.000Z",
          },
          children: [],
        },
      ],
    },
    {
      id: "6",
      content: "Komentar utama B - ini adalah komentar terpisah",
      createdAt: "2025-06-19T11:00:00.000Z",
      updatedAt: "2025-06-19T11:00:00.000Z",
      isEdited: false,
      user: {
        id: "user-6",
        name: "User F",
        image: "https://www.gravatar.com/avatar/f?d=mp&f=y",
        email: "userf@example.com",
      },
      article: {
        id: "article-1",
        title: "Artikel 1",
        slug: "artikel-1",
        publishedAt: "2025-06-19T09:00:00.000Z",
      },
      children: [
        {
          id: "7",
          content: "Balasan ke komentar B",
          createdAt: "2025-06-19T11:05:00.000Z",
          updatedAt: "2025-06-19T11:05:00.000Z",
          isEdited: false,
          user: {
            id: "user-7",
            name: "User G",
            image: "https://www.gravatar.com/avatar/g?d=mp&f=y",
            email: "userg@example.com",
          },
          article: {
            id: "article-1",
            title: "Artikel 1",
            slug: "artikel-1",
            publishedAt: "2025-06-19T09:00:00.000Z",
          },
          children: [
            {
              id: "8",
              content:
                "Nested reply yang sangat panjang untuk menguji bagaimana tampilan komentar ketika kontennya cukup panjang dan membutuhkan beberapa baris untuk ditampilkan dengan baik.",
              createdAt: "2025-06-19T11:10:00.000Z",
              updatedAt: "2025-06-19T11:12:00.000Z",
              isEdited: true,
              user: {
                id: "user-8",
                name: "User H",
                image: null,
                email: "userh@example.com",
              },
              article: {
                id: "article-1",
                title: "Artikel 1",
                slug: "artikel-1",
                publishedAt: "2025-06-19T09:00:00.000Z",
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "9",
      content: "Komentar standalone tanpa balasan",
      createdAt: "2025-06-19T12:00:00.000Z",
      updatedAt: "2025-06-19T12:00:00.000Z",
      isEdited: false,
      user: {
        id: "user-9",
        name: "User I",
        image: "https://www.gravatar.com/avatar/i?d=mp&f=y",
        email: "useri@example.com",
      },
      article: {
        id: "article-1",
        title: "Artikel 1",
        slug: "artikel-1",
        publishedAt: "2025-06-19T09:00:00.000Z",
      },
      children: [],
    },
  ],
};

export default function ArticleBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  // const commentList = useCommentStore((state) => state.comments);
  const { data: profile } = useFetchProtectedData<UserProfileApiResponse>({
    TAG: "profile",
    endpoint: "/users/profile",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });
  const [collapsed, setCollapsed] = useState(true);
  const {
    data: article,
    isLoading,
    isError,
    isSuccess,
  } = useFetchProtectedData<ArticlebySlugApiResponse>({
    TAG: "articles",
    endpoint: `/articles/${slug}`,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });
  // const { data: comments, ...commentsQuery } = useFetchProtectedData<
  //   PaginatedApiResponse<CommentApiResponse>
  // >({
  //   TAG: "comments",
  //   endpoint: `/comments`,
  //   params: { "article-slug": article?.slug },
  //   staleTime: 1000 * 60 * 5,
  //   gcTime: 1000 * 60 * 10,
  //   retry: false,
  //   enabled: !!article?.slug,
  // });
  // useEffect(() => {
  //   if (commentsQuery.isSuccess && comments?.items) {
  //     useCommentStore.getState().setComments(comments.items);
  //   }
  // }, [commentsQuery.isSuccess, comments]);

  // console.log("comments", comments);
  // console.log(article);
  return (
    <>
      {isSuccess && article && profile && (
        <Card>
          <CardContent>
            <UpdateArticleForm article={article} profile={profile} />
            <Collapsible open={collapsed} onOpenChange={setCollapsed}>
              <CollapsibleTrigger asChild>
                <Button variant={"outline"} className="mb-4">
                  {collapsed ? "Hide comments" : "Show comments"}
                  <ChevronsUpDown className="ml-2" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="my-3">
                {dummyComments.comments.length > 0 ? (
                  dummyComments.comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment}  isChild />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      )}
      {}
      {isLoading && <ArticleFormSkeleton />}
    </>
  );
}
