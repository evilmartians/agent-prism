import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { flattenSpans, findTimeRange } from "@evilmartians/agent-prism-data";
import cn from "classnames";
import { type FC } from "react";

import type { SpanCardViewOptions } from "./SpanCard/SpanCard";

import { getSpanBrandAvatar } from "./SpanCard/getSpanBrandAvatar";
import { SpanCard } from "./SpanCard/SpanCard";

type TreeViewProps = {
  spans: TraceSpan[];
  className?: string | undefined;
  selectedSpan?: TraceSpan | undefined;
  onSpanSelect?: ((span: TraceSpan) => void) | undefined;
  expandedSpansIds: string[];
  onExpandSpansIdsChange: (ids: string[]) => void;
  spanCardViewOptions?: SpanCardViewOptions | undefined;
};

export const TreeView: FC<TreeViewProps> = ({
  spans,
  onSpanSelect,
  className = "",
  selectedSpan,
  expandedSpansIds,
  onExpandSpansIdsChange,
  spanCardViewOptions,
}) => {
  const allCards = flattenSpans(spans);
  const { minStart, maxEnd } = findTimeRange(allCards);

  return (
    <div className="w-full min-w-0 px-4">
      <ul
        className={cn(className, "overflow-x-auto pt-2")}
        role="tree"
        aria-label="Hierarchical card list"
      >
        {spans.map((span, idx) => (
          <SpanCard
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
            viewOptions={spanCardViewOptions}
            avatar={getSpanBrandAvatar(span)}
          />
        ))}
      </ul>
    </div>
  );
};
