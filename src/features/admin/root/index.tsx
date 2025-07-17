"use client";
import { userColumns } from "@/features/admin/root/components/userColumns";
import { UsersApiResponse } from "@/types/api/UserApiResponse";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { articleColumns } from "@/features/admin/root/components/articleColumns";
import CommentsItems from "@/features/admin/root/components/CommentRootItems";
import UserChart from "@/features/admin/root/components/UsersChart";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import { ArticlesApiResponse } from "@/types/api/ArticleApiResponse";
import DataTable from "../components/DataTable";
import useTable from "../../../hooks/useTable";
import DashboardCardWrapper from "./components/DashboardCardWrapper";
import DataTableFilters from "../components/DataTableFilters";

const RootListDashboardPage = () => {
  const { data: articles, ...articlesQuery } = useFetchProtectedData<
    PaginatedDataResultResponse<ArticlesApiResponse>
  >({
    endpoint: "/articles?is-paginated=true",
    TAG: "articles",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  const { data: users, ...usersQuery } = useFetchProtectedData<
    PaginatedDataResultResponse<UsersApiResponse>
  >({
    endpoint: "/users",
    TAG: "users",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
  });

  const { data: comments, ...commentsQuery } = useFetchProtectedData<
    PaginatedDataResultResponse<CommentApiResponse>
  >({
    endpoint: "/comments",
    TAG: "comments",
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
  const { table: userTables } = useTable<UsersApiResponse>({
    columns: userColumns,
    data: users?.items || [],
  });
  const { table: articleTables } = useTable<ArticlesApiResponse>({
    columns: articleColumns,
    data: articles?.items || [],
  });
  return (
    <>
      <DashboardCardWrapper
        isLoading={articlesQuery.isLoading}
        isFetching={articlesQuery.isFetching}
        isSuccess={articlesQuery.isSuccess}
        title="Articles"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit..."
        redirectUrl="/articles"
      >
        <DataTableFilters<ArticlesApiResponse>
          table={articleTables}
          filterSearch="title"
        />
        <ScrollArea className="h-full w-full">
          <DataTable<ArticlesApiResponse> table={articleTables} />
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DashboardCardWrapper>

      <DashboardCardWrapper
        isLoading={commentsQuery.isLoading}
        isFetching={commentsQuery.isFetching}
        isSuccess={commentsQuery.isSuccess}
        title="Comments"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit..."
        redirectUrl="/articles"
      >
        <ScrollArea className="h-full w-full">
          <CommentsItems comments={comments?.items || []} />
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DashboardCardWrapper>

      <DashboardCardWrapper
        isLoading={usersQuery.isLoading}
        isFetching={usersQuery.isFetching}
        isSuccess={usersQuery.isSuccess}
        title="Users Growth"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit..."
        redirectUrl="/users"
      >
        <UserChart users={users?.items || []} redirectUrl="/users" />
      </DashboardCardWrapper>

      <DashboardCardWrapper
        isLoading={usersQuery.isLoading}
        isFetching={usersQuery.isFetching}
        isSuccess={usersQuery.isSuccess}
        title="Users"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit..."
        redirectUrl="/users"
      >
        <DataTableFilters<UsersApiResponse>
          table={userTables}
          filterSearch="email"
        />
        <ScrollArea className="h-full w-full">
          <DataTable<UsersApiResponse> table={userTables} />
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DashboardCardWrapper>
    </>
  );
};

export default RootListDashboardPage;
