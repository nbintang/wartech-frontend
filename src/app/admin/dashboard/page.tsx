"use client";

import UserProfile from "@/components/UserProfile";
import SignOut from "@/features/auth/signout/components/SignOut";
import useFetchProtectedData from "@/hooks/useFetchProtectedData";

export default function Dashboard() {
  const { data, error, isLoading } = useFetchProtectedData({
    TAG: "users",
    endpoint: "/users",
  });

  if (error) {
    return <>{error.message}</>;
  }

  console.log(data);
  return (
    <main className="grid place-items-center min-h-screen">
      <div className="space-y-3">
        <UserProfile />
        <SignOut />
      </div>
    </main>
  );
}
