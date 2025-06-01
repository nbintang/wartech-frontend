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
import {
  BotIcon,
  LoaderCircleIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  CheckCircle,
  Loader2,
  BadgeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";

export default function DialogLayout() {
  const {
    type,
    isOpen,
    onOpenChange,
    message,
    isLoading,
    isSuccess,
    isError,
    redirect,
  } = useHandleDialog(
    useShallow((state) => ({
      type: state.type,
      isOpen: state.isOpen,
      onOpenChange: state.onOpenChange,
      message: state.message,
      isLoading: state.isLoading,
      isSuccess: state.isSuccess,
      isError: state.isError,
      redirect: state.redirect,
    }))
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) =>
        onOpenChange(type, isOpen, {
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
              "flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-4",
              isSuccess && "bg-green-100 text-green-600"
            )}
          >
            <CheckCircle className="w-6 h-6 " />
          </div>
          {isLoading && (
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          )}
          {isError && <BadgeX className="w-5 h-5 text-red-500" />}
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

        {!isLoading && (
          <div className="flex justify-center mt-4">
            <Button disabled={redirect} asChild>
              <Link href="/auth/verify">
                {redirect ? "Redirecting..." : "Verify You Account"}
              </Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
