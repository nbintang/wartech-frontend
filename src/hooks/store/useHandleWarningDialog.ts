import { ButtonVariants } from "@/components/ui/button";
import { create } from "zustand";

type AlertDialogStore = {
  title: string;
  description?: string;
  isOpen: boolean;
  buttonVariants?: ButtonVariants["variant"];
  setOpenDialog: ({
    isOpen,
    title,
    description,
  }: {
    isOpen: boolean;
    title: string;
    description?: string;
    onConfirm?: () => void;
    buttonVariants?: ButtonVariants["variant"];
  }) => void;
  onConfirm: () => void | Promise<void>;
  closeDialog: () => void;
};

const useHandleWarningDialog = create<AlertDialogStore>((set) => ({
  title: "",
  description: "",
  isOpen: false,
  message: "",
  buttonVariants: "destructive",
  setOpenDialog:  ({ isOpen, title, description, onConfirm, buttonVariants }) =>
    set({
      isOpen,
      title,
      description,
      onConfirm,
      buttonVariants,
    }),
  closeDialog: () => set({ isOpen: false, title: "", description: "" }),
  onConfirm: () => {},
}));

export default useHandleWarningDialog;
