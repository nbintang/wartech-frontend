
import { create } from "zustand";

type SearchMenuDashboardStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
};

const useSearchDashboardMenu = create<SearchMenuDashboardStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));

export default useSearchDashboardMenu;
