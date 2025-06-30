"use client";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { UsersApiResponse } from "@/types/api/UserApiResponse";
import DataTable from "../components/DataTable";
import usersPageColumn from "./components/usersColumn";
import DataTableSkeleton from "../components/DataTableSkeleton";
import { PaginationWithLinks } from "@/components/ui/pagination-with-link";
import { useSearchParams } from "next/navigation";
import useTable from "../../../hooks/useTable";
import DataTableFilters from "../components/DataTableFilters";
export default function UserDashboardPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const { data, isLoading, isSuccess } = useFetchProtectedData<
    PaginatedDataResultResponse<UsersApiResponse>
  >({
    endpoint: "/users",
    TAG: "users",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
    params: {
      page,
      limit,
    },
  });
  const { table } = useTable<UsersApiResponse>({
    columns: usersPageColumn,
    data: data?.items ?? [],
  });
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
  const visibleRowCountOnPage = table.getPaginationRowModel().rows.length;
  return (
    <>
      {isLoading && (
        <DataTableSkeleton className="md:h-[500px]   " />
      )}
      {isSuccess && data && (
   <>
      <DataTableFilters<UsersApiResponse> filterSearch="email" table={table} />
          <DataTable<UsersApiResponse> table={table} />
          <div className="flex justify-between w-full mt-3 px-3">
            <div className="text-sm text-muted-foreground">
              {selectedRowCount} of {visibleRowCountOnPage} Row(s) selected
            </div>
            <PaginationWithLinks
              page={data?.meta.currentPage ?? page}
              pageSize={data?.meta.itemPerPages ?? limit}
              totalCount={data?.meta.totalItems ?? 0}
            />
          </div>
          </>
      )}
    </>
  );
}
