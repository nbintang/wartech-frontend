"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel, // Make sure this is used if you want page-specific row count
  getSortedRowModel,
  getFacetedRowModel, // Often useful for showing filtered row counts
  getFacetedUniqueValues, // Often useful for showing filtered row counts
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import useTable from "../../hooks/useTable"; // Your custom hook
import { PaginationWithLinks } from "@/components/ui/pagination-with-link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: {
    items: TData[];
    meta: any;
  };
  filterSearch: string;
}

export default function UsersDataTable<TData, TValue>({
  columns,
  data,
  filterSearch,
}: DataTableProps<TData, TValue>) {
  // Destructure table from your custom hook
  const { table } = useTable({
    columns,
    data: data.items,
  });

  return (
    <>
      <div className="flex items-center justify-between rounded-b-md mb-6 ">
        {/* Added justify-between */}
        <div className="flex items-center gap-x-2">
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
          {/* Display the selected row status */}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter <ChevronDown className="ml-2 h-4 w-4" />{" "}
              {/* Added margin to icon */}
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
    
    </>
  );
}
