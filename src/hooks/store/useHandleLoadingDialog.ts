import { create } from "zustand";
import { seconds } from "../../lib/utils";
type AuthDialogOptions = {
  isLoading: boolean;
  description: string;
  titleSuccess?: string;
  titleError?: string;
  isSuccess?: boolean;
  isError?: boolean;
};
type AuthDialogStore = {
  key: string;
  isOpen: boolean;
  description: string;
  titleSuccess: string;
  titleError: string;
  isLoading: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  setOpenDialog: (key: string, options: AuthDialogOptions) => void;
  closeDialog: (delay?: number) => void;
};

const useHandleLoadingDialog = create<AuthDialogStore>((set) => ({
  key: "",
  isLoading: false,
  isOpen: false,
  titleSuccess: "Success",
  titleError: "Failed to create...",
  isError: false,
  isSuccess: false,
  description: "",
  setOpenDialog: (key, options) =>
    set({
      key,
      isOpen: true,
      titleError: options.titleError || "Failed to create...",
      titleSuccess: options.titleSuccess || "Success",
      ...options,
    }),
  closeDialog: (delay = 1) => {
    if (delay > 0) {
      setTimeout(() => {
        set({ isOpen: false, key: "", description: "", isLoading: false });
      }, seconds(delay));
    } else {
      set({ isOpen: false, key: "", description: "", isLoading: false });
    }
  },
}));

export default useHandleLoadingDialog;
