import { create } from "zustand";
type DialogOptions = {
  isLoading: boolean;
  message: string;
  isSuccess?: boolean;
  isError?: boolean;
};
type DialogStore = {
  key: string;
  isOpen: boolean;
  message: string;
  isLoading: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  setOpenDialog: (key: string, options: DialogOptions) => void;
  closeDialog: () => void;
};
export const useHandleDialog = create<DialogStore>((set) => ({
  key: "",
  isLoading: false,
  isOpen: false,
  isError: false,
  isSuccess: false,
  message: "",
  setOpenDialog: (key, options) =>
    set({
      key,
      isOpen: true,
      ...options,
    }),
  closeDialog: () =>
    set({ isOpen: false, key: "", message: "", isLoading: false }),
}));
