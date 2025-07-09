export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="relative ">
        <div className="w-full h-24 md:h-36 bg-accent" />
        <div className="container mx-auto">{children}</div>
      </div>
    </main>
  );
}
