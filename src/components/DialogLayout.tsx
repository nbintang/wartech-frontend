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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DialogLayout() {
  const { type, isOpen, onOpenChange, message, isLoading } = useHandleDialog(
    useShallow((state) => ({
      type: state.type,
      isOpen: state.isOpen,
      onOpenChange: state.onOpenChange,
      message: state.message,
      isLoading: state.isLoading,
    }))
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) =>
        onOpenChange(type, isOpen, { message, isLoading })
      }
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <BotIcon className="size-5 text-primary" />
            <span>Warta Technologies</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Information from Warta Technologies
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col items-center text-center gap-2">
          {isLoading ? (
            <>
              <LoaderCircleIcon className="size-6 animate-spin text-blue-500" />
              <p className="text-sm text-muted-foreground">Please wait...</p>
            </>
          ) : message?.toLowerCase().includes("success") ? (
            <>
              <CheckCircle2Icon className="size-6 text-green-500" />
              <p className="text-xl text-green-600">{message}</p>
            </>
          ) : message ? (
            <>
              <AlertTriangleIcon className="size-6 text-yellow-500" />
              <p className="text-sm text-yellow-700">{message}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No message available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
