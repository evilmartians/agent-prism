import type { TraceRecord } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";
import { ArrowLeft } from "lucide-react";

import type { BadgeProps } from "../Badge";

import { Badge } from "../Badge";
import { IconButton } from "../IconButton";
import { TraceListItem } from "./TraceListItem";

type TraceListProps = {
  className?: string | undefined;
  expanded: boolean;
  onExpandStateChange: (expanded: boolean) => void;
  onTraceSelect?: ((trace: TraceRecord) => void) | undefined;
  selectedTrace?: TraceRecord | undefined;
  traces: TraceRecordWithBadges[];
};

type TraceRecordWithBadges = TraceRecord & {
  badges?: BadgeProps[] | undefined;
};

export const TraceList = ({
  className,
  expanded,
  onExpandStateChange,
  onTraceSelect,
  selectedTrace,
  traces,
}: TraceListProps): ReactElement => {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col",
        expanded ? "size-full gap-3" : "h-auto w-fit gap-1",
        className,
      )}
    >
      <div className="flex min-h-6 shrink-0 items-center justify-between gap-2">
        <div
          className={cn(
            "flex items-center gap-2",
            expanded ? "opacity-100" : "hidden opacity-0",
          )}
        >
          <h2 className="text-agentprism-muted-foreground">Traces</h2>

          <Badge
            aria-label={`Total number of traces: ${traces.length}`}
            label={traces.length}
            size="5"
          />
        </div>

        <IconButton
          aria-label={expanded ? "Collapse Trace List" : "Expand Trace List"}
          onClick={() => {
            onExpandStateChange(!expanded);
          }}
        >
          <ArrowLeft className={cn("size-3", expanded ? "" : "rotate-180")} />
        </IconButton>
      </div>

      {expanded ? (
        <div className="border-agentprism-border flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
          <ul className="flex-1 overflow-y-auto">
            {traces.map((trace) => (
              <li
                className="border-agentprism-border w-full list-none border-b [&:not(:last-child)]:border-b"
                key={trace.id}
              >
                <TraceListItem
                  badges={trace.badges}
                  isSelected={selectedTrace?.id === trace.id}
                  onClick={() => onTraceSelect?.(trace)}
                  showDescription={false}
                  trace={trace}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
