import { create } from "zustand";


type DialogStore = {
  type: string;
  isOpen: boolean;
  message: string;
  isLoading: boolean;
  onOpenChange: (
    type: string,
    isOpen: boolean,

    { isLoading, message }: {isLoading: boolean; message: string }
  ) => void;
  closeDialog: () => void;
};

export const useHandleDialog = create<DialogStore>((set) => ({
  type: "",
  isLoading: false,
  isOpen: false,
  message: "",
  onOpenChange: (type, isOpen, { message, isLoading }) => set({ type, isOpen, message, isLoading }),
  closeDialog: () => set({ isOpen: false, type: "", message: "" , isLoading: false }),
}));
