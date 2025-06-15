"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useHandleImageDialog from "@/hooks/useHandlerImageDialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import React from "react";
import { useShallow } from "zustand/shallow";

const ArticleImageDialog = () => {
  const { isOpen, image, setOpenDialog } = useHandleImageDialog(
    useShallow((state) => ({
      isOpen: state.isOpen,
      image: state.image,
      setOpenDialog: state.setOpenDialog,
    }))
  );
  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => setOpenDialog({ isOpen })}>
      <DialogContent className="" showCloseButton={false}>
        <DialogTitle className="sr-only" />
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

export default ArticleImageDialog;
