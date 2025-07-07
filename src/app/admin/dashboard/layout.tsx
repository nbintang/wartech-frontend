import ImageDialog from "@/components/ImageDialog";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import SearchDashboardMenuDialog from "@/components/SearchDashboardMenu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import WarningDialog from "@/components/WarningDialog";
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col relative">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <SearchDashboardMenuDialog />
      <WarningDialog />
      <ImageDialog />
    </>
  );
}
