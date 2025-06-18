import React from "react";

const DashboardLayoutFragments = ({
  title,
  description,
  children,
}: {
  title?: string;
  children: React.ReactNode;
  description?: string;
}) => {
  return (
    <div className="px-5 my-6 container mx-auto">
      <div className="mb-3 ml-4 max-w-lg">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm mt-2">{description}</p>
      </div>
      <div className="relative flex justify-center">{children}</div>
    </div>
  );
};

export default DashboardLayoutFragments;
