"use client";

import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { ArticlesApiResponse } from "@/types/api/ArticleApiResponse";
import React from "react";
import useTable from "../hooks/useTable";
import articlePageColumn from "./components/articlesColumn";
import SkeletonDashboardCard from "../components/SkeletonDashboardCard";
import DataTableFilters from "../components/DataTableFilters";
import DataTable from "../components/DataTable";
import { PaginationWithLinks } from "@/components/ui/pagination-with-link";
import { useSearchParams } from "next/navigation";
import ArticleTableFilters from "./components/ArticleTableFilters";

const ArticleDashboardPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const { data, isSuccess, isLoading } = useFetchProtectedData<
    PaginatedApiResponse<ArticlesApiResponse>
  >({
    TAG: "articles",
    endpoint: "/articles",
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    params: {
      "is-paginated": true,
      page,
      limit,
    },
  });
  const { table } = useTable<ArticlesApiResponse>({
    columns: articlePageColumn,
    data: data?.items ?? [],
  });
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
  const visibleRowCountOnPage = table.getPaginationRowModel().rows.length;
  return (
    <>
      {isLoading && <SkeletonDashboardCard className="h-[700px]   " />}

      {isSuccess && data && (
        <>
          <ArticleTableFilters filterSearch="title" table={table} />
          <DataTable<ArticlesApiResponse> table={table} />
          <div className="flex justify-center md:justify-between w-full flex-wrap-reverse items-center gap-4 mt-3 px-3">
            <div className="text-sm text-muted-foreground">
              {selectedRowCount} of {visibleRowCountOnPage} Row(s) selected
            </div>
            {isSuccess && data?.meta ? (
              <PaginationWithLinks
                page={data.meta.currentPage}
                pageSize={data.meta.itemPerPages}
                totalCount={data.meta.totalItems}
              />
            ) : (
              <div>Memuat pagination...</div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ArticleDashboardPage;
