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

interface MonthlyActivityChartProps {
  data: MonthlyActivity[];
  height?: number;
}

export const MonthlyActivityChart: React.FC<MonthlyActivityChartProps> = ({ 
  data, 
  height = 360 
}) => {
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-5 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          Monthly Activity
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Commits, pull requests, and code reviews over the last 6 months
        </p>
      </div>
      <div className="p-5" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingTop: 16,
                fontSize: 12,
                color: "var(--muted-foreground)",
              }}
            />
            <Bar
              dataKey="commits"
              fill="var(--chart-1)"
              name="Commits"
              radius={[4, 4, 0, 0]}
              barSize={22}
            />
            <Bar
              dataKey="prs"
              fill="var(--chart-2)"
              name="Pull Requests"
              radius={[4, 4, 0, 0]}
              barSize={22}
            />
            <Bar
              dataKey="reviews"
              fill="var(--chart-3)"
              name="Code Reviews"
              radius={[4, 4, 0, 0]}
              barSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
