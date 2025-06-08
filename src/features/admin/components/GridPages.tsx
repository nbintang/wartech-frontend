"use client";
import { userColumns } from "@/features/admin/root/components/userColumns";
import RootDataTable from "@/features/admin/root/components/RootDataTable";
import { UsersApiResponse } from "@/types/api/UserApiResponse";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArticleApiResponse } from "@/types/api/ArticleApiResponse";
import { articleColumns } from "@/features/admin/root/components/articleColumns";
import CommentsUsers from "@/features/admin/root/components/UsersComment";
import UserChart from "@/features/admin/root/components/UsersChart";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import SkeletonDashboardCard from "./Skeletons";

interface Feature {
  title: string;
  description: string;
  image: string;
}

interface Feature166Props {
  feature1: Feature;
  feature2: Feature;
  feature3: Feature;
  feature4: Feature;
}

const dummyUsers: UsersApiResponse[] = Array.from(
  { length: 15 },
  (_, index) => ({
    id: `${index + 1}`,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    createdAt: new Date().toISOString(),
    image: `https://dummyimage.com/600x400/000/fff&text=User+${index + 1}`,
    updatedAt: new Date().toISOString(),
    verified: index % 2 === 0,
    role: index % 2 === 0 ? "ADMIN" : "USER",
  })
);

export const dummyArticles: ArticleApiResponse[] = Array.from(
  { length: 15 },
  (_, i) => ({
    id: `article-${i + 1}`,
    title: `Article ${i + 1}`,
    slug: `article-${i + 1}`,
    image: `https://dummyimage.com/600x400/000/fff&text=Article+${i + 1}`,
    status: i % 2 === 0 ? "PUBLISHED" : "DRAFT",
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      id: `category-${i + 1}`,
      name: i % 2 === 0 ? "Technology" : "Health",
      slug: i % 2 === 0 ? "technology" : "health",
    },
    author: {
      id: "admin-id",
      name: "Admin",
    },
    commentsCount: Math.floor(Math.random() * 10),
    likesCount: Math.floor(Math.random() * 20),
    tagsCount: 2,
    tags: [
      {
        id: `tag-js-${i + 1}`,
        name: "JavaScript",
        slug: "javascript",
      },
      {
        id: `tag-startup-${i + 1}`,
        name: "Startup",
        slug: "startup",
      },
    ],
  })
);

const GridPages = () => {
  const { data: articles, ...articlesRest } = useFetchProtectedData<
    PaginatedApiResponse<ArticleApiResponse>
  >({
    endpoint: "/articles",
    TAG: "articles",
    params: {
      "is-paginated": true,
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  const { data: users, ...usersRest } = useFetchProtectedData<
    PaginatedApiResponse<UsersApiResponse>
  >({
    endpoint: "/users",
    TAG: "users",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
  });

  const { data: comments, ...commentsRest } = useFetchProtectedData<
    PaginatedApiResponse<CommentApiResponse>
  >({
    endpoint: "/comments",
    TAG: "comments",
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
  return (
    <>
      {(articlesRest.isLoading || articlesRest.isFetching) && (
        <SkeletonDashboardCard />
      )}
      {articlesRest.isSuccess && (
        <RootDataTable
          redirectUrl="/articles"
          filterSearch="title"
          title="Articles"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam, odit molestias, eligendi, recusanda"
          columns={articleColumns}
          data={articles?.items || []}
        />
      )}
      {(commentsRest.isLoading || commentsRest.isFetching) && (
        <SkeletonDashboardCard />
      )}

      {commentsRest.isSuccess && (
        <CommentsUsers
          redirectUrl="/articles"
          comments={comments?.items || []}
        />
      )}

      {(usersRest.isLoading || usersRest.isFetching) && (
        <SkeletonDashboardCard />
      )}
      {usersRest.isSuccess && (
        <>
          <UserChart users={users?.items || []} redirectUrl={"/users"} />
          <RootDataTable
            redirectUrl="/users"
            filterSearch="name"
            title="Users"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam, odit molestias, eligendi, recusanda"
            columns={userColumns}
            data={users?.items || []}
          />
        </>
      )}
    </>
  );
};

export default GridPages;
