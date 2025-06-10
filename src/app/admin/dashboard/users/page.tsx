import DashboardCardLayout from "@/features/admin/components/DashboardCardLayout";
import UserDashboardPage from "@/features/admin/users";

export default function UserPage() {
  return (
    <DashboardCardLayout
      title="Users"
      description="
            Lorem ipsum dolor sit ametr explicabo pariatur suscipit, corporis mollitia placeat ex recusandae molestias in, eos at, natus harum id optio neque earum."
      className=" min-h-screen md:mx-6 mx-3 my-6"
    >
      <UserDashboardPage />
    </DashboardCardLayout>
  );
}
