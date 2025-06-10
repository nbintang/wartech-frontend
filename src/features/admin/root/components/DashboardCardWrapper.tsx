import { Card } from '@/components/ui/card';
import React from 'react'
import DashboardRootCardLayout from './DashboardRootCardLayout';
import { cn } from '@/lib/utils';
import SkeletonDashboardCard from '../../components/SkeletonDashboardCard';
interface DashboardCardWrapperProps extends React.ComponentProps<typeof Card> {
  isLoading: boolean;
  isFetching?: boolean;
  isSuccess: boolean;
  title: string;
  description: string;
  redirectUrl?: string;
}
const DashboardCardWrapper = ({
  isLoading,
  isFetching,
  isSuccess,
  children,
  title,
  description,
  redirectUrl,
  className,
}: DashboardCardWrapperProps) => {
 if (isLoading || isFetching) {
    return (
      <DashboardRootCardLayout
        title={title}
        description={description}
        redirectUrl={redirectUrl}
        className={cn("relative", className)}
      >
        <SkeletonDashboardCard className='h-full' />
      </DashboardRootCardLayout>
    );
  }

  if (isSuccess) {
    return (
      <DashboardRootCardLayout
        title={title}
        description={description}
        redirectUrl={redirectUrl}
        className={cn("relative", className)}
      >
        {children}
      </DashboardRootCardLayout>
    );
  }

  return null;
}

export default DashboardCardWrapper