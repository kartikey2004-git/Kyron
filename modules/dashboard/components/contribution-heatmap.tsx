import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MonthlyActivity, HeatmapData } from "../types";
import { MONTH_NAMES, MONTH_IDX, seededRandom } from "../types";

interface ContributionHeatmapProps {
  data: MonthlyActivity[];
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  data,
}) => {
  const heatmapData: HeatmapData = React.useMemo(() => {
    if (!data.length)
      return { weeks: [], totalContributions: 0, monthLabels: [] };

    const monthTotals = new Map<string, number>();
    let total = 0;

    for (const month of data) {
      const sum = month.commits + month.prs + month.reviews;
      total += sum;
      monthTotals.set(month.name, sum);
    }

    const maxMonthly = Math.max(...[...monthTotals.values()]);
    const maxDaily = maxMonthly / 22;

    const getLevel = (count: number): number => {
      if (count === 0) return 0;
      const ratio = count / maxDaily;
      if (ratio < 0.25) return 1;
      if (ratio < 0.5) return 2;
      if (ratio < 0.75) return 3;
      return 4;
    };

    const firstMonthIdx = MONTH_IDX[data[0].name];
    const lastMonthIdx = MONTH_IDX[data[data.length - 1].name];
    const now = new Date();
    const endYear = now.getFullYear();
    const startYear = firstMonthIdx > lastMonthIdx ? endYear - 1 : endYear;

    const endDate = new Date(endYear, lastMonthIdx + 1, 0);
    const startDate = new Date(startYear, firstMonthIdx, 1);

    const gridStart = new Date(startDate);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());
    const gridEnd = new Date(endDate);
    gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay()));

    const weeks: {
      contributionDays: { date: string; count: number; level: number }[];
    }[] = [];
    const monthLabels: { label: string; weekIndex: number }[] = [];
    const cursor = new Date(gridStart);
    let weekIndex = 0;
    let lastLabelMonth = -1;

    while (cursor <= gridEnd) {
      const week: {
        contributionDays: { date: string; count: number; level: number }[];
      } = { contributionDays: [] };

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const date = new Date(cursor);
        const monthName = MONTH_NAMES[date.getMonth()];
        const monthTotal = monthTotals.get(monthName) ?? 0;

        if (
          date.getDate() <= 7 &&
          date.getMonth() !== lastLabelMonth &&
          monthTotals.has(monthName)
        ) {
          monthLabels.push({ label: monthName, weekIndex });
          lastLabelMonth = date.getMonth();
        }

        let count = 0;
        if (monthTotal > 0) {
          const dateStr = date.toISOString().split("T")[0];
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const daysInMonth = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0,
          ).getDate();
          const avg = monthTotal / daysInMonth;
          count = Math.max(
            0,
            Math.floor(
              (isWeekend ? avg * 0.3 : avg) *
                (0.2 + seededRandom(dateStr) * 1.6),
            ),
          );
        }

        week.contributionDays.push({
          date: date.toISOString().split("T")[0],
          count,
          level: getLevel(count),
        });
        cursor.setDate(cursor.getDate() + 1);
      }

      weeks.push(week);
      weekIndex++;
    }

    return { weeks, totalContributions: total, monthLabels };
  }, [data]);

  const getLevelColor = (level: number): string =>
    [
      "bg-muted/40",
      "bg-chart-1/20",
      "bg-chart-1/40",
      "bg-chart-1/60",
      "bg-chart-1/85",
    ][level] ?? "bg-muted/40";

  return (
    <TooltipProvider delayDuration={80}>
      <div className="space-y-2 overflow-x-auto">
        <div
          className="relative text-[11px] text-muted-foreground ml-8"
          style={{ width: `${heatmapData.weeks.length * 14}px`, height: 14 }}
        >
          {heatmapData.monthLabels.map(({ label, weekIndex }) => (
            <span
              key={label}
              className="absolute"
              style={{ left: weekIndex * 14 }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex gap-1.5">
          <div className="flex flex-col gap-[2px] text-[10px] text-muted-foreground w-7 shrink-0 pt-px">
            {["", "Mon", "", "Wed", "", "Fri", ""].map((day, i) => (
              <div key={i} className="h-[11px] flex items-center justify-end">
                {day}
              </div>
            ))}
          </div>

          <div className="flex gap-[2px]">
            {heatmapData.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.contributionDays.map((day) => (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-[11px] h-[11px] rounded-[2px] border border-border/20 cursor-default transition-transform hover:scale-125 ${getLevelColor(day.level)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs font-medium">
                        {new Date(day.date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>

                      <p className="text-xs text-background/70">
                        {day.count} contribution{day.count !== 1 ? "s" : ""}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between ml-9 text-[11px] text-muted-foreground pt-1">
          <div className="flex items-center gap-1">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-[11px] h-[11px] rounded-[2px] border border-border/20 ${getLevelColor(level)}`}
              />
            ))}
            <span>More</span>
          </div>
          <span>
            {heatmapData.totalContributions.toLocaleString()} contributions
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
};
