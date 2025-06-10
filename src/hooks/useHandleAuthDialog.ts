import { create } from "zustand";
type AuthDialogOptions = {
  isLoading: boolean;
  message: string;
  isSuccess?: boolean;
  isError?: boolean;
};
type AuthDialogStore = {
  key: string;
  isOpen: boolean;
  message: string;
  isLoading: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  setOpenDialog: (key: string, options: AuthDialogOptions) => void;
  closeDialog: () => void;
};
 const useHandleAuthDialog = create<AuthDialogStore>((set) => ({
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


export default useHandleAuthDialog