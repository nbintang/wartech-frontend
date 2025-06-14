"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArticlesApiResponse } from "@/types/api/ArticleApiResponse";
export const articleColumns: ColumnDef<ArticlesApiResponse>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium line-clamp-1">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "PUBLISHED" ? "default" : "outline"}>
          {status.slice(0, 1) + status.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.category.name}</Badge>
    ),
  },
  {
    accessorKey: "likesCount",
    header: "Likes",
    cell: ({ row }) => (
      <Badge
        className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
        variant="destructive"
      >
        {row.original.likesCount}
      </Badge>
    ),
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    cell: ({ row }) => {
      const publishedAt = row.original.publishedAt;
      return publishedAt
        ? format(new Date(publishedAt), "hh:mm dd MMM yyyy")
        : "-";
    },
  },
];
