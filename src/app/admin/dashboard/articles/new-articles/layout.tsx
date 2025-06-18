import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayoutFragments from "@/features/admin/components/DashboardLayoutFragments";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <DashboardLayoutFragments
        title="New Article"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni blanditiis officia tempora."
      >
        {children}
      </DashboardLayoutFragments>
    </TooltipProvider>
  );
}
