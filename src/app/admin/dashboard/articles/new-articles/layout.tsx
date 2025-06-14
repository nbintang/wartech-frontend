import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardFragments from "@/features/admin/components/DashboardFragments";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <DashboardFragments
        title="New Article"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni blanditiis officia tempora."
      >
        {children}
      </DashboardFragments>
    </TooltipProvider>
  );
}
