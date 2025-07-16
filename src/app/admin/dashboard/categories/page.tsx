import CategoriesDashboardPage from "@/features/admin/categories";
import CategoryFormDialog from "@/features/admin/categories/components/CategoryFormDialog";
import DashboardCardLayout from "@/features/admin/components/DashboardCardLayout";

export default function Categories() {
  return (
    <DashboardCardLayout
      title="Categories"
      description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas dolorum repudiandae consequatur explicabo pariatur suscipit, corporis mollitia placeat ex recusandae molestias in, eos at, natus harum id optio neque earum."
      className=" min-h-screen md:mx-5 mx-3 my-6"
    >
      <CategoriesDashboardPage />
      <CategoryFormDialog />
    </DashboardCardLayout>
  );
}
