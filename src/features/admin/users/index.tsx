"use client";
import { Button } from "@/components/ui/button";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { UsersApiResponse } from "@/types/api/UserApiResponse";
import UsersDataTable from "./components/UsersDataTable";
import usersPageColumn from "./components/usersColumn";
import SkeletonDashboardCard from "../components/SkeletonDashboardCard";
import DashboardCardLayout from "../root/components/DashboardRootCardLayout";
import { PaginationWithLinks } from "@/components/ui/pagination-with-link";
import { useSearchParams } from "next/navigation";
import useTable from "../hooks/useTable";

export default function UserDashboardPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");
  const { data, ...usersRest } = useFetchProtectedData<
    PaginatedApiResponse<UsersApiResponse>
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
  const { table } = useTable({
    columns: usersPageColumn,
    data: data?.items ?? [],
  });
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
  const visibleRowCountOnPage = table.getPaginationRowModel().rows.length;
  return (
    <>
      {usersRest.isLoading && (
        <SkeletonDashboardCard className="md:h-[800px] min-h-screen md:mx-6 mx-3 my-6" />
      )}
      {usersRest.isSuccess && data && (
        <DashboardCardLayout
          title="Users"
          description="List of all users in the system"
          className="md:h-[800px] min-h-screen md:mx-6 mx-3 my-6"
        >
          <UsersDataTable
            data={data}
            columns={usersPageColumn}
            filterSearch={"email"}
          />
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
        </DashboardCardLayout>
      )}
    </>
  );
}
