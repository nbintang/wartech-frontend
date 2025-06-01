import { create } from "zustand";

type DialogStore = {
  type: string;
  isOpen: boolean;
  message: string;
  isLoading?: boolean;
  isError?: boolean;
  redirect?: boolean;
  isSuccess?: boolean;
  onOpenChange: (
    type: string,
    isOpen: boolean,
    {
      isLoading,
      isSuccess,
      isError,
      message,
      redirect,
    }: {
      isLoading?: boolean;
      message: string;
      isSuccess?: boolean;
      redirect?: boolean;
      isError?: boolean;
    }
  ) => void;
  closeDialog: () => void;
};

export const useHandleDialog = create<DialogStore>((set) => ({
  type: "",
  isLoading: false,
  isOpen: false,
  isError: false,
  isSuccess: false,
  message: "",
  onOpenChange: (
    type,
    isOpen,
    {
      isLoading,
      message,
      isSuccess = false,
      isError = false,
      redirect = false,
    }
  ) =>
    set({
      type,
      isOpen,
      message,
      isLoading,
      isSuccess,
      redirect,
      isError,
    }),
  closeDialog: () =>
    set({ isOpen: false, type: "", message: "", isLoading: false }),
}));
