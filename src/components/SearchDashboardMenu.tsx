"use client";

import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandDialog,
} from "@/components/ui/command";
import useSearchDashboardMenu from "@/hooks/store/useSearchDashboardMenu";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { navData } from "./dashboard/app-sidebar";
import { cn } from "@/lib/utils";
import { useProgress } from "@bprogress/next";

export default function SearchDashboardMenuDialog() {
  const { open, setOpen, toggleOpen } = useSearchDashboardMenu();
  const router = useRouter();
  const loader = useProgress();
  const pathname = usePathname();
  const firstVisibleItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleOpen();
      }
      if (e.key === "Enter" && open) {
        e.preventDefault();
        firstVisibleItemRef.current?.click();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  useEffect(() => {
    if (open) {
      firstVisibleItemRef.current = null;
    }
  }, [open]);

  const handleSelect = async (url: string) => {
    loader.start(0);
    setOpen(false);
    try {
      await router.push(url);
    } finally {
      loader.stop(200);
    }
  };

  return (
    <CommandDialog  open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
      />
      <CommandList >
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(navData).map(([key , items]) => (
          <CommandGroup key={key} heading={key}>
            {items.map((item) => (
              <CommandItem
                key={item.url}
                ref={(el) => {
                  if (!firstVisibleItemRef.current && el) {
                    firstVisibleItemRef.current = el;
                  }
                }}
                onSelect={() => handleSelect(item.url)}
                className={cn(
                  "cursor-pointer my-0.5",
                  pathname === item.url ? "bg-muted" : ""
                )}
              >
                <item.icon className="mr-2 size-4" />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
