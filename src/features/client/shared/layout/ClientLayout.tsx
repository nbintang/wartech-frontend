"use client";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import HeaderNews from "../HeaderNews";
import FooterNews from "../FooterNews";
type ClientLayoutProps = {
  children: React.ReactNode;
};

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const pathname = usePathname();

  const isProtectedRoutes =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/reporter") ||
    pathname.startsWith("/auth") 
  if (!isProtectedRoutes) {
    return (
      <main className="max-w-7xl mx-auto  sm:px-6 lg:px-8 pb-8 pt-4">
        <HeaderNews />
        {children}
        <FooterNews />
      </main>
    );
  }

  return children;
};

export default ClientLayout;
