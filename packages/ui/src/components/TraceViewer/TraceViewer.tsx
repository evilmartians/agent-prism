import type { TraceRecord, TraceSpan } from "@evilmartians/agent-prism-types";

import {
  filterSpansRecursively,
  flattenSpans,
} from "@evilmartians/agent-prism-data";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { type BadgeProps } from "../Badge";
import { useIsMobile, type ColorVariant } from "../shared";
import { type SpanCardViewOptions } from "../SpanCard/SpanCard";
import { TraceViewerDesktopLayout } from "./TraceViewerDesktopLayout";
import { TraceViewerMobileLayout } from "./TraceViewerMobileLayout";

export interface TraceViewerData {
  traceRecord: TraceRecord;
  badges?: Array<BadgeProps>;
  spans: TraceSpan[];
  spanCardViewOptions?: SpanCardViewOptions;
}

export interface TraceViewerProps {
  data?: Array<TraceViewerData>;

  traceListMetadata?: TraceInfo[];
  selectedTraceData?: TraceViewerData | null;
  selectedTraceId?: string | null;
  onTraceSelect?: (traceId: string) => void;
  onClearSelection?: () => void;
  loadingSelectedTrace?: boolean;

  spanCardViewOptions?: SpanCardViewOptions;
}

export const TraceViewer = ({
  data,
  traceListMetadata,
  selectedTraceData,
  selectedTraceId,
  onTraceSelect,
  onClearSelection,
  loadingSelectedTrace = false,
  spanCardViewOptions,
}: TraceViewerProps) => {
  const isProgressiveMode = traceListMetadata !== undefined;
  const isMobile = useIsMobile();
  const hasInitialized = React.useRef(false);

  const [selectedSpan, setSelectedSpan] = useState<TraceSpan | undefined>();
  const [searchValue, setSearchValue] = useState("");
  const [traceListExpanded, setTraceListExpanded] = useState(true);

  const [selectedTrace, setSelectedTrace] = useState<
    TraceRecordWithDisplayData | undefined
  >(
    data?.[0]
      ? {
          ...data[0].traceRecord,
          badges: data[0].badges,
          spanCardViewOptions: data[0].spanCardViewOptions,
        }
      : undefined,
  );
  const [selectedTraceSpans, setSelectedTraceSpans] = useState<TraceSpan[]>(
    data?.[0]?.spans || [],
  );

  const traceRecords: TraceRecordWithDisplayData[] = useMemo(() => {
    if (isProgressiveMode && traceListMetadata) {
      return traceListMetadata.map((meta) => ({
        id: meta.trace_id,
        name: meta.root_span_name,
        spansCount: meta.total_spans || 0,
        durationMs: 0,
        agentDescription: meta.resource_attributes["app.name"] || "Unknown",
        startTime: new Date(meta.root_span_start_time).getTime(),
        badges: [
          ...(meta.resource_attributes["app.name"]
            ? [
                {
                  theme: "indigo" as ColorVariant,
                  label: meta.resource_attributes["app.name"],
                },
              ]
            : []),
          ...(meta.resource_attributes["app.environment"]
            ? [
                {
                  theme: "teal" as ColorVariant,
                  label: meta.resource_attributes["app.environment"],
                },
              ]
            : []),
        ],
      }));
    }

    return (data || []).map((item) => ({
      ...item.traceRecord,
      badges: item.badges,
      spanCardViewOptions: item.spanCardViewOptions,
    }));
  }, [isProgressiveMode, traceListMetadata, data]);

  const currentSelectedTrace = isProgressiveMode
    ? selectedTraceData
      ? {
          ...selectedTraceData.traceRecord,
          badges: selectedTraceData.badges,
          spanCardViewOptions: selectedTraceData.spanCardViewOptions,
        }
      : undefined
    : selectedTrace;

  const currentSpans = useMemo(() => {
    return isProgressiveMode
      ? selectedTraceData?.spans || []
      : selectedTraceSpans;
  }, [isProgressiveMode, selectedTraceData?.spans, selectedTraceSpans]);

  const filteredSpans = useMemo(() => {
    if (!searchValue.trim()) {
      return currentSpans;
    }
    return filterSpansRecursively(currentSpans, searchValue);
  }, [currentSpans, searchValue]);

  const allIds = useMemo(() => {
    return flattenSpans(currentSpans).map((span) => span.id);
  }, [currentSpans]);

  const [expandedSpansIds, setExpandedSpansIds] = useState<string[]>(allIds);

  useEffect(() => {
    setExpandedSpansIds(allIds);
  }, [allIds]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
    }

    if (!isMobile && currentSpans.length > 0 && !selectedSpan) {
      setSelectedSpan(currentSpans[0]);
    }
  }, [currentSpans, isMobile, selectedSpan]);

  useEffect(() => {
    if (loadingSelectedTrace) {
      setSelectedSpan(undefined);
      setExpandedSpansIds([]);
      setSearchValue("");
    }
  }, [loadingSelectedTrace]);

  useEffect(() => {
    if (isProgressiveMode) {
      setSelectedSpan(undefined);
      setExpandedSpansIds([]);
    }
  }, [isProgressiveMode, selectedTraceId]);

  const handleExpandAll = useCallback(() => {
    setExpandedSpansIds(allIds);
  }, [allIds]);

  const handleCollapseAll = useCallback(() => {
    setExpandedSpansIds([]);
  }, []);

  const handleTraceSelect = useCallback(
    (trace: TraceRecord) => {
      setSelectedSpan(undefined);
      setExpandedSpansIds([]);

      if (isProgressiveMode && onTraceSelect) {
        onTraceSelect(trace.id);
      } else {
        setSelectedTrace(trace);
        setSelectedTraceSpans(
          (data || []).find((item) => item.traceRecord.id === trace.id)
            ?.spans ?? [],
        );
      }
    },
    [isProgressiveMode, onTraceSelect, data],
  );

  const handleClearTraceSelection = useCallback(() => {
    if (isProgressiveMode) {
      if (onClearSelection) {
        onClearSelection();
      }
    } else {
      setSelectedTrace(undefined);
      setSelectedTraceSpans([]);
    }
    setSelectedSpan(undefined);
    setExpandedSpansIds([]);
  }, [isProgressiveMode, onClearSelection]);

  const props: TraceViewerLayoutProps = {
    traceRecords,
    traceListExpanded,
    setTraceListExpanded,
    selectedTrace: currentSelectedTrace,
    selectedTraceId: isProgressiveMode
      ? selectedTraceId
      : currentSelectedTrace?.id,
    selectedSpan,
    setSelectedSpan,
    searchValue,
    setSearchValue,
    filteredSpans,
    expandedSpansIds,
    setExpandedSpansIds,
    handleExpandAll,
    handleCollapseAll,
    handleTraceSelect,
    loadingSelectedTrace,
    spanCardViewOptions:
      spanCardViewOptions || currentSelectedTrace?.spanCardViewOptions,
    onClearTraceSelection: handleClearTraceSelection,
  };

  return (
    <div className="h-full">
      <div className="hidden h-full lg:block">
        <TraceViewerDesktopLayout {...props} />
      </div>
      <div className="h-full lg:hidden">
        <TraceViewerMobileLayout {...props} />
      </div>
    </div>
  );
};

export interface TraceRecordWithDisplayData extends TraceRecord {
  spanCardViewOptions?: SpanCardViewOptions;
  badges?: BadgeProps[];
}

export interface TraceViewerLayoutProps {
  traceRecords: TraceRecordWithDisplayData[];
  traceListExpanded: boolean;
  setTraceListExpanded: (expanded: boolean) => void;
  selectedTrace: TraceRecordWithDisplayData | undefined;
  selectedTraceId?: string | null;
  selectedSpan: TraceSpan | undefined;
  setSelectedSpan: (span: TraceSpan | undefined) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  filteredSpans: TraceSpan[];
  expandedSpansIds: string[];
  setExpandedSpansIds: (ids: string[]) => void;
  handleExpandAll: () => void;
  handleCollapseAll: () => void;
  handleTraceSelect: (trace: TraceRecord) => void;
  loadingSelectedTrace: boolean;
  spanCardViewOptions?: SpanCardViewOptions;
  onClearTraceSelection?: () => void;
}
