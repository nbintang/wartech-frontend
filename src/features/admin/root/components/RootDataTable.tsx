"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import DashboardRootCardLayout from "./DashboardRootCardLayout";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import useTable from "../../hooks/useTable";

interface DataTableProps<TData, TValue>
  extends React.ComponentProps<typeof DashboardRootCardLayout> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterSearch: string;
}

export default function RootDataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  className,
  redirectUrl,
  filterSearch,
}: DataTableProps<TData, TValue>) {
  const { table } = useTable({
    columns,
    data,
  });
  return (
    <DashboardRootCardLayout
      title={title}
      redirectUrl={redirectUrl}
      description={description}
      className={cn("relative", className)}
    >
      <div className="flex items-center border-b  rounded-b-md dark:bg-neutral-900 bg-white pb-2 sticky top-0 z-10">
        <Input
          placeholder={`Filter ${filterSearch}s...`}
          value={
            (table.getColumn(filterSearch)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(filterSearch)?.setFilterValue(event.target.value)
          }
          className="max-w-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="h-full  rounded-none w-full">
        <div className="min-w-xl rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-accent ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </DashboardRootCardLayout>
  );
}
