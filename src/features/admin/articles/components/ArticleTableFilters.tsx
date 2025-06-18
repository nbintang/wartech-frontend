import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LoaderCircleIcon,
  PenIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import Link from "next/link";
import useHandleWarningDialog from "@/hooks/useHandleWarningDialog";
import useDeleteProtectedData from "@/hooks/hooks-api/useDeleteProtectedData";
type ArticleTableFiltersProps<TData extends { id: string }> = {
  table: Table<TData>;
  filterSearch: string;
};
const ArticleTableFilters = <TData extends { id: string }>({
  table,
  filterSearch,
}: ArticleTableFiltersProps<TData>) => {
  const selectedDataIds = table
    .getFilteredSelectedRowModel()
    .rows.map((art) => art.original.id);
  const isRowSelected = table.getFilteredSelectedRowModel().rows.length > 0;
  const setOpenDialog = useHandleWarningDialog((state) => state.setOpenDialog);
  const { mutate, isPending } = useDeleteProtectedData({
    TAG: "articles",
    endpoint: `/articles`,
  });
  const handleOpenDialog = () => {
    setOpenDialog({
      isOpen: true,
      title: "Delete Article",
      description:
        "Are you sure you want to delete this article? This action cannot be undone.",
      onConfirm: () => {
        mutate({ ids: selectedDataIds });
      },
    });
  };
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
        {isRowSelected && (
          <Button
            onClick={handleOpenDialog}
            variant="destructive"
            size={"sm"}
            className="md:mr-4 m-auto"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <LoaderCircleIcon className="size-4 animate-spin" /> Deleting...
              </span>
            ) : (
              <>
                <Trash2Icon className="size-4" />
                Delete
              </>
            )}
          </Button>
        )}
        <Button
          variant="default"
          size={"sm"}
          className="md:mr-4 m-auto"
          asChild
        >
          <Link href="/admin/dashboard/articles/new-articles">
            <PenIcon className="size-4" />
            New Article
          </Link>
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
