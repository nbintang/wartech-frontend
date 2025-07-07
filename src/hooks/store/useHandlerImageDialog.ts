import { create } from "zustand";
import { cva, VariantProps } from "class-variance-authority";

export const imageDialogVariants = cva("p-0 overflow-hidden", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
  },
});
export type ImageDialogVariants = VariantProps<typeof imageDialogVariants>;
type ImageDialogStore = {
  isOpen: boolean;
  image?: string | null;

    variants?: ImageDialogVariants;
  setOpenDialog: (options: {
    isOpen: boolean;
    image?: string | null;
    variants?: ImageDialogVariants;
  }) => void;
  closeDialog: () => void;
};
const useHandleImageDialog = create<ImageDialogStore>((set) => ({
  isLoading: false,
  isOpen: false,
  variants: { rounded: "none" },
  setOpenDialog: (options) => set(options),
  closeDialog: () => set({ isOpen: false, image: null }),
}));

export default useHandleImageDialog;
