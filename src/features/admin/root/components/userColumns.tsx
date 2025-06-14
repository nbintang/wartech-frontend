"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UsersApiResponse } from "@/types/api/UserApiResponse";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, BadgeCheckIcon } from "lucide-react";

export const userColumns: ColumnDef<UsersApiResponse>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
    accessorKey: "verified",
    header: "User Status",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.verified ? "default" : "destructive"}>
          {row.original.verified ? (
            <>
              <BadgeCheckIcon className="mr-2 size-4" />
              Verified
            </>
          ) : (
            "Unverified"
          )}
        </Badge>
      );
    },
  },
];
