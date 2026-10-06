import type {
  ReadonlyProps,
  TraceViewerLayoutProps,
} from "@evilmartians/agent-prism-ui";

export type SimpleTraceViewerLayoutProps = ReadonlyProps<
  Pick<
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
  >
>;
