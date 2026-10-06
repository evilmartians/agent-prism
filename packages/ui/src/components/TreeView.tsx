import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { findTimeRange, flattenSpans } from "@evilmartians/agent-prism-data";
import cn from "classnames";
import { type FC } from "react";

import type { SpanCardViewOptions } from "./SpanCard/SpanCard";

import { getSpanBrandAvatar } from "./SpanCard/getSpanBrandAvatar";
import { SpanCard } from "./SpanCard/SpanCard";

type TreeViewProps = {
  className?: string | undefined;
  expandedSpansIds: string[];
  onExpandSpansIdsChange: (ids: string[]) => void;
  onSpanSelect?: ((span: TraceSpan) => void) | undefined;
  selectedSpan?: TraceSpan | undefined;
  spanCardViewOptions?: SpanCardViewOptions | undefined;
  spans: TraceSpan[];
};

export const TreeView: FC<TreeViewProps> = ({
  className = "",
  expandedSpansIds,
  onExpandSpansIdsChange,
  onSpanSelect,
  selectedSpan,
  spanCardViewOptions,
  spans,
}) => {
  const allCards = flattenSpans(spans);
  const { maxEnd, minStart } = findTimeRange(allCards);

  return (
    <div className="w-full min-w-0 px-4">
      <ul
        aria-label="Hierarchical card list"
        className={cn(className, "overflow-x-auto pt-2")}
        role="tree"
      >
        {spans.map((span, idx) => (
          <SpanCard
            avatar={getSpanBrandAvatar(span)}
            data={span}
            expandedSpansIds={expandedSpansIds}
            isLastChild={idx === spans.length - 1}
            key={span.id}
            level={0}
            maxEnd={maxEnd}
            minStart={minStart}
            onExpandSpansIdsChange={onExpandSpansIdsChange}
            onSpanSelect={onSpanSelect}
            selectedSpan={selectedSpan}
            viewOptions={spanCardViewOptions}
          />
        ))}
      </ul>
    </div>
  );
};
