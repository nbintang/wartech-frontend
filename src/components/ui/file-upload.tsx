"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useDropzone,
  DropzoneState,
  FileRejection,
  DropzoneOptions,
} from "react-dropzone";
import { toast } from "sonner";
import { Trash2 as RemoveIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

type DirectionOptions = "rtl" | "ltr" | undefined;

type FileUploaderContextType = {
  dropzoneState: DropzoneState;
  isLOF: boolean;
  isFileTooBig: boolean;
  removeFileFromSet: (index: number) => void;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  orientation: "horizontal" | "vertical";
  direction: DirectionOptions;
};

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploaderProvider");
  }
  return context;
};

interface FileUploaderProps extends React.ComponentProps<"div"> {
  value: File[] | null | undefined;
  reSelect?: boolean;
  onValueChange: (value: File[] | null | undefined) => void;
  dropzoneOptions: DropzoneOptions;
  orientation?: "horizontal" | "vertical";
}

/**
 * File upload Docs: {@link: https://localhost:3000/docs/file-upload}
 */

export const FileUploader = ({
  className,
  dropzoneOptions,
  value,
  onValueChange,
  reSelect,
  orientation = "vertical",
  children,
  dir,
  ...props
}: FileUploaderProps) => {
  const [isFileTooBig, setIsFileTooBig] = useState(false);
  // const [isLOF, setIsLOF] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const {
    accept = {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
    },
    maxFiles = 1,
    maxSize = 4 * 1024 * 1024,
    multiple = true,
  } = dropzoneOptions;
  
  const isLOF = (value?.length ?? 0) >= maxFiles;
  const reSelectAll = maxFiles === 1 ? true : reSelect;
  const direction: DirectionOptions = dir === "rtl" ? "rtl" : "ltr";
  const removeFileFromSet = useCallback(
    (i: number) => {
      if (!value) return;
      const newFiles = value.filter((_, index) => index !== i);
      onValueChange(newFiles);
    },
    [value, onValueChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!value) return;

      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex > value.length - 1 ? 0 : nextIndex);
      };

      const movePrev = () => {
        const nextIndex = activeIndex - 1;
        setActiveIndex(nextIndex < 0 ? value.length - 1 : nextIndex);
      };

      const prevKey =
        orientation === "horizontal"
          ? direction === "ltr"
            ? "ArrowLeft"
            : "ArrowRight"
          : "ArrowUp";

      const nextKey =
        orientation === "horizontal"
          ? direction === "ltr"
            ? "ArrowRight"
            : "ArrowLeft"
          : "ArrowDown";

      if (e.key === nextKey) {
        moveNext();
      } else if (e.key === prevKey) {
        movePrev();
      } else if (e.key === "Enter" || e.key === "Space") {
        if (activeIndex === -1) {
          dropzoneState.inputRef.current?.click();
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (activeIndex !== -1) {
          removeFileFromSet(activeIndex);
          if (value.length - 1 === 0) {
            setActiveIndex(-1);
            return;
          }
          movePrev();
        }
      } else if (e.key === "Escape") {
        setActiveIndex(-1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, activeIndex, removeFileFromSet]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const files = acceptedFiles;

      if (!files) {
        toast.error("file error , probably too big");
        return;
      }

      const newValues: File[] = value ? [...value] : [];

      if (reSelectAll) {
        newValues.splice(0, newValues.length);
      }

      files.forEach((file) => {
        if (newValues.length < maxFiles) {
          newValues.push(file);
        }
      });

      onValueChange(newValues);

      if (rejectedFiles.length > 0) {
        for (let i = 0; i < rejectedFiles.length; i++) {
          if (rejectedFiles[i].errors[0]?.code === "file-too-large") {
            toast.error(
              `File is too large. Max size is ${maxSize / 1024 / 1024}MB`
            );
            break;
          }
          if (rejectedFiles[i].errors[0]?.message) {
            toast.error(rejectedFiles[i].errors[0].message);
            break;
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reSelectAll, value]
  );

  // useEffect(() => {
  //   if (!value) return;
  //   if (value.length === maxFiles) {
  //     setIsLOF(true);
  //     return;
  //   }
  //   setIsLOF(false);
  // }, [value, maxFiles]);

  const opts = dropzoneOptions
    ? dropzoneOptions
    : { accept, maxFiles, maxSize, multiple };

  const dropzoneState = useDropzone({
    ...opts,
    onDrop,
    onDropRejected: () => setIsFileTooBig(true),
    onDropAccepted: () => setIsFileTooBig(false),
  });

  return (
    <FileUploaderContext.Provider
      value={{
        dropzoneState,
        isLOF,
        isFileTooBig,
        removeFileFromSet,
        activeIndex,
        setActiveIndex,
        orientation,
        direction,
      }}
    >
      <div
        tabIndex={0}
        onKeyDownCapture={handleKeyDown}
        className={cn(
          "grid w-full focus:outline-none overflow-hidden ",
          className,
          {
            "gap-2": value && value.length > 0,
          }
        )}
        dir={dir}
        {...props}
      >
        {children}
      </div>
    </FileUploaderContext.Provider>
  );
};
export const FileUploaderContent = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { orientation } = useFileUpload();
  return (
    <div className={cn("w-full px-1")} aria-description="content file holder">
      <div
        {...props}
        className={cn(
          "flex rounded-xl gap-1",
          orientation === "horizontal" ? "flex-raw flex-wrap" : "flex-col",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

interface FileUploaderItemProps extends React.ComponentProps<"div"> {
  index: number;
}

export const FileUploaderItem = ({
  className,
  index,
  children,
  ...props
}: FileUploaderItemProps) => {
  const { removeFileFromSet, activeIndex, direction } = useFileUpload();
  const isSelected = index === activeIndex;
  return (
    <div
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-6 p-1 justify-between cursor-pointer relative",
        className,
        isSelected ? "bg-muted" : ""
      )}
      {...props}
    >
      <div className="font-medium leading-none tracking-tight flex items-center gap-1.5 h-full w-full">
        {children}
      </div>
      <button
        type="button"
        className={cn(
          "absolute",
          direction === "rtl" ? "top-1 left-1" : "top-1 right-1"
        )}
        onClick={() => removeFileFromSet(index)}
      >
        <span className="sr-only">remove item {index}</span>
        <RemoveIcon className="w-4 h-4 hover:stroke-destructive duration-200 ease-in-out" />
      </button>
    </div>
  );
};

export const FileInput = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { dropzoneState, isFileTooBig, isLOF } = useFileUpload();
  const rootProps = isLOF ? {} : dropzoneState.getRootProps();
  return (
    <div
      {...props}
      className={cn(`relative w-full ${
        isLOF ? "opacity-50 cursor-not-allowed " : "cursor-pointer "
      }`, "rounded-lg overflow-hidden", )}
    >
      <div
        className={cn(
          `w-full rounded-lg overflow-hidden duration-300 ease-in-out
         ${
           dropzoneState.isDragAccept
             ? "border-green-500"
             : dropzoneState.isDragReject || isFileTooBig
             ? "border-red-500"
             : "border-gray-300"
         }`,
          className
        )}
        {...rootProps}
      >
        {children}
      </div>
      <Input
        ref={dropzoneState.inputRef}
        disabled={isLOF}
        {...dropzoneState.getInputProps()}
        className={`${isLOF ? "cursor-not-allowed" : ""}`}
      />
    </div>
  );
};
