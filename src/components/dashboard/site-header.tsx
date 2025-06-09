"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ModeToggleTheme from "../ModeToggleTheme";
import DynamicBreadcrumb from "../scat-ui/dynamic-breadcrumb";
import { useParams, usePathname } from "next/navigation";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState<UserProfileApiResponse | null>(
    null
  );
  const {
    data: user,
    isSuccess,
    isLoading,
    isFetching,
  } = useFetchProtectedData<UserProfileApiResponse>({
    endpoint: `/users/${id}`,
    TAG: "users",
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    id,
  });
  useEffect(() => {
    if (id && isSuccess && user) {
      setCurrentUser(user);
    } else if (!id) {
      setCurrentUser(null);
    }
  }, [id, isSuccess, user]);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <DynamicBreadcrumb
          path={pathname}
          excludeSegments={["admin", id]}
          appendSegments={
            id && (isLoading || isFetching)
              ? ["Loading..."]
              : currentUser?.name
              ? [currentUser.name]
              : []
          }
        />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
          <ModeToggleTheme />
        </div>
      </div>
    </header>
  );
}
