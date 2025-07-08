import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, PenIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import useHandleCategoryFormDialog from "../hooks/useHandlenFormDialog";
import { CategoryApiResponse } from "@/types/api/CategoryApiResponse";
import useDeleteProtectedData from "@/hooks/hooks-api/useDeleteProtectedData";
import useHandleWarningDialog from "@/hooks/store/useHandleWarningDialog";

type CategoryTableFiltersProps<TData extends CategoryApiResponse> = {
  table: Table<TData>;
  filterSearch: keyof TData;
};
const CategoryTableFilters = <TData extends CategoryApiResponse>({
  table,
  filterSearch,
}: CategoryTableFiltersProps<TData>) => {
  const selectedOneCategory =
    table.getFilteredSelectedRowModel().rows.length === 1;
  const category = table
    .getFilteredRowModel()
    .rows.filter((row) => row.getIsSelected());
  const setOpen = useHandleCategoryFormDialog((s) => s.setOpen);
  const setOpenDialog = useHandleWarningDialog((state) => state.setOpenDialog);
  const setCategory = useHandleCategoryFormDialog((s) => s.setCategory);
  const { mutate: deleteCategory } = useDeleteProtectedData({
    TAG: ["categories"],
    endpoint: selectedOneCategory
      ? `/categories/${category[0].original.slug}`
      : "",
  });

  const filterSearchCategory = filterSearch.toString();
  const handleOpenDialog = () => {
    setOpenDialog({
      isOpen: true,
      title: "Delete Category",
      description:
        "Are you sure you want to delete this category? This action cannot be undone.",
      onConfirm: () => {
        deleteCategory();
      },
    });
  };
  return (
    <div className="flex flex-wrap-reverse items-center justify-between gap-4 mb-6">
      <Input
        placeholder={`Filter ${filterSearchCategory}s...`}
        value={
          (table.getColumn(filterSearchCategory)?.getFilterValue() as string) ??
          ""
        }
        onChange={(event) =>
          table
            .getColumn(filterSearchCategory)
            ?.setFilterValue(event.target.value)
        }
        className="md:w-1/4 w-full focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <div className="flex  items-center gap-2">
        {selectedOneCategory ? (
          <Button
            size={"sm"}
            onClick={() => {
              handleOpenDialog();
            }}
            variant={"destructive"}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        ) : null}
        <Button
          onClick={() => {
            if (selectedOneCategory) {
              setCategory(category[0].original);
            }
            setOpen(true);
          }}
        >
          <PenIcon /> {selectedOneCategory ? "Edit" : "Create"} Category
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

export default CategoryTableFilters;
