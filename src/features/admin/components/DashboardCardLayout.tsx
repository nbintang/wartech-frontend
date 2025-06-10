import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface DashboardRootCardLayoutProps
  extends React.ComponentProps<typeof Card> {
  title: string;
  description?: string;
}
const DashboardCardLayout = ({
  className,
  title,
  description,
  children,
  ...props
}: DashboardRootCardLayoutProps) => {
  return (
    <Card className={cn(" ", className)} {...props}>
      <CardHeader className="pb-4 max-w-2xl">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className=" py-2 w-full  ">
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCardLayout;
