import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  Table,
  TableOptions,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

type DataTableProps<TData> = Omit<
  TableOptions<TData>,
  | "onSortingChange"
  | "onColumnFiltersChange"
  | "onColumnVisibilityChange"
  | "onRowSelectionChange"
  | "getCoreRowModel"
  | "getPaginationRowModel"
  | "getSortedRowModel"
  | "getFilteredRowModel"
  | "state"
>;
const useTable = <TData>({
  columns,
  data,
  ...tableOptions
}: DataTableProps<TData>): {
  table: Table<TData>;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
} => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    ...tableOptions,
  });

  return {
    table,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
  };
};

export default useTable;
