"use client";

import type { TraceSpan } from "@evilmartians/agent-prism-types";

import {
  filterSpansRecursively,
  flattenSpans,
} from "@evilmartians/agent-prism-data";
import {
  useIsMobile,
  type TraceRecordWithDisplayData,
  type TraceViewerLayoutProps,
} from "@evilmartians/agent-prism-ui";
import { useCallback, useEffect, useMemo, useState } from "react";

import { SimpleTraceViewerDesktopLayout } from "./SimpleTraceViewerDesktopLayout";
import { SimpleTraceViewerMobileLayout } from "./SimpleTraceViewerMobileLayout";

interface SimpleTraceViewerProps {
  spans: TraceSpan[];
}

export const SimpleTraceViewer = ({ spans }: SimpleTraceViewerProps) => {
  const isMobile = useIsMobile();
  const [selectedSpan, setSelectedSpan] = useState<TraceSpan | undefined>();
  const [searchValue, setSearchValue] = useState("");

  const filteredSpans = useMemo(() => {
    return filterSpansRecursively(spans, searchValue);
  }, [spans, searchValue]);

  const allIds = useMemo(() => {
    return flattenSpans(spans).map((span) => span.id);
  }, [spans]);

  const [expandedSpansIds, setExpandedSpansIds] = useState<string[]>([]);

  useEffect(() => {
    setExpandedSpansIds(allIds);
  }, [allIds]);

  useEffect(() => {
    if (!isMobile && spans.length > 0 && !selectedSpan) {
      setSelectedSpan(spans[0]);
    }
  }, [spans, selectedSpan, isMobile]);

  const handleExpandAll = useCallback(() => {
    setExpandedSpansIds(allIds);
  }, [allIds]);

  const handleCollapseAll = useCallback(() => {
    setExpandedSpansIds([]);
  }, []);

  const fakeTrace: TraceRecordWithDisplayData = {
    id: "single-trace",
    name: "Trace",
    spansCount: spans.length,
    durationMs: 0,
    agentDescription: "",
  };

  const layoutProps: Partial<TraceViewerLayoutProps> = {
    selectedTrace: fakeTrace,
    selectedSpan,
    setSelectedSpan,
    searchValue,
    setSearchValue,
    filteredSpans,
    expandedSpansIds,
    setExpandedSpansIds,
    handleExpandAll,
    handleCollapseAll,
  };

  if (!spans || spans.length === 0) {
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
