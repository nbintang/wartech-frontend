import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDeleteProtectedData from "@/hooks/hooks-api/useDeleteProtectedData";
import useHandleWarningDialog from "@/hooks/store/useHandleWarningDialog";
import { CategoryApiResponse } from "@/types/api/CategoryApiResponse";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import useHandleCategoryFormDialog from "../hooks/useHandlenFormDialog";
const categoryPageColum: ColumnDef<CategoryApiResponse>[] = [
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span className="line-clamp-1 text-muted-foreground text-xs max-w-xs md:max-w-md  truncate">{row.original.description}</span>,
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return <span>{format(new Date(createdAt), "dd/MM/yyyy")}</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      return <span>{format(new Date(updatedAt), "dd/MM/yyyy")}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const setOpenDialog = useHandleWarningDialog(
        (state) => state.setOpenDialog
      );
      const category = row.original;
      const { mutate } = useDeleteProtectedData({
        TAG: "categories",
        endpoint: `/categories/${category.slug}`,
      });
       const setOpen = useHandleCategoryFormDialog((s) => s.setOpen);
        const setCategory = useHandleCategoryFormDialog((s) => s.setCategory);
      const handleDelete = () =>
        setOpenDialog({
          title: `Delete Category`,
          description: "Are you sure you want to delete this category?",
          isOpen: true,
          onConfirm: () => mutate(),
        });

        const handleEdit = ( ) => {
          setOpen(true);
          setCategory(category);
        }

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
                navigator.clipboard.writeText(category.id),
                toast.success("Copied article ID to clipboard", {
                  position: "bottom-right",
                })
              )}
            >
              <span className="block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                Copy {category.id} ID
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/dashboard/categories/${category.slug}`}>
                View category details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleEdit}
            >
              <span className="block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                Edit {category.name}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <span className="block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                Delete {category.name}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default categoryPageColum;
