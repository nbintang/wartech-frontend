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
    pathname.startsWith("/auth") ||
    pathname.startsWith("/profile");
  if (!isProtectedRoutes) {
    return (
      <main className="">
        <HeaderNews />
        {children}
        <FooterNews />
      </main>
    );
  }

  return children;
};

export default ClientLayout;
