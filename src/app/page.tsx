import UserProfile from "@/components/UserProfile";

export default function Home() {
  return (
    <main className="grid place-items-center min-h-screen">
      <div className="flex flex-col gap-2 justify-center items-center">
        <UserProfile />
    
      </div>
    </main>
  );
}
