"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UsersApiResponse } from "@/types/api/userApiResponse";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, BadgeCheckIcon } from "lucide-react";

export const userColumns: ColumnDef<UsersApiResponse>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), "hh:mm dd MMM yyyy"),
  },
  {
    accessorKey: "verified",
    header: "User Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant="secondary"
          className={cn(
            row.original.verified
              ? "bg-blue-500 text-white dark:bg-blue-600"
              : "bg-destructive text-white dark:bg-destructive/60"
          )}
        >
          <BadgeCheckIcon />
          Verified
        </Badge>
      );
    },
  },
];
