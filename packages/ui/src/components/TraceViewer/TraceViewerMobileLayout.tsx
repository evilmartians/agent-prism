import type { ReactElement } from "react";

import { ArrowLeft } from "lucide-react";

import { Button } from "../Button";
import { DetailsView } from "../DetailsView/DetailsView";
import { TraceList } from "../TraceList/TraceList";
import { type TraceViewerLayoutProps } from "../TraceViewer/TraceViewer";
import { TraceViewerTreeViewContainer } from "./TraceViewerTreeViewContainer";

export const TraceViewerMobileLayout = ({
  expandedSpansIds,
  filteredSpans,
  handleCollapseAll,
  handleExpandAll,
  handleTraceSelect,
  onClearTraceSelection,
  searchValue,
  selectedSpan,
  selectedTrace,
  selectedTraceId,
  selectedTraceSpans,
  setExpandedSpansIds,
  setSearchValue,
  setSelectedSpan,
  setTraceListExpanded,
  spanCardViewOptions,
  traceListExpanded,
  traceRecords,
}: TraceViewerLayoutProps): ReactElement => {
  const hasTraceId = selectedTraceId !== undefined && selectedTraceId !== "";

  if (selectedTrace && hasTraceId && filteredSpans.length > 0 && selectedSpan) {
    return (
      <div className="flex h-full flex-col gap-4 overflow-y-auto">
        <Button
          className="self-start"
          iconStart={<ArrowLeft className="size-3" />}
          onClick={() => {
            setSelectedSpan(undefined);
          }}
          variant="ghost"
        >
          Tree View
        </Button>
        <DetailsView allSpans={selectedTraceSpans} data={selectedSpan} />
      </div>
    );
  }

  if (
    selectedTrace &&
    hasTraceId &&
    filteredSpans.length > 0 &&
    !selectedSpan
  ) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="shrink-0">
          <Button
            className="self-start"
            iconStart={<ArrowLeft className="size-3" />}
            onClick={() => {
              onClearTraceSelection();
            }}
            variant="ghost"
          >
            Traces list
          </Button>
        </div>

        <TraceViewerTreeViewContainer
          expandedSpansIds={expandedSpansIds}
          filteredSpans={filteredSpans}
          handleCollapseAll={handleCollapseAll}
          handleExpandAll={handleExpandAll}
          searchValue={searchValue}
          selectedSpan={selectedSpan}
          selectedTrace={selectedTrace}
          setExpandedSpansIds={setExpandedSpansIds}
          setSearchValue={setSearchValue}
          setSelectedSpan={setSelectedSpan}
          spanCardViewOptions={spanCardViewOptions}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <TraceList
        expanded={traceListExpanded}
        onExpandStateChange={setTraceListExpanded}
        onTraceSelect={handleTraceSelect}
        selectedTrace={traceRecords.find((t) => t.id === selectedTraceId)}
        traces={traceRecords}
      />
    </div>
  );
};
