import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

interface DashboardRootCardLayoutProps extends React.ComponentProps<typeof Card> {
  title: string;
  description?: string;
  redirectUrl?: string
  redirectName?: string
}
function DashboardRootCardLayout({
  className,
  title,
  description,
  children,
  redirectUrl,
  redirectName = "See More",
  ...props
}: DashboardRootCardLayoutProps) {
  return (
    <Card className={cn(" h-[400px] md:h-[500px]", className)} {...props}>
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className=" py-2 w-full  flex-1 overflow-hidden">
    
          {children}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="" variant="ghost" asChild>
          <Link href={`/admin/dashboard${redirectUrl}`}>
          {redirectName}
            <ArrowRightIcon />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DashboardRootCardLayout;
