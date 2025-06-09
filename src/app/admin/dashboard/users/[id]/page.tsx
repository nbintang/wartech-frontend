import UserProfilePage from "@/features/admin/users/components/UserProfilePage";

export default async function UserByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <UserProfilePage id={id} />;
}
