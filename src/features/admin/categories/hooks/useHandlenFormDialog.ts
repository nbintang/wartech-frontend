import { create } from "zustand";
import { CategoryApiResponse } from "@/types/api/CategoryApiResponse";

type HandleCategoryFormDialogStore = {
  open: boolean;
  category: CategoryApiResponse | undefined;
  setOpen: (open: boolean) => void;
  setCategory: (cat: CategoryApiResponse) => void;
};

const useHandleCategoryFormDialog = create<HandleCategoryFormDialogStore>((set) => ({
  open: false,
  category: undefined,
  setOpen: (open) => set({ open }),
  setCategory: (cat) => set({ category: cat }),
}));

export default useHandleCategoryFormDialog;