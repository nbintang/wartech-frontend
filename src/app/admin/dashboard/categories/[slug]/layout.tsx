import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayoutFragments from "@/features/admin/components/DashboardLayoutFragments";
import { capitalizeFirstLetter } from "@/lib/utils";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <TooltipProvider>
      <DashboardLayoutFragments
        title={capitalizeFirstLetter(slug)}
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni blanditiis officia tempora."
      >
        {children}
        
      </DashboardLayoutFragments>
    </TooltipProvider>
  );
}
