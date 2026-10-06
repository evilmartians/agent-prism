import {
  DetailsView,
  TraceViewerPlaceholder,
  TraceViewerTreeViewContainer,
} from "@evilmartians/agent-prism-ui";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import type { SimpleTraceViewerLayoutProps } from "@/types";

export const SimpleTraceViewerDesktopLayout = ({
  expandedSpansIds,
  filteredSpans,
  handleCollapseAll,
  handleExpandAll,
  searchValue,
  selectedSpan,
  selectedTrace,
  selectedTraceSpans,
  setExpandedSpansIds,
  setSearchValue,
  setSelectedSpan,
}: SimpleTraceViewerLayoutProps) => {
  return (
    <PanelGroup className="h-full" direction="horizontal">
      <Panel
        className="flex h-full flex-col overflow-hidden pr-2"
        defaultSize={60}
        id="tree-view"
        minSize={40}
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
          showHeader={false}
        />
      </Panel>
      <PanelResizeHandle className="mx-2" />{" "}
      <Panel
        className="h-full overflow-hidden"
        defaultSize={40}
        id="details-view"
        maxSize={60}
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
