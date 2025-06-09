import { create } from "zustand";

type AlertDialogStore = {
  title: string;
  description?: string;
  isOpen: boolean;
  setOpenDialog: ({
    isOpen,
    title,
    description,
  }: {
    isOpen: boolean;
    title: string;
    description?: string;
    onConfirm?: () => void;
  }) => void;
  onConfirm: () => void;
  closeDialog: () => void;
};

const useHandleWarningDialog = create<AlertDialogStore>((set) => ({
  title: "",
  description: "",
  isOpen: false,
  message: "",
  setOpenDialog: ({ isOpen, title, description, onConfirm }) =>
    set({ isOpen, title, description, onConfirm }),
  closeDialog: () => set({ isOpen: false, title: "", description: "" }),
  onConfirm: () => {},
}));

export default useHandleWarningDialog;
