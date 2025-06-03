import UserProfile from "@/components/UserProfile";
import SignOut from "@/features/auth/signout/components/SignOut";

export default function Home() {
  return (
    <main className="grid place-items-center min-h-screen">
      <div className="flex flex-col gap-2 justify-center items-center">
        <UserProfile />
        <SignOut />
      </div>
    </main>
  );
}
