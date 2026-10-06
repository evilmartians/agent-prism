import type { ReactElement } from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { DetailsView } from "../DetailsView/DetailsView";
import { TraceList } from "../TraceList/TraceList";
import { type TraceViewerLayoutProps } from "./TraceViewer";
import { TraceViewerPlaceholder } from "./TraceViewerPlaceholder";
import { TraceViewerTreeViewContainer } from "./TraceViewerTreeViewContainer";

export const TraceViewerDesktopLayout = ({
  expandedSpansIds,
  filteredSpans,
  handleCollapseAll,
  handleExpandAll,
  handleTraceSelect,
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
  const actualSelectedTrace =
    traceRecords.find((t) => t.id === selectedTraceId) || selectedTrace;

  return (
    <PanelGroup className="h-full" direction="horizontal">
      <Panel
        className="flex h-full min-h-0 flex-col overflow-hidden"
        collapsible={false}
        defaultSize={traceListExpanded ? 20 : 2}
        id="trace-list"
        maxSize={traceListExpanded ? 40 : 2}
        minSize={traceListExpanded ? 15 : 2}
      >
        <TraceList
          expanded={traceListExpanded}
          onExpandStateChange={setTraceListExpanded}
          onTraceSelect={handleTraceSelect}
          selectedTrace={actualSelectedTrace}
          traces={traceRecords}
        />
      </Panel>

      <PanelResizeHandle />

      {selectedTrace ? (
        <Panel
          className="flex h-full flex-col gap-y-2 overflow-hidden"
          id="tree-view"
          minSize={30}
        >
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
        </Panel>
      ) : (
        <Panel
          className="flex h-full items-center justify-center"
          id="tree-view"
          minSize={30}
        >
          <TraceViewerPlaceholder title="Select a trace to see the details" />
        </Panel>
      )}

      <PanelResizeHandle />

      <Panel
        className="h-full overflow-hidden"
        defaultSize={30}
        id="details-view"
        maxSize={50}
        minSize={20}
      >
        {selectedSpan ? (
          <DetailsView allSpans={selectedTraceSpans} data={selectedSpan} />
        ) : (
          <TraceViewerPlaceholder title="Select a span to see the details" />
        )}
      </Panel>
    </PanelGroup>
  );
};
