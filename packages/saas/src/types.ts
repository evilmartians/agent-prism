import type { TraceViewerLayoutProps } from "@evilmartians/agent-prism-ui";

export type SimpleTraceViewerLayoutProps = Pick<
  TraceViewerLayoutProps,
  | "selectedTrace"
  | "selectedSpan"
  | "setSelectedSpan"
  | "searchValue"
  | "setSearchValue"
  | "filteredSpans"
  | "selectedTraceSpans"
  | "expandedSpansIds"
  | "setExpandedSpansIds"
  | "handleExpandAll"
  | "handleCollapseAll"
>;
