import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import useDeleteProtectedData from "@/hooks/hooks-api/useDeleteProtectedData";
import useHandleImageDialog from "@/hooks/useHandlerImageDialog";
import useHandleWarningDialog from "@/hooks/useHandleWarningDialog";
import { ArticleApiResponse } from "@/types/api/ArticleApiResponse";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const articlePageColumn: ColumnDef<ArticleApiResponse>[] = [
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
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const setOpenDialog = useHandleImageDialog(
        (state) => state.setOpenDialog
      );
         const [imageLoading, setImageLoading] = useState(true);
      return (
 <div className="relative w-[60px] h-[60px] overflow-hidden rounded-md">
          {imageLoading && (
            <Skeleton className="absolute top-0 left-0 w-full h-full" />
          )}
          <Image
            src={row.getValue("image")}
            alt={row.getValue("title")}
            width={60}
            height={60}
            className={`rounded-md object-cover transition-opacity duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onClick={() =>
              setOpenDialog({
                isOpen: true,
                image: row.getValue("image"),
              })
            }
            onLoadingComplete={() => setImageLoading(false)}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("status") === "PUBLISHED" ? "default" : "secondary"
        }
      >
        {String(row.getValue("status")).slice(0, 1) +
          String(row.getValue("status")).slice(1).toLowerCase()}
      </Badge>
    ),
  },
  {
    accessorKey: "likesCount",
    header: "Likes",
    cell: ({ row }) => (
      <Badge
        className="font-medium h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
        variant={"destructive"}
      >
        {row.getValue("likesCount")}
      </Badge>
    ),
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    cell: ({ row }) => format(new Date(row.getValue("publishedAt")), "PPP"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const setOpenDialog = useHandleWarningDialog(
        (state) => state.setOpenDialog
      );
      const article = row.original;
      const { mutate } = useDeleteProtectedData({
        TAG: "articles",
        endpoint: `/articles/${article.id}`,
      });
      const handleDelete = () =>
        setOpenDialog({
          title: `Delete Article`,
          description: "Are you sure you want to delete this article?",
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
                navigator.clipboard.writeText(article.id),
                toast.success("Copied article ID to clipboard", {
                  position: "bottom-right",
                })
              )}
            >
              Copy {article.title} ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/dashboard/articles/${article.id}`}>
                View article details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              Delete {article.title}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default articlePageColumn;
