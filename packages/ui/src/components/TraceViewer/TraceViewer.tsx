import type {
  DeepReadonly,
  TraceRecord,
  TraceSpan,
} from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import {
  filterSpansRecursively,
  flattenSpans,
} from "@evilmartians/agent-prism-data";
import { useCallback, useMemo, useState } from "react";

import type { ReadonlyProps } from "../ReadonlyProps";

import { type BadgeProps } from "../Badge";
import { type SpanCardViewOptions } from "../SpanCard/SpanCard";
import { useIsMobile } from "../useIsMobile";
import { useIsMounted } from "../useIsMounted";
import { TraceViewerDesktopLayout } from "./TraceViewerDesktopLayout";
import { TraceViewerMobileLayout } from "./TraceViewerMobileLayout";

export type TraceViewerData = TraceDisplayData & {
  spans: TraceSpan[];
  traceRecord: TraceRecord;
};

export type TraceViewerProps = {
  data: TraceViewerData[];
  spanCardViewOptions?: SpanCardViewOptions | undefined;
};

type ReadonlySpan = DeepReadonly<TraceSpan>;

type ReadonlyTraceRecord = DeepReadonly<TraceRecordWithDisplayData>;

type TraceDisplayData = {
  badges?: Omit<BadgeProps, "ref">[] | undefined;
  spanCardViewOptions?: SpanCardViewOptions | undefined;
};

export const TraceViewer = ({
  data,
  spanCardViewOptions,
}: ReadonlyProps<TraceViewerProps>): ReactElement => {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  const [selectedSpan, setSelectedSpan] = useState<ReadonlySpan | undefined>();
  const [searchValue, setSearchValue] = useState("");
  const [traceListExpanded, setTraceListExpanded] = useState(true);

  const [selectedTrace, setSelectedTrace] = useState<
    ReadonlyTraceRecord | undefined
  >(
    data[0]
      ? {
          ...data[0].traceRecord,
          badges: data[0].badges,
          spanCardViewOptions: data[0].spanCardViewOptions,
        }
      : undefined,
  );
  const [selectedTraceSpans, setSelectedTraceSpans] = useState<
    readonly ReadonlySpan[]
  >(data[0]?.spans ?? []);

  const traceRecords: readonly ReadonlyTraceRecord[] = useMemo(() => {
    return data.map((item) => ({
      ...item.traceRecord,
      badges: item.badges,
      spanCardViewOptions: item.spanCardViewOptions,
    }));
  }, [data]);

  const filteredSpans = useMemo(() => {
    if (!searchValue.trim()) {
      return selectedTraceSpans;
    }
    return filterSpansRecursively(selectedTraceSpans, searchValue);
  }, [selectedTraceSpans, searchValue]);

  const allIds = useMemo(() => {
    return flattenSpans(selectedTraceSpans).map((span) => span.id);
  }, [selectedTraceSpans]);

  const [expandedSpansIds, setExpandedSpansIds] =
    useState<readonly string[]>(allIds);
  const [expandedSourceIds, setExpandedSourceIds] = useState(allIds);

  if (expandedSourceIds !== allIds) {
    setExpandedSourceIds(allIds);
    setExpandedSpansIds(allIds);
  }

  if (isMounted && !isMobile && !selectedSpan && selectedTraceSpans[0]) {
    setSelectedSpan(selectedTraceSpans[0]);
  }

  const handleExpandAll = useCallback(() => {
    setExpandedSpansIds(allIds);
  }, [allIds]);

  const handleCollapseAll = useCallback(() => {
    setExpandedSpansIds([]);
  }, []);

  const handleTraceSelect = useCallback(
    (trace: Readonly<TraceRecord>) => {
      setSelectedSpan(undefined);
      setExpandedSpansIds([]);
      setSelectedTrace(trace);
      setSelectedTraceSpans(
        data.find((item) => item.traceRecord.id === trace.id)?.spans ?? [],
      );
    },
    [data],
  );

  const handleClearTraceSelection = useCallback(() => {
    setSelectedTrace(undefined);
    setSelectedTraceSpans([]);
    setSelectedSpan(undefined);
    setExpandedSpansIds([]);
  }, []);

  const props: ReadonlyProps<TraceViewerLayoutProps> = {
    expandedSpansIds,
    filteredSpans,
    handleCollapseAll,
    handleExpandAll,
    handleTraceSelect,
    onClearTraceSelection: handleClearTraceSelection,
    searchValue,
    selectedSpan,
    selectedTrace,
    selectedTraceId: selectedTrace?.id,
    selectedTraceSpans,
    setExpandedSpansIds,
    setSearchValue,
    setSelectedSpan,
    setTraceListExpanded,
    spanCardViewOptions:
      spanCardViewOptions ?? selectedTrace?.spanCardViewOptions,
    traceListExpanded,
    traceRecords,
  };

  return (
    <div className="h-[calc(100vh-50px)]">
      <div className="hidden h-full lg:block">
        <TraceViewerDesktopLayout {...props} />
      </div>
      <div className="h-full lg:hidden">
        <TraceViewerMobileLayout {...props} />
      </div>
    </div>
  );
};

export type TraceRecordWithDisplayData = TraceDisplayData & TraceRecord;

export type TraceViewerLayoutProps = {
  expandedSpansIds: string[];
  filteredSpans: TraceSpan[];
  handleCollapseAll: () => void;
  handleExpandAll: () => void;
  handleTraceSelect: (trace: Readonly<TraceRecord>) => void;
  onClearTraceSelection: () => void;
  searchValue: string;
  selectedSpan: TraceSpan | undefined;
  selectedTrace: TraceRecordWithDisplayData | undefined;
  selectedTraceId?: string | undefined;
  selectedTraceSpans?: TraceSpan[] | undefined;
  setExpandedSpansIds: (ids: readonly string[]) => void;
  setSearchValue: (value: string) => void;
  setSelectedSpan: (span: ReadonlySpan | undefined) => void;
  setTraceListExpanded: (expanded: boolean) => void;
  spanCardViewOptions?: SpanCardViewOptions | undefined;
  traceListExpanded: boolean;
  traceRecords: TraceRecordWithDisplayData[];
};
