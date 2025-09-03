import type { TraceSpan } from "@ai-agent-trace-ui/types";

import { findTimeRange, flattenSpans } from "@ai-agent-trace-ui/data";
import cn from "classnames";
import { type FC } from "react";

import { SpanCard } from "./SpanCard/SpanCard";

interface TreeViewProps {
  spans: TraceSpan[];
  className?: string;
  selectedSpan?: TraceSpan;
  onSpanSelect?: (span: TraceSpan) => void;
  expandButton: "inside" | "outside";
  expandedSpansIds: string[];
  onExpandSpansIdsChange: (ids: string[]) => void;
}

export const TreeView: FC<TreeViewProps> = ({
  spans,
  onSpanSelect,
  className = "",
  selectedSpan,
  expandButton,
  expandedSpansIds,
  onExpandSpansIdsChange,
}) => {
  const allCards = flattenSpans(spans);

  const { minStart, maxEnd } = findTimeRange(allCards);

  return (
    <div className="w-full p-2 pt-4">
      <ul
        className={cn(className, "overflow-x-auto")}
        role="tree"
        aria-label="Hierarchical card list"
      >
        {spans.map((span, idx) => (
          <SpanCard
            expandButton={expandButton}
            key={span.id}
            data={span}
            level={0}
            selectedSpan={selectedSpan}
            onSpanSelect={onSpanSelect}
            minStart={minStart}
            maxEnd={maxEnd}
            isLastChild={idx === spans.length - 1}
            expandedSpansIds={expandedSpansIds}
            onExpandSpansIdsChange={onExpandSpansIdsChange}
          />
        ))}
      </ul>
    </div>
  );
};
