import DashboardFragments from "@/features/admin/components/DashboardFragments";
import RootListDashboardPage from "@/features/admin/root";

export default function Page() {
  return (
    <DashboardFragments
      title={"Recent Activities"}
      description={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni blanditiis officia tempora.`}
    >
      <div className="border-muted relative flex w-full space-y-3 py-3  flex-col mx-auto ">
        <RootListDashboardPage />
      </div>
    </DashboardFragments>
  );
}
