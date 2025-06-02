import { create } from "zustand";
type DialogOptions = {
  isLoading: boolean;
  message: string;
  isSuccess?: boolean;
  redirect?: boolean;
  isError?: boolean;
};
type DialogStore = {
  type: string;
  isOpen: boolean;
  message: string;
  isLoading: boolean;
  isError?: boolean;
  redirect?: boolean;
  isSuccess?: boolean;
  setOpenDialog: (type: string, isOpen: boolean, options: DialogOptions) => void;
  closeDialog: () => void;
};
export const useHandleDialog = create<DialogStore>((set) => ({
  type: "",
  isLoading: false,
  isOpen: false,
  isError: false,
  isSuccess: false,
  message: "",
  redirect: false,
  setOpenDialog: (type, isOpen, options) =>
    set({
      type,
      isOpen,
      ...options,
    }),
  closeDialog: () =>
    set({ isOpen: false, type: "", message: "", isLoading: false }),
}));
