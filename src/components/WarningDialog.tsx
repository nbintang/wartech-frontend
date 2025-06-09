"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useHandleWarningDialog from "@/hooks/useHandleWarningDialog";
import { useShallow } from "zustand/shallow";
import { Button } from "./ui/button";

export default function WarningDialog() {
  const { isOpen, setOpenDialog, title, description, onConfirm } =
    useHandleWarningDialog(
      useShallow((state) => ({
        isOpen: state.isOpen,
        setOpenDialog: state.setOpenDialog,
        title: state.title,
        description: state.description,
        onConfirm: state.onConfirm,
      }))
    );
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setOpenDialog({
          isOpen,
          title,
          description,
          onConfirm,
        });
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant={"destructive"} className="text-white" onClick={onConfirm}>
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
