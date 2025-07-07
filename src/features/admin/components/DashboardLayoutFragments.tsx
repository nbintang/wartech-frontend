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
    <div className="px-5 my-6 w-full mx-auto">
      <div className="mb-3 ml-4 max-w-lg">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="text-muted-foreground text-sm mt-2">{description}</p>
      </div>
      <div className="relative flex justify-center">{children}</div>
    </div>
  );
};

export default DashboardLayoutFragments;
