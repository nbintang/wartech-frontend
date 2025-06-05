export default function UpdateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex min-h-screen flex-col absolute inset-0 -z-10 h-full w-full bg-black">
      <main className="flex-1 container fixed left-1/2 top-1/2 flex w-screen -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center px-0 ">
        {children}
      </main>
    </div>
  );
}
