"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { UsersApiResponse } from "@/types/api/UserApiResponse";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, BadgeCheckIcon, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import useHandleWarningDialog from "@/hooks/useHandleWarningDialog";
import useDeleteProtectedData from "@/hooks/hooks-api/useDeleteProtectedData";
const usersPageColumn: ColumnDef<UsersApiResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
        <Badge
          variant={
            row.original.verified
              ? "default"
              : "destructive"
          }
        >
          {row.original.verified ? (
            <>
              <BadgeCheckIcon className=" size-4" />
             <p> Verified</p>
            </>
          ) : (
            "Unverified"
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const setOpenDialog = useHandleWarningDialog(
        (state) => state.setOpenDialog
      );
      const user = row.original;
      const { mutate } = useDeleteProtectedData({
        TAG: "users",
        endpoint: `/users/${user.id}`,
      });
      const handleDelete = () =>
        setOpenDialog({
          title: `Delete User`,
          description: "Are you sure you want to delete this user?",
          isOpen: true,
          onConfirm: () => mutate(),
        });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => (
                navigator.clipboard.writeText(user.id),
                toast.success("Copied user ID to clipboard", {
                  position: "bottom-right",
                })
              )}
            >
              Copy {user.name} ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/dashboard/users/${user.id}`}>
                View user details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              Delete {user.name}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default usersPageColumn;
