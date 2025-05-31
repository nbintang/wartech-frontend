"use client";
import SignOut from "@/features/auth/signout/components/SignOut";
import { axiosInstance } from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Home() {
  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/protected/users/profile");
      return res.data;
    },
  });
  if (error) {
    return <>{error.message}</>;
  }
  console.log(data);
  return (
    <main className="grid place-items-center min-h-screen">
      <div className="flex flex-col gap-6 justify-center items-center">
        {isSuccess && <p>{JSON.stringify(data.data)}</p>}
        {isLoading ? "Loading..." : <SignOut />}
      </div>
    </main>
  );
}
