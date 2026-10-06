"use client";

import type { TraceSpan } from "@evilmartians/agent-prism-types";

import {
  filterSpansRecursively,
  flattenSpans,
} from "@evilmartians/agent-prism-data";
import {
  type TraceRecordWithDisplayData,
  useIsMobile,
  useIsMounted,
} from "@evilmartians/agent-prism-ui";
import { useCallback, useMemo, useState } from "react";

import type { SimpleTraceViewerLayoutProps } from "@/types";

import { SimpleTraceViewerDesktopLayout } from "./SimpleTraceViewerDesktopLayout";
import { SimpleTraceViewerMobileLayout } from "./SimpleTraceViewerMobileLayout";

type SimpleTraceViewerProps = {
  spans: TraceSpan[];
};

export const SimpleTraceViewer = ({ spans }: SimpleTraceViewerProps) => {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const [selectedSpan, setSelectedSpan] = useState<TraceSpan | undefined>();
  const [searchValue, setSearchValue] = useState("");

  const filteredSpans = useMemo(() => {
    return filterSpansRecursively(spans, searchValue);
  }, [spans, searchValue]);

  const allIds = useMemo(() => {
    return flattenSpans(spans).map((span) => span.id);
  }, [spans]);

  const [expandedSpansIds, setExpandedSpansIds] = useState<string[]>(allIds);
  const [expandedSourceIds, setExpandedSourceIds] = useState(allIds);

  if (expandedSourceIds !== allIds) {
    setExpandedSourceIds(allIds);
    setExpandedSpansIds(allIds);
  }

  if (isMounted && !isMobile && !selectedSpan && spans[0]) {
    setSelectedSpan(spans[0]);
  }

  const handleExpandAll = useCallback(() => {
    setExpandedSpansIds(allIds);
  }, [allIds]);

  const handleCollapseAll = useCallback(() => {
    setExpandedSpansIds([]);
  }, []);

  const fakeTrace: TraceRecordWithDisplayData = {
    agentDescription: "",
    durationMs: 0,
    id: "single-trace",
    name: "Trace",
    spansCount: spans.length,
  };

  const layoutProps: SimpleTraceViewerLayoutProps = {
    expandedSpansIds,
    filteredSpans,
    handleCollapseAll,
    handleExpandAll,
    searchValue,
    selectedSpan,
    selectedTrace: fakeTrace,
    selectedTraceSpans: spans,
    setExpandedSpansIds,
    setSearchValue,
    setSelectedSpan,
  };

  if (spans.length === 0) {
    return (
      <div className="flex items-center justify-center rounded bg-gray-100 p-8 text-center text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        No trace data available
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-50px)]">
      <div className="hidden h-full lg:block">
        <SimpleTraceViewerDesktopLayout {...layoutProps} />
      </div>
      <div className="h-full lg:hidden">
        <SimpleTraceViewerMobileLayout {...layoutProps} />
      </div>
    </div>
  );
};
