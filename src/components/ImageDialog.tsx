"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useHandleImageDialog, {
  imageDialogVariants,
} from "@/hooks/store/useHandlerImageDialog";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import React from "react";
import { useShallow } from "zustand/shallow";

const ImageDialog = () => {
  const { isOpen, image, setOpenDialog, variants } = useHandleImageDialog(
    useShallow((state) => ({
      isOpen: state.isOpen,
      image: state.image,
      setOpenDialog: state.setOpenDialog,
      variants: state.variants,
    }))
  );
  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => setOpenDialog({ isOpen })}>
      <DialogContent className={cn(imageDialogVariants(variants))} showCloseButton={false}>
        <DialogTitle className="sr-only " />
        <Image
          src={image || "/images/question-mark.jpg"}
          width={500}
          height={500}
          alt="image"
          className="w-full h-full  rounded-md"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
