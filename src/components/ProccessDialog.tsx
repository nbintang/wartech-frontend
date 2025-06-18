"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useShallow } from "zustand/shallow";
import useHandleLoadingDialog from "@/hooks/useHandleLoadingDialog";
import { CheckCircle, Loader2, BadgeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProccessDialog() {
  const router = useRouter();
  const { key, isOpen, setOpenDialog, message, isLoading, isSuccess, isError } =
    useHandleLoadingDialog(
      useShallow((state) => ({
        key: state.key,
        isOpen: state.isOpen,
        setOpenDialog: state.setOpenDialog,
        message: state.description,
        isLoading: state.isLoading,
        isSuccess: state.isSuccess,
        isError: state.isError,
      }))
    );
useEffect(() => {
  if (isSuccess || isError) {
    // Tutup setelah 2 detik kalau sukses atau error
    useHandleLoadingDialog.getState().closeDialog(3);
  }
}, [isSuccess, isError]);


  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          useHandleLoadingDialog.getState().closeDialog();
        }
      }}
    >
      <DialogContent
        showCloseButton={isError ? true : false}
        className="max-w-md"
        onInteractOutside={(e) => {
          if (!isError) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <div
            className={cn(
              "flex items-center justify-center size-12 mx-auto rounded-full  h-28 mb-1"
            )}
          >
            {isLoading ? (
              <Loader2 className="size-8 animate-spin text-blue-400" />
            ) : isSuccess ? (
              <div className="bg-green-100 text-green-600 rounded-full size-12 flex items-center justify-center">
                <CheckCircle className="size-8" />
              </div>
            ) : isError ? (
              <div className="bg-red-100 text-red-500 rounded-full size-12 flex items-center justify-center">
                <BadgeX className="size-8" />
              </div>
            ) : null}
          </div>
          <DialogTitle className="text-center text-2xl">
            {isSuccess
              ? "Success!"
              : isError
              ? "Failed to Process"
              : "Processing..."}
          </DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
