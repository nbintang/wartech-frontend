"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type SvgIconProps = React.HTMLAttributes<SVGElement>;

const DefaultSeparatorIcon = (props: SvgIconProps): React.JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m9 18 6-6-6-6"></path>
  </svg>
);

interface DynamicBreadcrumbProps extends React.ComponentProps<typeof Breadcrumb> {
  path: string;
  formatLabel?: (label: string) => string;
  separatorClassName?: string;
  excludeSegments?: string[];
  appendSegments?: string[];
  showSeparator?: boolean;
  SeparatorIcon?: (props: SvgIconProps) => React.JSX.Element;
}

/**
 * 
 * @example 
 * how to use it
 * <DynamicBreadcrumb path={pathname} />
 * free to modify the options
 * 
 * @returns 
 */

const DynamicBreadcrumb = ({
  path,
  className,
  formatLabel = (label) =>
    label.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
  showSeparator = true,
  excludeSegments,
  appendSegments,
  SeparatorIcon = DefaultSeparatorIcon,
  separatorClassName,
  ...props
}: DynamicBreadcrumbProps) => {
  const isMobile = useIsMobile();

  let pathSegments = path.split("/").filter(Boolean);
  if (excludeSegments && excludeSegments.length > 0) {
    pathSegments = pathSegments.filter((segment) => !excludeSegments.includes(segment));
  }
  if (appendSegments && appendSegments.length > 0) {
    pathSegments = [...pathSegments, ...appendSegments];
  }

  const maxVisibleSegments = 2;
  const shouldShowEllipsis = pathSegments.length > maxVisibleSegments && isMobile;
  return (
    <Breadcrumb className={cn(className)} {...props}>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isFirstSegment = index === 0;
          const isLastSegment = index === pathSegments.length - 1;
          const isEllipsisInsertionPoint = shouldShowEllipsis && index === 1;
          const isLastVisibleBeforeEllipsis =
            shouldShowEllipsis && index === pathSegments.length - 2;

          const isSegmentVisible =
            !shouldShowEllipsis ||
            isFirstSegment ||
            isLastSegment ||
            isLastVisibleBeforeEllipsis;

          const formattedSegmentLabel = formatLabel(segment);

          return (
            <React.Fragment key={segment}>
              {isEllipsisInsertionPoint ? (
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
              ) : isSegmentVisible ? (
                <BreadcrumbItem>
                  {isLastSegment ? (
                    <BreadcrumbPage className={cn("font-semibold text-foreground truncate w-full max-w-[100px] md:max-w-none")} >{formattedSegmentLabel}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>
                      {formattedSegmentLabel}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              ) : null}

              {showSeparator && isSegmentVisible && !isLastSegment && (
                <BreadcrumbSeparator>
                  <SeparatorIcon
                    role="presentation"
                    aria-hidden="true"
                    className={cn("w-3.5 h-3.5", separatorClassName)}
                  />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;