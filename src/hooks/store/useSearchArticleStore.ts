
import { create } from "zustand";

type SearchArticleStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
};

const useSearchArticleStore = create<SearchArticleStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));

export default useSearchArticleStore;
