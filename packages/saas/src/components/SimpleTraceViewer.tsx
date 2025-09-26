"use client";

import type { TraceSpan } from "@evilmartians/agent-prism-types";

import {
  filterSpansRecursively,
  flattenSpans,
} from "@evilmartians/agent-prism-data";
import {
  CollapseAllButton,
  ExpandAllButton,
  DetailsView,
  SearchInput,
  TreeView,
} from "@evilmartians/agent-prism-ui";
import { useCallback, useEffect, useMemo, useState } from "react";

interface SimpleTraceViewerProps {
  spans: TraceSpan[];
}

export const SimpleTraceViewer = ({ spans }: SimpleTraceViewerProps) => {
  const [selectedSpan, setSelectedSpan] = useState<TraceSpan | undefined>();
  const [searchValue, setSearchValue] = useState("");
  const [showDetails, setShowDetails] = useState(false);

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
    if (spans.length > 0 && !selectedSpan) {
      setSelectedSpan(spans[0]);
    }
  }, [spans, selectedSpan]);

  const handleExpandAll = useCallback(() => {
    setExpandedSpansIds(allIds);
  }, [allIds]);

  const handleCollapseAll = useCallback(() => {
    setExpandedSpansIds([]);
  }, []);

  const handleSpanSelect = useCallback((span: TraceSpan) => {
    setSelectedSpan(span);
    setShowDetails(true);
  }, []);

  const handleBackToList = useCallback(() => {
    setShowDetails(false);
  }, []);

  if (!spans || spans.length === 0) {
    return (
      <div className="flex items-center justify-center rounded bg-gray-100 p-8 text-center text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        No trace data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div
        className={`rounded border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 ${showDetails ? "hidden lg:block" : "block"}`}
      >
        <div className="flex flex-row gap-2 border-b border-gray-200 p-3 sm:items-center sm:justify-between dark:border-gray-800">
          <SearchInput
            id="span-search"
            name="search"
            onClear={() => setSearchValue("")}
            value={searchValue}
            onValueChange={setSearchValue}
            className="w-full sm:max-w-60 sm:flex-1"
          />

          <div className="flex items-center gap-2">
            <ExpandAllButton onExpandAll={handleExpandAll} />
            <CollapseAllButton onCollapseAll={handleCollapseAll} />
          </div>
        </div>

        {filteredSpans.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-200">
            No spans found
          </div>
        ) : (
          <TreeView
            spans={filteredSpans}
            onSpanSelect={handleSpanSelect}
            selectedSpan={selectedSpan}
            expandedSpansIds={expandedSpansIds}
            onExpandSpansIdsChange={setExpandedSpansIds}
          />
        )}
      </div>

      <div className={`${showDetails ? "block" : "hidden lg:block"}`}>
        {showDetails && (
          <button
            onClick={handleBackToList}
            className="mb-3 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to list
          </button>
        )}

        <div>
          {selectedSpan ? (
            <DetailsView data={selectedSpan} />
          ) : (
            <div className="flex items-center justify-center rounded bg-gray-100 p-8 text-center text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              Select a span to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
