import { Input } from "@/components/ui/input";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
interface DataTableProps<TData> {
  table: Table<TData>;
  filterSearch: string;
}
function TableFilters<TData>({ table, filterSearch }: DataTableProps<TData>) {
  return (
    <div className="flex items-center justify-between rounded-b-md mb-6 ">
      {/* Added justify-between */}
      <div className="flex items-center gap-x-2">
        <Input
          placeholder={`Filter ${filterSearch}s...`}
          value={(table.getColumn(filterSearch)?.getFilterValue() as string) ?? ""}
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default TableFilters;
