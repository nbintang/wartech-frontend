"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ProgressLoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <ProgressProvider
      height="4px"
      color={resolvedTheme === "dark" ? "#fff" : "#000"}
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default ProgressLoaderProvider;