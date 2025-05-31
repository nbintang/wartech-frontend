import { create } from "zustand";
type DialogType = "signup" | null;

type DialogStore = {
  type: DialogType;
  isOpen: boolean;
  message: string;
  isLoading: boolean;
  onOpenChange: (
    type: DialogType,
    isOpen: boolean,

    { isLoading, message }: {isLoading: boolean; message: string }
  ) => void;
  closeDialog: () => void;
};

export const useHandleDialog = create<DialogStore>((set) => ({
  type: null,
  isLoading: false,
  isOpen: false,
  message: "",
  onOpenChange: (type, isOpen, { message, isLoading }) => set({ type, isOpen, message, isLoading }),
  closeDialog: () => set({ isOpen: false, type: null, message: "" , isLoading: false }),
}));
