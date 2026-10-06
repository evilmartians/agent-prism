import type { TraceViewerLayoutProps } from "@evilmartians/agent-prism-ui";

export type SimpleTraceViewerLayoutProps = Pick<
  TraceViewerLayoutProps,
  | "expandedSpansIds"
  | "filteredSpans"
  | "handleCollapseAll"
  | "handleExpandAll"
  | "searchValue"
  | "selectedSpan"
  | "selectedTrace"
  | "selectedTraceSpans"
  | "setExpandedSpansIds"
  | "setSearchValue"
  | "setSelectedSpan"
>;
