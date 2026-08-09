import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MONTH_NAMES } from "../types";

// Renders the GitHub contribution heatmap using the calendar data provided by the server, displays the weeks and days it receives, only handling month labels and contribution colors.

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendarData {
  weeks: ContributionWeek[];
  totalContributions: number;
}

interface ContributionHeatmapProps {
  data: ContributionCalendarData;
}

// Every cell represents the actual number of contributions reported by GitHub for that day. The data comes directly from GitHub's contribution calendar

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  data,
}) => {
  const { weeks, monthLabels, maxCount } = React.useMemo(() => {
    let max = 0;
    for (const week of data.weeks) {
      for (const day of week.contributionDays) {
        if (day.count > max) max = day.count;
      }
    }

    const labels: { label: string; weekIndex: number }[] = [];
    let lastLabelMonth = -1;

    data.weeks.forEach((week, weekIndex) => {
      const firstDay = week.contributionDays[0];
      if (!firstDay) return;

      const date = new Date(firstDay.date + "T00:00:00");
      if (date.getDate() <= 7 && date.getMonth() !== lastLabelMonth) {
        labels.push({ label: MONTH_NAMES[date.getMonth()], weekIndex });
        lastLabelMonth = date.getMonth();
      }
    });

    return { weeks: data.weeks, monthLabels: labels, maxCount: max };
  }, [data]);

  const getLevel = (count: number): number => {
    if (count === 0 || maxCount === 0) return 0;
    const ratio = count / maxCount;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  // Level 0 represents a day with no activity, so it should look like "no data" rather than a very faint version of the lowest activity level.

  const getLevelColor = (level: number): string =>
    [
      "bg-hairline dark:bg-white/5",
      "bg-chart-1/15",
      "bg-chart-1/35",
      "bg-chart-1/60",
      "bg-chart-1/85",
    ][level] ?? "bg-hairline dark:bg-white/5";

  if (weeks.length === 0) {
    return (
      <p className="py-8 text-center text-meta text-muted-foreground">
        No contribution data available.
      </p>
    );
  }

  return (
    <TooltipProvider delayDuration={80}>
      <div className="space-y-2 overflow-x-auto">
        <div
          className="relative ml-8 text-[11px] text-stone"
          style={{ width: `${weeks.length * 14}px`, height: 14 }}
        >
          {monthLabels.map(({ label, weekIndex }) => (
            <span
              key={`${label}-${weekIndex}`}
              className="absolute"
              style={{ left: weekIndex * 14 }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex gap-1.5">
          <div className="flex w-7 shrink-0 flex-col gap-0.5 pt-px text-[10px] text-stone">
            {["", "Mon", "", "Wed", "", "Fri", ""].map((day, i) => (
              <div key={i} className="h-2.75 flex items-center justify-end">
                {day}
              </div>
            ))}
          </div>

          <div className="flex gap-0.5">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.contributionDays.map((day: ContributionDay) => (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <div
                        tabIndex={0}
                        className={`size-2.75 cursor-default rounded-[2px] transition-transform hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring ${getLevelColor(getLevel(day.count))}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-meta">
                        {new Date(day.date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>

                      <p className="text-meta opacity-70">
                        {day.count} contribution{day.count !== 1 ? "s" : ""}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="ml-9 flex items-center justify-between pt-1 text-[11px] text-stone">
          <div className="flex items-center gap-1">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`size-2.75 rounded-[2px] ${getLevelColor(level)}`}
              />
            ))}
            <span>More</span>
          </div>
          <span>{data.totalContributions.toLocaleString()} contributions</span>
        </div>
      </div>
    </TooltipProvider>
  );
};
