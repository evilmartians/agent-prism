import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { getTimelineData } from "@evilmartians/agent-prism-data";
import cn from "classnames";

import type { ColorVariant } from "../shared";

interface SpanCardTimelineProps {
  spanCard: TraceSpan;
  theme: ColorVariant;
  minStart: number;
  maxEnd: number;
  className?: string;
}

const timelineBgColors: Record<ColorVariant, string> = {
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  yellow: "bg-yellow-500",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
  gray: "bg-gray-500",
};

export const SpanCardTimeline = ({
  spanCard,
  theme,
  minStart,
  maxEnd,
  className,
}: SpanCardTimelineProps) => {
  const { startPercent, widthPercent } = getTimelineData({
    spanCard,
    minStart,
    maxEnd,
  });

  return (
    <span
      className={cn(
        "relative flex h-4 min-w-20 flex-1 rounded-md bg-gray-200 dark:bg-gray-900",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-x-1 top-1/2 h-1.5 -translate-y-1/2">
        <span
          className={`absolute h-full rounded-sm ${timelineBgColors[theme]}`}
          style={{
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
          }}
        />
      </span>
    </span>
  );
};
