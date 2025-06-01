"use client";

import { Button } from "@/components/ui/button";
import SignOut from "@/features/auth/signout/components/SignOut";
import useFetchProtectedData from "@/hooks/useFetchProtectedData";
import { axiosInstance } from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data, error, isLoading } = useFetchProtectedData({
    TAG: "account",
    endpoint: "/users",
  });
  if (error) {
    return <>{error.message}</>;
  }

  console.log(data);
  return (
    <main className="grid place-items-center min-h-screen">
      {isLoading ? "Loading..." : <SignOut />}
    </main>
  );
}
