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
import usePatchProtectedData from "@/hooks/hooks-api/usePatchProtectedData";
import useHandleImageDialog from "@/hooks/store/useHandlerImageDialog";
import useHandleWarningDialog from "@/hooks/store/useHandleWarningDialog";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { ArticlesApiResponse } from "@/types/api/ArticleApiResponse";
import { useProgress } from "@bprogress/next";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

type Status = "PUBLISHED" | "DRAFT" | "ARCHIVED";
const articlePageColumn: ColumnDef<ArticlesApiResponse>[] = [
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown />
      </Button>
    ),
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
        <div className="relative aspect-video overflow-hidden rounded-md">
          {imageLoading && (
            <Skeleton className="absolute top-0 left-0 w-full h-full" />
          )}
          <Image
            src={row.getValue("image")}
            alt={row.getValue("title")}
            fill
            className={`rounded-md  object-cover transition-opacity duration-300 ${
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
    cell: ({ row }) => {
      const articleSlug = row.original.slug;
      const statusArt = ["PUBLISHED", "DRAFT", "ARCHIVED"] as const;
      const { start, stop } = useProgress();
      const setOpenDialog = useHandleWarningDialog(
        (state) => state.setOpenDialog
      );
      const { mutate, isPending } = usePatchProtectedData({
        endpoint: `/articles/${articleSlug}`,
        TAG: "articles",
        formSchema: z.object({

          status: z.enum(statusArt),
        }),
      });

      const handleStatusChange = async (status: Status) =>
        setOpenDialog({
          isOpen: true,
          title: "Change status",
          description: `Are you sure you want to change the status of this article to ${status}?`,
          buttonVariants: "default",
          onConfirm: () => {
            start();
            mutate({
              status,
            });
            stop();
          },
        });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge
              variant={
                row.getValue("status") === "PUBLISHED" ? "default" : "secondary"
              }
              className="cursor-pointer hover:opacity-80"
            >
              {capitalizeFirstLetter(row.getValue("status"))}
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusArt.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusChange(status as Status)}
                className={cn(
                  "my-1 cursor-pointer",
                  row.getValue("status") === status && "bg-muted"
                )}
                disabled={row.getValue("status") === status || isPending}
              >
                {capitalizeFirstLetter(status)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
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
              <span className="block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                Copy {article.title} ID
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/dashboard/articles/${article.slug}`}>
                View article details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <span className="block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                Delete {article.title}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default articlePageColumn;
