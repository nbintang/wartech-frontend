import { TooltipProvider } from "@/components/ui/tooltip";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="my-4 px-4">
      <TooltipProvider>
        <div className="mb-3 ml-4 max-w-lg">
          <h1 className="text-4xl font-semibold">Update Article</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
            suscipit explicabo ipsum asperiores animi accusantium harum hic amet
            et non do
          </p>
        </div>
        {children}
      </TooltipProvider>
    </main>
  );
}
