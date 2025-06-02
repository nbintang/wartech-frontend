"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useShallow } from "zustand/shallow";
import { useHandleDialog } from "@/hooks/useHandleDialog";
import { CheckCircle, Loader2, BadgeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DialogLayout() {
  const router = useRouter();
  const {
    type,
    isOpen,
    setOpenDialog,
    message,
    isLoading,
    isSuccess,
    isError,
    redirect,
  } = useHandleDialog(
    useShallow((state) => ({
      type: state.type,
      isOpen: state.isOpen,
      setOpenDialog: state.setOpenDialog,
      message: state.message,
      isLoading: state.isLoading,
      isSuccess: state.isSuccess,
      isError: state.isError,
      redirect: state.redirect,
    }))
  );
  const handleClick = () => {
    router.push("/auth/verify");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) =>
        setOpenDialog(type, isOpen, {
          message,
          isLoading,
          isSuccess,
          isError,
          redirect,
        })
      }
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-4"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            ) : isSuccess ? (
              <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            ) : isError ? (
              <div className="bg-red-100 text-red-500 rounded-full w-12 h-12 flex items-center justify-center">
                <BadgeX className="w-6 h-6" />
              </div>
            ) : null}
          </div>
          <DialogTitle className="text-center">
            {isSuccess
              ? "Success!"
              : isError
              ? "Something went wrong"
              : "Processing..."}
          </DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mt-4">
          <Button onClick={handleClick}  asChild>
            Verify Your Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
