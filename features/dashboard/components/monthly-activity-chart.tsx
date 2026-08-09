import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyActivity } from "../types";

// Renders the dashboard's 6-month activity chart from the already-aggregated monthly activity data, it receives

interface MonthlyActivityChartProps {
  data: MonthlyActivity[];
  height?: number;
}

export const MonthlyActivityChart: React.FC<MonthlyActivityChartProps> = ({
  data,
  height = 200,
}) => {
  return (
    <div className="rounded-md border border-hairline bg-card dark:border-white/10">
      <div className="border-b border-hairline px-5 py-4 dark:border-white/10">
        <h2 className="text-heading-sm text-foreground">Monthly activity</h2>

        <p className="mt-1.5 text-meta text-muted-foreground">
          Commits, pull requests and reviews over the last 6 months
        </p>
      </div>

      <div className="p-4" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--rule)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--stone)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--stone)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--rule)",
                borderRadius: "6px",
                color: "var(--foreground)",
                fontSize: 12,
                boxShadow: "none",
              }}
              cursor={{ fill: "var(--rule)", opacity: 0.5 }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingTop: 8,
                fontSize: 11,
                color: "var(--muted-foreground)",
              }}
            />
            <Bar
              dataKey="commits"
              fill="var(--chart-1)"
              name="Commits"
              radius={[4, 4, 0, 0]}
              barSize={14}
            />
            <Bar
              dataKey="prs"
              fill="var(--chart-2)"
              name="Pull Requests"
              radius={[4, 4, 0, 0]}
              barSize={14}
            />
            <Bar
              dataKey="reviews"
              fill="var(--chart-3)"
              name="Code Reviews"
              radius={[4, 4, 0, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
