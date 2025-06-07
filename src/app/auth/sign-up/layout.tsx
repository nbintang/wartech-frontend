import { BotIcon } from "lucide-react";
import Link from "next/link";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <BotIcon className="size-4" />
            </div>
            Warta Technologies
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 h-full w-full object-cover bg-secondary" />
      </div>
    </main>
  );
}
