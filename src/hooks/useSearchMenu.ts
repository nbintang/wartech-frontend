
import { create } from "zustand";

type SearchMenuStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
};

const useSearchMenu = create<SearchMenuStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));

export default useSearchMenu;
