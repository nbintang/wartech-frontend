import { create } from "zustand";

type DialogImageStore = {
  isOpen: boolean;
  image?: string | null;
  setOpenDialog: (
    options: {
      isOpen: boolean;
      image?: string | null;
    }
  ) => void;
  closeDialog: () => void;
};
const useHandleImageDialog = create<DialogImageStore>((set) => ({
  isLoading: false,
  isOpen: false,
  setOpenDialog: (options) => set(options),
  closeDialog: () => set({ isOpen: false, image: null }),
}));


export default useHandleImageDialog