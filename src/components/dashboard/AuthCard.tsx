import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { BotIcon } from "lucide-react";
interface AuthCardProps extends React.ComponentProps<"div"> {
  title: string;
  description: string;
}
export default function AuthCard({
  title,
  description,
  className,
  children,
  ...props
}: AuthCardProps) {
  return (
    <Card className="relative" {...props}>
      <CardHeader className="space-y-1">
        <Link
          href="#"
          className="flex items-center gap-2 font-medium  text-xs top-4 left-4"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <BotIcon className="size-4" />
          </div>
          Warta Technologies
        </Link>
        <CardTitle className="text-2xl font-bold text-center">
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
