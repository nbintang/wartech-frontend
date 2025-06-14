import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, PenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import Link from "next/link";
type ArticleTableFiltersProps<TData> = {
  table: Table<TData>;
  filterSearch: string;
};
const ArticleTableFilters = <TData,>({
  table,
  filterSearch,
}: ArticleTableFiltersProps<TData>) => {
  return (
    <div className="flex flex-wrap-reverse items-center justify-between gap-4 mb-6">
      <Input
        placeholder={`Filter ${filterSearch}s...`}
        value={
          (table.getColumn(filterSearch)?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn(filterSearch)?.setFilterValue(event.target.value)
        }
        className="md:w-1/4 w-full focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <div className="flex  items-center gap-2">
        <Button variant="default" size={"sm"} className="md:mr-4 m-auto">
          <PenIcon className="size-4" />
          <Link href="/admin/dashboard/articles/new-articles">New Article</Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filter <ChevronDown className="ml-2 h-4 w-4 " />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {typeof column.columnDef.header === "function"
                    ? column.id
                    : column.columnDef.header}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ArticleTableFilters;
