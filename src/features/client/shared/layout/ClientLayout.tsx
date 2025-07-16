"use client";
import { usePathname } from "next/navigation";
import React from "react";
import HeaderNews from "../HeaderNews";
import FooterNews from "../FooterNews";
type ClientLayoutProps = {
  children: React.ReactNode;
};

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const pathname = usePathname();
  const isProtectedRoutes = pathname.startsWith("/admin") || pathname.startsWith("/reporter") || pathname.startsWith("/auth");
  return (
    <div className="flex flex-col min-h-screen">
      {!isProtectedRoutes && <HeaderNews />}
      <main className="flex-1">{children}</main>
      {!isProtectedRoutes && <FooterNews />}
    </div>
  );
};

export default ClientLayout;
