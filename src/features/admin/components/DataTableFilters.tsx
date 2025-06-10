import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
interface DataTableProps<TData> {
  table: Table<TData>;
  filterSearch: string;
}
function DataTableFilters<TData>({
  table,
  filterSearch,
}: DataTableProps<TData>) {
  return (
    <div className="flex items-center justify-between rounded-b-md mb-6 ">
      {/* Added justify-between */}
      <Input
        placeholder={`Filter ${filterSearch}s...`}
        value={
          (table.getColumn(filterSearch)?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn(filterSearch)?.setFilterValue(event.target.value)
        }
        className="md:w-1/4 w-1/2 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
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
                  {typeof column.columnDef.header === "function"
                    ? column.id // fallback atau custom rendering
                    : column.columnDef.header}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DataTableFilters;
