"use client";

import * as React from "react";
import {
  IconArticle,
  IconHelp,
  IconLayoutDashboard,
  IconSettings,
  IconUsersGroup,
} from "@tabler/icons-react";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useFetchProtectedData from "@/hooks/hooks-api/useFetchProtectedData";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";
import useSignOut from "@/hooks/hooks-api/useSignOut";
import { BotIcon } from "lucide-react";
import Link from "next/link";

export const navData = {
  Main: [
    {
      title: "Overview",
      url: "/admin/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Users",
      url: "/admin/dashboard/users",
      icon: IconUsersGroup,
    },
    {
      title: "Articles",
      url: "/admin/dashboard/articles",
      icon: IconArticle,
    },
  ],
  Others: [
    {
      title: "Settings",
      url: "/admin/dashboard/account-settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/admin/dashboard/get-help",
      icon: IconHelp,
    },
  ],

};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    data: userData,
    isLoading,
    isSuccess,
    isUnauthorized,
    isError,
    error,
  } = useFetchProtectedData<UserProfileApiResponse>({
    TAG: "me",
    endpoint: "/users/me",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });
  return (
    <Sidebar className="z-[50]" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <BotIcon className="!size-5" />
                <span className="text-base font-semibold">Wartech Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.Main} />
        <NavSecondary items={navData.Others} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser data={userData} isLoading={isLoading} isSuccess={isSuccess} />
      </SidebarFooter>
    </Sidebar>
  );
}
