"use client";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts";
import { useMemo } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import DashboardRootCardLayout from "./DashboardRootCardLayout";
import { UsersApiResponse } from "@/types/api/UserApiResponse";

type UserChartProps = {
  users: UsersApiResponse[];
  redirectUrl?: string;
};

const chartConfig = {
  users: {
    label: "New Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function UserChart({ users, redirectUrl }: UserChartProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};

    users.forEach((user) => {
      const date = new Date(user.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`; // e.g. "2025-06"

      counts[monthKey] = (counts[monthKey] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, users]) => ({ period, users }));

    return sorted;
  }, [users]);

  return (
    <DashboardRootCardLayout
      redirectUrl={redirectUrl}
      title="User Growth"
      description="Jumlah user baru per bulan berdasarkan tanggal pendaftaran."
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] min-w-[200px] w-full"
      >
        <LineChart
          data={chartData}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={20}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="users"
                labelFormatter={(val) => `Bulan: ${val}`}
              />
            }
          />
          <Line
            dataKey="users"
            type="monotone"
            stroke="var(--color-users)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </DashboardRootCardLayout>
  );
}

export default UserChart;